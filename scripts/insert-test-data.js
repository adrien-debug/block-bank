/**
 * Script pour insérer des données de test dans la base de données
 * Usage: node scripts/insert-test-data.js [userId]
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function insertTestData(userId) {
  console.log('🚀 Insertion des données de test...\n')

  try {
    // 1. Créer un score de crédit
    console.log('📊 Création du score de crédit...')
    const { data: creditScore, error: scoreError } = await supabase
      .from('credit_scores')
      .insert({
        user_id: userId,
        score: 750,
        tier: 'A',
        on_chain_score: 200,
        off_chain_score: 200,
        assets_score: 200,
        reputation_score: 150,
        previous_score: 720,
        model_version: 'v2.1',
        kyc_verified: true,
        aml_verified: true,
        verification_level: 'advanced'
      })
      .select()
      .single()

    if (scoreError) {
      console.error('❌ Erreur création score:', scoreError.message)
    } else {
      console.log('✅ Score de crédit créé:', creditScore.id)
    }

    // 2. Créer des NFT assets
    console.log('\n🎨 Création des NFT assets...')
    const nftAssets = [
      {
        user_id: userId,
        token_id: 'NFT-001',
        contract_address: '0x1234567890abcdef1234567890abcdef12345678',
        type: 'Immobilier',
        asset_type: 'REAL_ESTATE',
        name: 'Villa Paris',
        description: 'Appartement de luxe de 150m² dans le 16ème arrondissement de Paris',
        value: 300000,
        currency: 'USDC',
        current_value: 310000,
        original_value: 300000,
        status: 'available',
        risk_class: 'SAFE',
        risk_score: 25,
        marketplace: 'REALT',
        spv_name: 'SPV Paris Real Estate I',
        spv_jurisdiction: 'France',
        spv_registration_number: 'FR-123456789',
        spv_legal_form: 'Société Civile Immobilière',
        metadata_location: 'Paris 16ème, France',
        metadata_size: '150 m²',
        metadata_year_built: 2010,
        metadata_condition: 'Excellent',
        metadata_documentation_hash: 'QmXxxx...',
        metadata_inspection_date: '2024-01-10',
        metadata_maintenance_history: ['Inspection annuelle 2024', 'Rénovation 2020'],
        metadata_uri: 'ipfs://QmXxxx...',
        image_uri: '/Villa-paris.jpeg',
        owner_address: '0xabc...def'
      },
      {
        user_id: userId,
        token_id: 'NFT-002',
        contract_address: '0x567890abcdef1234567890abcdef1234567890ab',
        type: 'Mining',
        asset_type: 'MINING',
        name: 'Mining Farm',
        description: 'Installation de mining Bitcoin de 10MW avec 5000 ASICs',
        value: 150000,
        currency: 'USDC',
        current_value: 145000,
        original_value: 150000,
        status: 'available',
        risk_class: 'MODERATE',
        risk_score: 45,
        marketplace: '4K',
        spv_name: 'SPV Mining Operations I',
        spv_jurisdiction: 'Qatar',
        spv_registration_number: 'QA-987654321',
        spv_legal_form: 'Limited Liability Company',
        metadata_location: 'Doha, Qatar',
        metadata_size: '10 MW',
        metadata_year_built: 2022,
        metadata_condition: 'Bon',
        metadata_documentation_hash: 'QmYyyy...',
        metadata_inspection_date: '2024-01-05',
        metadata_maintenance_history: ['Maintenance trimestrielle', 'Mise à jour firmware'],
        metadata_uri: 'ipfs://QmYyyy...',
        image_uri: '/Mining1.webp',
        owner_address: '0xabc...def'
      }
    ]

    const { data: insertedNFTs, error: nftError } = await supabase
      .from('nft_assets')
      .insert(nftAssets)
      .select()

    if (nftError) {
      console.error('❌ Erreur création NFT assets:', nftError.message)
    } else {
      console.log(`✅ ${insertedNFTs.length} NFT assets créés`)
      const nft1Id = insertedNFTs[0].id
      const nft2Id = insertedNFTs[1].id

      // 3. Créer un prêt avec le premier NFT
      console.log('\n💰 Création d\'un prêt...')
      const loanNumber = `LOAN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      const { data: loan, error: loanError } = await supabase
        .from('loans')
        .insert({
          user_id: userId,
          loan_number: loanNumber,
          nft_asset_id: nft1Id,
          amount: 200000,
          currency: 'USDC',
          ltv: 65,
          rate: 5.5,
          term_months: 24,
          profile: 'BALANCED',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          next_payment_amount: 8750,
          remaining_balance: 200000,
          monthly_payment: 8750,
          down_payment: 0,
          status: 'active'
        })
        .select()
        .single()

      if (loanError) {
        console.error('❌ Erreur création prêt:', loanError.message)
      } else {
        console.log('✅ Prêt créé:', loan.loan_number)

        // Mettre à jour le NFT pour le marquer comme locked
        await supabase
          .from('nft_assets')
          .update({
            status: 'locked',
            locked_in_loan_id: loan.id
          })
          .eq('id', nft1Id)

        // 4. Créer des paiements
        console.log('\n💳 Création des paiements...')
        const payments = [
          {
            loan_id: loan.id,
            payment_number: 'PAY-001',
            amount: 8750,
            currency: 'USDC',
            payment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'paid',
            payment_method: 'AUTO',
            tx_hash: '0xpayment1...'
          },
          {
            loan_id: loan.id,
            payment_number: 'PAY-002',
            amount: 8750,
            currency: 'USDC',
            payment_date: new Date().toISOString().split('T')[0],
            status: 'pending',
            payment_method: 'AUTO'
          }
        ]

        const { data: insertedPayments, error: paymentError } = await supabase
          .from('payments')
          .insert(payments)
          .select()

        if (paymentError) {
          console.error('❌ Erreur création paiements:', paymentError.message)
        } else {
          console.log(`✅ ${insertedPayments.length} paiements créés`)
        }

        // 5. Créer une police d'assurance
        console.log('\n🛡️ Création d\'une police d\'assurance...')
        const policyNumber = `POL-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
        const { data: policy, error: policyError } = await supabase
          .from('insurance_policies')
          .insert({
            user_id: userId,
            loan_id: loan.id,
            policy_number: policyNumber,
            loan_number: loan.loan_number,
            loan_amount: 200000,
            currency: 'USDC',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            borrower_default_coverage: 75,
            market_risk_coverage: 50,
            asset_risk_coverage: 50,
            operational_risk_coverage: 0,
            legal_risk_coverage: 0,
            total_coverage: 75,
            annual_premium: 5000,
            monthly_premium: 416.67,
            credit_tier: 'A',
            nft_risk_class: 'SAFE',
            impact_on_ltv: 5,
            impact_on_rate: -0.5,
            covered_risks: ['BORROWER_DEFAULT', 'MARKET_RISK', 'ASSET_RISK'],
            status: 'active'
          })
          .select()
          .single()

        if (policyError) {
          console.error('❌ Erreur création police:', policyError.message)
        } else {
          console.log('✅ Police d\'assurance créée:', policy.policy_number)

          // Créer une entrée d'historique
          await supabase
            .from('insurance_history')
            .insert({
              policy_id: policy.id,
              entry_type: 'CREATED',
              description: `Police créée pour ${loan.loan_number}`,
              amount: 5000,
              currency: 'USDC'
            })
        }

        // 6. Créer des partenaires de crédit score
        console.log('\n🤝 Création des partenaires...')
        const partners = [
          {
            user_id: userId,
            platform: 'AAVE',
            platform_name: 'Aave Protocol',
            authorized: true,
            access_count: 5,
            last_accessed: new Date().toISOString(),
            read_score: true,
            read_metadata: true,
            read_full_data: false
          },
          {
            user_id: userId,
            platform: 'COMPOUND',
            platform_name: 'Compound Finance',
            authorized: true,
            access_count: 3,
            last_accessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            read_score: true,
            read_metadata: false,
            read_full_data: false
          }
        ]

        const { data: insertedPartners, error: partnerError } = await supabase
          .from('credit_score_partners')
          .insert(partners)
          .select()

        if (partnerError) {
          console.error('❌ Erreur création partenaires:', partnerError.message)
        } else {
          console.log(`✅ ${insertedPartners.length} partenaires créés`)
        }
      }
    }

    console.log('\n✅ Données de test insérées avec succès!')
    console.log('\n📋 Résumé:')
    console.log('   - 1 score de crédit')
    console.log('   - 2 NFT assets')
    console.log('   - 1 prêt actif')
    console.log('   - 2 paiements')
    console.log('   - 1 police d\'assurance')
    console.log('   - 2 partenaires de crédit score')

  } catch (error) {
    console.error('❌ Erreur générale:', error)
    process.exit(1)
  }
}

// Récupérer l'userId depuis les arguments
const userId = process.argv[2]

if (!userId) {
  console.error('❌ Usage: node scripts/insert-test-data.js <userId>')
  console.log('\n💡 Pour obtenir un userId, connectez-vous à l\'application et regardez les cookies ou la console.')
  process.exit(1)
}

insertTestData(userId)
  .then(() => {
    console.log('\n✨ Terminé!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })


