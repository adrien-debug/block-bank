import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { calculateCreditScore } from '@/lib/services/creditScoreCalculator'

export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier si on doit recalculer (paramètre ?recalculate=true)
    const { searchParams } = new URL(request.url)
    const shouldRecalculate = searchParams.get('recalculate') === 'true'

    // Récupérer le score de crédit le plus récent (lié à users via foreign key)
    const { data: creditScore, error } = await supabaseAdmin
      .from('credit_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur récupération credit score:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du score' },
        { status: 500 }
      )
    }

    // Vérifier si le score doit être recalculé
    // Désactiver le calcul automatique pour éviter de bloquer la connexion
    // Le calcul sera fait uniquement si explicitement demandé via ?recalculate=true
    let shouldCalculate = false
    if (shouldRecalculate) {
      shouldCalculate = true
    }
    // Désactiver le calcul automatique pour l'instant
    // else if (!creditScore) {
    //   // Pas de score existant
    //   shouldCalculate = true
    // } else {
    //   // Vérifier si le score est trop ancien (plus de 7 jours)
    //   const scoreAge = Date.now() - new Date(creditScore.created_at).getTime()
    //   const sevenDays = 7 * 24 * 60 * 60 * 1000
    //   if (scoreAge > sevenDays) {
    //     shouldCalculate = true
    //   }
    // }

    let finalScore = creditScore

    // Calculer le nouveau score si nécessaire
    if (shouldCalculate) {
      try {
        // Calculer le score à partir des données réelles
        // Utiliser un timeout pour éviter que le calcul bloque trop longtemps
        let calculatedScore: Awaited<ReturnType<typeof calculateCreditScore>>
        try {
          calculatedScore = await Promise.race([
            calculateCreditScore(userId),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Timeout calcul credit score')), 10000)
            )
          ])
        } catch (timeoutError) {
          // Si timeout, utiliser un calcul direct sans timeout
          calculatedScore = await calculateCreditScore(userId)
        }

        // Récupérer le score précédent
        const previousScore = creditScore?.score || null

        // Récupérer les infos utilisateur pour KYC/AML
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('kyc_verified, aml_verified, verification_level')
          .eq('id', userId)
          .single()

        // Créer ou mettre à jour le score
        const newScoreData = {
          user_id: userId,
          score: calculatedScore.totalScore,
          tier: calculatedScore.tier,
          on_chain_score: calculatedScore.onChainScore,
          off_chain_score: calculatedScore.offChainScore,
          assets_score: calculatedScore.assetsScore,
          reputation_score: calculatedScore.reputationScore,
          previous_score: previousScore,
          model_version: 'v2.1',
          kyc_verified: user?.kyc_verified || false,
          aml_verified: user?.aml_verified || false,
          verification_level: user?.verification_level || 'basic',
          issued_at: new Date().toISOString(),
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Valide 30 jours
        }

        const { data: newScore, error: createError } = await supabaseAdmin
          .from('credit_scores')
          .insert(newScoreData)
          .select()
          .single()

        if (createError) {
          console.error('Erreur création score calculé:', createError)
          // Si erreur, utiliser l'ancien score ou un score par défaut
          if (creditScore) {
            finalScore = creditScore
          } else {
            // Créer un score par défaut en dernier recours
            const defaultScore = {
              user_id: userId,
              score: calculatedScore.totalScore,
              tier: calculatedScore.tier,
              on_chain_score: calculatedScore.onChainScore,
              off_chain_score: calculatedScore.offChainScore,
              assets_score: calculatedScore.assetsScore,
              reputation_score: calculatedScore.reputationScore,
              previous_score: null,
              model_version: 'v2.1',
              kyc_verified: false,
              aml_verified: false,
              verification_level: 'basic'
            }

            const { data: fallbackScore } = await supabaseAdmin
              .from('credit_scores')
              .insert(defaultScore)
              .select()
              .single()

            finalScore = fallbackScore
          }
        } else {
          finalScore = newScore
        }
      } catch (calcError) {
        console.error('Erreur calcul credit score:', calcError)
        // En cas d'erreur, utiliser l'ancien score s'il existe
        // Ne pas bloquer la connexion si le calcul échoue
        if (!finalScore && creditScore) {
          finalScore = creditScore
        } else if (!finalScore) {
          // Si pas de score du tout, créer un score minimal par défaut
          console.log('Création score par défaut suite à erreur de calcul')
          try {
            const defaultScore = {
              user_id: userId,
              score: 600,
              tier: 'C',
              on_chain_score: 150,
              off_chain_score: 150,
              assets_score: 150,
              reputation_score: 50,
              previous_score: null,
              model_version: 'v2.1',
              kyc_verified: false,
              aml_verified: false,
              verification_level: 'basic'
            }

            const { data: fallbackScore } = await supabaseAdmin
              .from('credit_scores')
              .insert(defaultScore)
              .select()
              .single()

            if (fallbackScore) {
              finalScore = fallbackScore
            }
          } catch (fallbackError) {
            console.error('Erreur création score par défaut:', fallbackError)
            // Continuer sans score plutôt que de bloquer
          }
        }
      }
    }

    // Si toujours pas de score, créer un score par défaut minimal
    if (!finalScore) {
      const defaultScore = {
        user_id: userId,
        score: 600,
        tier: 'C',
        on_chain_score: 150,
        off_chain_score: 150,
        assets_score: 150,
        reputation_score: 50,
        previous_score: null,
        model_version: 'v2.1',
        kyc_verified: false,
        aml_verified: false,
        verification_level: 'basic'
      }

      const { data: newScore, error: createError } = await supabaseAdmin
        .from('credit_scores')
        .insert(defaultScore)
        .select()
        .single()

      if (createError) {
        console.error('Erreur création score par défaut:', createError)
        return NextResponse.json(
          { error: 'Erreur lors de la création du score' },
          { status: 500 }
        )
      }

      finalScore = newScore
    }

    // Récupérer les partenaires
    const { data: partners } = await supabaseAdmin
      .from('credit_score_partners')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false })

    return NextResponse.json({
      creditScore: finalScore,
      partners: partners || []
    }, { status: 200 })
  } catch (error: any) {
    console.error('Erreur API credit score:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('user_id')?.value
    const sessionToken = cookies().get('auth_session')?.value

    if (!userId || !sessionToken) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      score,
      tier,
      on_chain_score,
      off_chain_score,
      assets_score,
      reputation_score,
      nft_token_id,
      nft_contract_address,
      model_version = 'v2.1',
      valid_until,
      data_hash,
      kyc_verified = false,
      aml_verified = false,
      verification_level = 'basic'
    } = body

    // Récupérer le score précédent
    const { data: previousScore } = await supabaseAdmin
      .from('credit_scores')
      .select('score')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Créer un nouveau score
    const { data: creditScore, error } = await supabaseAdmin
      .from('credit_scores')
      .insert({
        user_id: userId,
        score: parseInt(score),
        tier,
        on_chain_score: on_chain_score ? parseInt(on_chain_score) : 0,
        off_chain_score: off_chain_score ? parseInt(off_chain_score) : 0,
        assets_score: assets_score ? parseInt(assets_score) : 0,
        reputation_score: reputation_score ? parseInt(reputation_score) : 0,
        previous_score: previousScore?.score || null,
        nft_token_id,
        nft_contract_address,
        model_version,
        valid_until,
        data_hash,
        kyc_verified,
        aml_verified,
        verification_level
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création credit score:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur lors de la création du score' },
        { status: 400 }
      )
    }

    return NextResponse.json({ creditScore }, { status: 201 })
  } catch (error: any) {
    console.error('Erreur API création credit score:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


