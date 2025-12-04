import { NextRequest, NextResponse } from 'next/server'
import { saveSubmission } from '@/lib/utils/submissionStorage'
import { AssetType, UserType } from '@/types/submission.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('[Asset Submission API] ========== START REQUEST ==========')
  console.log('[Asset Submission API] Timestamp:', new Date().toISOString())
  
  try {
    console.log('[Asset Submission API] Step 1: Parsing formData...')
    const formData = await request.formData()
    console.log('[Asset Submission API] Step 1: FormData parsed successfully')

    // Récupérer les données du formulaire
    console.log('[Asset Submission API] Step 2: Extracting form fields...')
    const userType = formData.get('userType') as UserType
    const assetType = formData.get('assetType') as AssetType
    const customAssetType = formData.get('customAssetType') as string | null
    const assetDescription = formData.get('assetDescription') as string
    const estimatedValue = formData.get('estimatedValue') as string
    const location = formData.get('location') as string
    const assetLink = formData.get('assetLink') as string | null
    const additionalInfo = formData.get('additionalInfo') as string | null
    
    console.log('[Asset Submission API] Step 2: Fields extracted', {
      userType,
      assetType,
      hasAssetDescription: !!assetDescription,
      hasEstimatedValue: !!estimatedValue,
      hasLocation: !!location
    })

    // Validation des champs obligatoires
    console.log('[Asset Submission API] Step 3: Validating required fields...')
    console.log('[Asset Submission API] Step 3: Field values:', {
      userType: userType || 'MISSING',
      assetType: assetType || 'MISSING',
      assetDescription: assetDescription ? (assetDescription.trim().length > 0 ? 'PRESENT' : 'EMPTY') : 'MISSING',
      estimatedValue: estimatedValue ? (estimatedValue.trim().length > 0 ? 'PRESENT' : 'EMPTY') : 'MISSING',
      location: location ? (location.trim().length > 0 ? 'PRESENT' : 'EMPTY') : 'MISSING'
    })
    
    const missingFields: string[] = []
    if (!userType) missingFields.push('userType')
    if (!assetType) missingFields.push('assetType')
    if (!assetDescription || !assetDescription.trim()) missingFields.push('assetDescription')
    if (!estimatedValue || !estimatedValue.trim()) missingFields.push('estimatedValue')
    if (!location || !location.trim()) missingFields.push('location')
    
    if (missingFields.length > 0) {
      console.log('[Asset Submission API] Step 3: Validation FAILED - missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Champs obligatoires manquants: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    console.log('[Asset Submission API] Step 3: Validation passed')

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
    console.log('[Asset Submission API] Step 4: Processing files...')
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
    
    const allFiles = [
      ...(files.passport || []),
      ...(files.identityDocument || []),
      ...(files.companyStatutes || []),
      ...(files.companyBalanceSheet || []),
      ...(files.companyRegistrationDoc || []),
      ...(files.assetDocuments || []),
      ...(files.additionalDocuments || [])
    ]
    const totalFileSize = allFiles.reduce((sum, file) => sum + (file.size || 0), 0)
    
    console.log('[Asset Submission API] Step 4: Files processed', {
      passportCount: files.passport?.length || 0,
      identityDocCount: files.identityDocument?.length || 0,
      companyStatutesCount: files.companyStatutes?.length || 0,
      balanceSheetCount: files.companyBalanceSheet?.length || 0,
      assetDocsCount: files.assetDocuments?.length || 0,
      additionalDocsCount: files.additionalDocuments?.length || 0,
      totalFileSize: totalFileSize,
      totalFileSizeMB: (totalFileSize / 1024 / 1024).toFixed(2)
    })

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

      // Sauvegarder la soumission
    console.log('[Asset Submission API] Step 5: Preparing submission data...')
    console.log('[Asset Submission API] Step 5: Submission data prepared', {
      userType: submissionData.userType,
      assetType: submissionData.assetType,
      hasOwnerName: !!submissionData.ownerName,
      hasCompanyName: !!submissionData.companyName,
      estimatedValue: submissionData.estimatedValue
    })
    
    try {
      console.log('[Asset Submission API] Step 6: Starting file storage...')
      
      const uploadStartTime = Date.now()
      const { submissionId, folderId } = await saveSubmission(submissionData, files)
      const uploadDuration = Date.now() - uploadStartTime
      
      console.log('[Asset Submission API] Step 6: Storage successful!', { 
        submissionId, 
        folderId,
        uploadDurationMs: uploadDuration,
        totalDurationMs: Date.now() - startTime
      })

      return NextResponse.json({
        success: true,
        submissionId,
        folderId,
        message: 'Your request has been submitted successfully',
      })
    } catch (storageError) {
      console.error('[Asset Submission API] Step 6: Storage error occurred', {
        error: storageError instanceof Error ? {
          message: storageError.message,
          stack: storageError.stack,
          name: storageError.name
        } : storageError,
        duration: Date.now() - startTime
      })
      
      const errorMessage = storageError instanceof Error 
        ? storageError.message 
        : 'An error occurred while saving your submission'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[Asset Submission API] ========== FATAL ERROR ==========', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error,
      duration: Date.now() - startTime
    })
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting your request'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

