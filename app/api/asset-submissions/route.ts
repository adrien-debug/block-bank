import { NextRequest, NextResponse } from 'next/server'
import { saveSubmission } from '@/lib/utils/submissionStorage'
import { AssetType, UserType } from '@/types/submission.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Récupérer les données du formulaire
    const userType = formData.get('userType') as UserType
    const assetType = formData.get('assetType') as AssetType
    const customAssetType = formData.get('customAssetType') as string | null
    const assetDescription = formData.get('assetDescription') as string
    const estimatedValue = formData.get('estimatedValue') as string
    const location = formData.get('location') as string
    const assetLink = formData.get('assetLink') as string | null
    const additionalInfo = formData.get('additionalInfo') as string | null

    // Validation des champs obligatoires
    if (!userType || !assetType || !assetDescription || !estimatedValue || !location) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Validation pour "Autre" type d'actif
    if (assetType === 'other' && !customAssetType?.trim()) {
      return NextResponse.json(
        { error: 'Veuillez spécifier le type d\'actif pour "Autre"' },
        { status: 400 }
      )
    }

    // Récupérer les données selon le type d'utilisateur
    let ownerName: string | undefined
    let ownerEmail: string | undefined
    let ownerPhone: string | undefined
    let companyName: string | undefined
    let companyEmail: string | undefined
    let companyPhone: string | undefined
    let companyRegistration: string | undefined
    let contactPersonName: string | undefined

    if (userType === 'individual') {
      ownerName = formData.get('ownerName') as string
      ownerEmail = formData.get('ownerEmail') as string
      ownerPhone = formData.get('ownerPhone') as string | undefined

        if (!ownerName || !ownerEmail) {
          return NextResponse.json(
            { error: 'Name and email are required for individuals' },
            { status: 400 }
          )
        }
    } else {
      companyName = formData.get('companyName') as string
      companyEmail = formData.get('companyEmail') as string
      companyPhone = formData.get('companyPhone') as string | undefined
      companyRegistration = formData.get('companyRegistration') as string | undefined
      contactPersonName = formData.get('contactPersonName') as string

      if (!companyName || !companyEmail || !contactPersonName) {
        return NextResponse.json(
          { error: 'Company name, email and contact person are required' },
          { status: 400 }
        )
      }
    }

    // Récupérer les fichiers
    const files: {
      passport?: File[]
      identityDocument?: File[]
      companyStatutes?: File[]
      companyBalanceSheet?: File[]
      companyRegistrationDoc?: File[]
      assetDocuments?: File[]
      additionalDocuments?: File[]
    } = {}

    // Documents particuliers
    const passportFiles = formData.getAll('passport') as File[]
    if (passportFiles.length > 0 && passportFiles[0] instanceof File && passportFiles[0].size > 0) {
      files.passport = passportFiles.filter(f => f instanceof File && f.size > 0)
    }

    const identityFiles = formData.getAll('identityDocument') as File[]
    if (identityFiles.length > 0 && identityFiles[0] instanceof File && identityFiles[0].size > 0) {
      files.identityDocument = identityFiles.filter(f => f instanceof File && f.size > 0)
    }

    // Documents entreprise
    const statutesFiles = formData.getAll('companyStatutes') as File[]
    if (statutesFiles.length > 0 && statutesFiles[0] instanceof File && statutesFiles[0].size > 0) {
      files.companyStatutes = statutesFiles.filter(f => f instanceof File && f.size > 0)
    }

    const balanceSheetFiles = formData.getAll('companyBalanceSheet') as File[]
    if (balanceSheetFiles.length > 0 && balanceSheetFiles[0] instanceof File && balanceSheetFiles[0].size > 0) {
      files.companyBalanceSheet = balanceSheetFiles.filter(f => f instanceof File && f.size > 0)
    }

    const registrationFiles = formData.getAll('companyRegistrationDoc') as File[]
    if (registrationFiles.length > 0 && registrationFiles[0] instanceof File && registrationFiles[0].size > 0) {
      files.companyRegistrationDoc = registrationFiles.filter(f => f instanceof File && f.size > 0)
    }

    // Documents de l'actif
    const assetFiles = formData.getAll('assetDocuments') as File[]
    if (assetFiles.length > 0 && assetFiles[0] instanceof File && assetFiles[0].size > 0) {
      files.assetDocuments = assetFiles.filter(f => f instanceof File && f.size > 0)
    }

    // Documents supplémentaires
    const additionalFiles = formData.getAll('additionalDocuments') as File[]
    if (additionalFiles.length > 0 && additionalFiles[0] instanceof File && additionalFiles[0].size > 0) {
      files.additionalDocuments = additionalFiles.filter(f => f instanceof File && f.size > 0)
    }

    // Validation des documents obligatoires
    if (userType === 'individual') {
      if (!files.passport || files.passport.length === 0) {
        return NextResponse.json(
          { error: 'Le passeport est obligatoire pour les particuliers' },
          { status: 400 }
        )
      }
    } else {
      if (!files.companyStatutes || files.companyStatutes.length === 0) {
        return NextResponse.json(
          { error: 'Les statuts de l\'entreprise sont obligatoires' },
          { status: 400 }
        )
      }
      if (!files.companyBalanceSheet || files.companyBalanceSheet.length === 0) {
        return NextResponse.json(
          { error: 'Le bilan financier est obligatoire pour les entreprises' },
          { status: 400 }
        )
      }
    }

    // Validation : au moins un document de l'actif (fichier ou lien)
    const hasAssetFiles = files.assetDocuments && files.assetDocuments.length > 0
    const hasAssetLink = assetLink && assetLink.trim().length > 0

    if (!hasAssetFiles && !hasAssetLink) {
      return NextResponse.json(
        { error: 'Veuillez fournir au moins un document de l\'actif (fichier ou lien)' },
        { status: 400 }
      )
    }

    // Validation du format URL si un lien est fourni
    if (hasAssetLink) {
      try {
        new URL(assetLink)
      } catch {
        return NextResponse.json(
          { error: 'Le lien fourni n\'est pas une URL valide' },
          { status: 400 }
        )
      }
    }

    // Récupérer les informations de paiement vendeur
    const sellerPaymentMethod = formData.get('sellerPaymentMethod') as string | null
    const sellerPreferredCurrency = formData.get('sellerPreferredCurrency') as string | null
    const sellerCryptoAddress = formData.get('sellerCryptoAddress') as string | null
    const sellerBankIban = formData.get('sellerBankIban') as string | null
    const sellerBankBic = formData.get('sellerBankBic') as string | null
    const sellerBankAccountHolder = formData.get('sellerBankAccountHolder') as string | null
    const sellerBankName = formData.get('sellerBankName') as string | null
    const sellerBankCurrency = formData.get('sellerBankCurrency') as string | null

    // Préparer les données de soumission
    const submissionData: any = {
      userType,
      assetType,
      customAssetType: customAssetType || undefined,
      assetDescription,
      estimatedValue,
      location,
      assetLink: assetLink || undefined,
      additionalInfo: additionalInfo || undefined,
      ownerName,
      ownerEmail,
      ownerPhone,
      companyName,
      companyEmail,
      companyPhone,
      companyRegistration,
      contactPersonName,
    }

    // Ajouter les informations de paiement vendeur si présentes
    if (sellerPaymentMethod) {
      submissionData.sellerPaymentMethod = sellerPaymentMethod as 'CRYPTO' | 'FIAT' | 'HYBRID'
      submissionData.sellerPreferredCurrency = sellerPreferredCurrency || undefined
      submissionData.sellerCryptoAddress = sellerCryptoAddress || undefined
      
      if ((sellerPaymentMethod === 'FIAT' || sellerPaymentMethod === 'HYBRID') && 
          sellerBankIban && sellerBankBic && sellerBankAccountHolder && sellerBankName && sellerBankCurrency) {
        submissionData.sellerBankAccount = {
          iban: sellerBankIban,
          bic: sellerBankBic,
          accountHolder: sellerBankAccountHolder,
          bankName: sellerBankName,
          currency: sellerBankCurrency as 'EUR' | 'USD' | 'GBP' | 'CHF'
        }
      }
    }

    // Sauvegarder la soumission dans Google Drive
    try {
      console.log('[Asset Submission] Starting Google Drive upload...')
      const { submissionId, folderId } = await saveSubmission(submissionData, files)
      console.log('[Asset Submission] Upload successful:', { submissionId, folderId })

      return NextResponse.json({
        success: true,
        submissionId,
        folderId,
        message: 'Your request has been submitted successfully',
      })
    } catch (driveError) {
      console.error('[Asset Submission] Google Drive error:', driveError)
      
      // Si Google Drive n'est pas configuré
      if (driveError instanceof Error && driveError.message.includes('GOOGLE_DRIVE_CONFIG_MISSING')) {
        return NextResponse.json(
          { error: 'Google Drive is not configured. Please check your environment variables.' },
          { status: 500 }
        )
      }
      
      // Erreur OAuth invalid_grant
      if (driveError instanceof Error && (driveError.message.includes('invalid_grant') || driveError.message.includes('Invalid grant'))) {
        console.error('[Asset Submission] OAuth error detected, this should not happen with Service Account')
        return NextResponse.json(
          { error: 'Authentication error with Google Drive. Please contact support.' },
          { status: 500 }
        )
      }
      
      // Autres erreurs Google Drive
      const errorMessage = driveError instanceof Error 
        ? driveError.message 
        : 'An error occurred while uploading to Google Drive'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Submission error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting your request'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

