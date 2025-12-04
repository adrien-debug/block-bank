'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ChartUpIcon from '@/components/icons/ChartUpIcon'
import UserIcon from '@/components/icons/UserIcon'
import BuildingIcon from '@/components/icons/BuildingIcon'
import RealEstateIcon from '@/components/icons/RealEstateIcon'
import VehicleIcon from '@/components/icons/VehicleIcon'
import GemIcon from '@/components/icons/GemIcon'
import CollectibleIcon from '@/components/icons/CollectibleIcon'
import PickaxeIcon from '@/components/icons/PickaxeIcon'
import InfrastructureIcon from '@/components/icons/InfrastructureIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import AttachmentIcon from '@/components/icons/AttachmentIcon'
import WarningIcon from '@/components/icons/WarningIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import PackageIcon from '@/components/icons/PackageIcon'
import { AssetType, UserType } from '@/types/submission.types'

const ASSET_TYPES: { value: AssetType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'real-estate', label: 'Real Estate', Icon: RealEstateIcon },
  { value: 'vehicle', label: 'Vehicle', Icon: VehicleIcon },
  { value: 'luxury', label: 'Luxury', Icon: GemIcon },
  { value: 'collectible', label: 'Collectible', Icon: CollectibleIcon },
  { value: 'mining', label: 'Mining', Icon: PickaxeIcon },
  { value: 'infrastructure', label: 'Infrastructure', Icon: InfrastructureIcon },
  { value: 'commercial', label: 'Commercial', Icon: PackageIcon },
  { value: 'other', label: 'Other', Icon: PlusIcon },
]

interface AssetSubmissionForm {
  userType: UserType | null
  // Champs individu
  ownerName: string
  ownerEmail: string
  ownerPhone?: string
  // Champs entreprise
  companyName: string
  companyEmail: string
  companyPhone?: string
  companyRegistration?: string
  contactPersonName: string
  // Champs communs
  assetType: AssetType
  customAssetType?: string
  assetDescription: string
  estimatedValue: string
  location: string
  assetLink?: string
  additionalInfo?: string
  // Documents
  passport?: FileList | null
  identityDocument?: FileList | null
  companyStatutes?: FileList | null
  companyBalanceSheet?: FileList | null
  companyRegistrationDoc?: FileList | null
  assetDocuments?: FileList | null
  additionalDocuments?: FileList | null
  termsAccepted: boolean
}

export default function AssetTokenizationRequestPage() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<AssetSubmissionForm>({
    userType: null,
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyRegistration: '',
    contactPersonName: '',
    assetType: 'real-estate',
    customAssetType: '',
    assetDescription: '',
    estimatedValue: '',
    location: '',
    assetLink: '',
    additionalInfo: '',
    passport: null,
    identityDocument: null,
    companyStatutes: null,
    companyBalanceSheet: null,
    companyRegistrationDoc: null,
    assetDocuments: null,
    additionalDocuments: null,
    termsAccepted: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setFormData(prev => ({
      ...prev,
      userType: type
    }))
    setSubmitError(null)
  }

  const handleAssetTypeSelect = (type: AssetType) => {
    setFormData(prev => ({
      ...prev,
      assetType: type,
      customAssetType: type === 'other' ? prev.customAssetType : ''
    }))
    setSubmitError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setSubmitError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    setFormData(prev => ({
      ...prev,
      [docType]: e.target.files
    }))
    setSubmitError(null)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: e.target.checked
    }))
  }

  const validateDocuments = (): boolean => {
    console.log('🔍 validateDocuments called')
    console.log('🔍 userType:', userType)
    console.log('🔍 formData.passport:', formData.passport?.length || 0)
    console.log('🔍 formData.companyStatutes:', formData.companyStatutes?.length || 0)
    console.log('🔍 formData.companyBalanceSheet:', formData.companyBalanceSheet?.length || 0)
    
    if (userType === 'individual') {
      if (!formData.passport || formData.passport.length === 0) {
        console.log('❌ validateDocuments: Passport missing for individual')
        setSubmitError('Passport is required for individuals')
        return false
      }
      console.log('✅ validateDocuments: Individual documents OK')
    } else if (userType === 'company') {
      if (!formData.companyStatutes || formData.companyStatutes.length === 0) {
        console.log('❌ validateDocuments: Company statutes missing')
        setSubmitError('Company statutes are required')
        return false
      }
      if (!formData.companyBalanceSheet || formData.companyBalanceSheet.length === 0) {
        console.log('❌ validateDocuments: Balance sheet missing')
        setSubmitError('Balance sheet is required for companies')
        return false
      }
      console.log('✅ validateDocuments: Company documents OK')
    }
    return true
  }

  const validateAssetDocuments = (): boolean => {
    console.log('🔍 validateAssetDocuments called')
    const hasFiles = formData.assetDocuments && formData.assetDocuments.length > 0
    const hasLink = formData.assetLink && formData.assetLink.trim().length > 0
    
    console.log('🔍 hasFiles:', hasFiles, 'hasLink:', hasLink)
    console.log('🔍 assetLink value:', formData.assetLink)
    
    if (!hasFiles && !hasLink) {
      console.log('❌ validateAssetDocuments: No files or link provided')
      setSubmitError('Please provide at least one asset document (file or link)')
      return false
    }

    if (hasLink) {
      try {
        new URL(formData.assetLink!)
        console.log('✅ validateAssetDocuments: Link is valid URL')
      } catch {
        console.log('❌ validateAssetDocuments: Link is not valid URL')
        setSubmitError('The provided link is not a valid URL')
        return false
      }
    }

    console.log('✅ validateAssetDocuments: Validation passed')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 ========== FORM SUBMIT CALLED ==========')
    console.log('🚀 Event:', e)
    console.log('🚀 Current state:', { userType, isSubmitting })
    console.log('🚀 Form data preview:', {
      assetType: formData.assetType,
      hasDescription: !!formData.assetDescription,
      hasValue: !!formData.estimatedValue,
      hasLocation: !!formData.location,
      termsAccepted: formData.termsAccepted
    })
    
    e.preventDefault()
    console.log('✅ Prevent default executed')
    
    if (!userType) {
      console.log('❌ VALIDATION FAILED: No userType selected')
      setIsSubmitting(false)
      setSubmitError('Please select a user type')
      return
    }
    console.log('✅ UserType validated:', userType)
    
    if (formData.assetType === 'other' && !formData.customAssetType?.trim()) {
      console.log('❌ VALIDATION FAILED: customAssetType missing')
      setIsSubmitting(false)
      setSubmitError('Please specify the asset type in the "Other" field')
      return
    }
    console.log('✅ Asset type validated:', formData.assetType)

    // Validation des champs obligatoires
    console.log('🔍 Validating required fields...')
    if (!formData.assetDescription || !formData.assetDescription.trim()) {
      console.log('❌ VALIDATION FAILED: assetDescription is empty')
      setIsSubmitting(false)
      setSubmitError('Asset description is required')
      return
    }
    if (!formData.estimatedValue || !formData.estimatedValue.trim()) {
      console.log('❌ VALIDATION FAILED: estimatedValue is empty')
      setIsSubmitting(false)
      setSubmitError('Estimated value is required')
      return
    }
    if (!formData.location || !formData.location.trim()) {
      console.log('❌ VALIDATION FAILED: location is empty')
      setIsSubmitting(false)
      setSubmitError('Location is required')
      return
    }
    console.log('✅ Required fields validated')

    // Validation des champs spécifiques au type d'utilisateur
    if (userType === 'individual') {
      if (!formData.ownerName || !formData.ownerName.trim()) {
        console.log('❌ VALIDATION FAILED: ownerName is empty')
        setIsSubmitting(false)
        setSubmitError('Full name is required')
        return
      }
      if (!formData.ownerEmail || !formData.ownerEmail.trim()) {
        console.log('❌ VALIDATION FAILED: ownerEmail is empty')
        setIsSubmitting(false)
        setSubmitError('Email is required')
        return
      }
    } else {
      if (!formData.companyName || !formData.companyName.trim()) {
        console.log('❌ VALIDATION FAILED: companyName is empty')
        setIsSubmitting(false)
        setSubmitError('Company name is required')
        return
      }
      if (!formData.companyEmail || !formData.companyEmail.trim()) {
        console.log('❌ VALIDATION FAILED: companyEmail is empty')
        setIsSubmitting(false)
        setSubmitError('Company email is required')
        return
      }
      if (!formData.contactPersonName || !formData.contactPersonName.trim()) {
        console.log('❌ VALIDATION FAILED: contactPersonName is empty')
        setIsSubmitting(false)
        setSubmitError('Contact person name is required')
        return
      }
    }
    console.log('✅ User-specific fields validated')

    console.log('🔍 Validating documents...')
    if (!validateDocuments()) {
      console.log('❌ VALIDATION FAILED: Documents validation failed')
      setIsSubmitting(false)
      return
    }
    console.log('✅ Documents validated')

    console.log('🔍 Validating asset documents...')
    if (!validateAssetDocuments()) {
      console.log('❌ VALIDATION FAILED: Asset documents validation failed')
      setIsSubmitting(false)
      return
    }
    console.log('✅ Asset documents validated')
    
    console.log('🔄 Setting isSubmitting to true...')
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      console.log('✅ State updated, starting FormData creation...')
    } catch (stateError) {
      console.error('❌ Error setting state:', stateError)
      setIsSubmitting(false)
      throw stateError
    }
    
    try {
      console.log('📦 Creating FormData object...')
      const formDataToSend = new FormData()
      formDataToSend.append('userType', userType)
      formDataToSend.append('assetType', formData.assetType)
      console.log('📦 Added basic fields to FormData')
      
      if (formData.assetType === 'other' && formData.customAssetType) {
        formDataToSend.append('customAssetType', formData.customAssetType.trim())
      }
      formDataToSend.append('assetDescription', formData.assetDescription.trim())
      formDataToSend.append('estimatedValue', formData.estimatedValue.trim())
      formDataToSend.append('location', formData.location.trim())
      
      console.log('📦 Adding user-specific fields...')
      if (userType === 'individual') {
        formDataToSend.append('ownerName', formData.ownerName.trim())
        formDataToSend.append('ownerEmail', formData.ownerEmail.trim())
        if (formData.ownerPhone && formData.ownerPhone.trim()) {
          formDataToSend.append('ownerPhone', formData.ownerPhone.trim())
        }
        if (formData.passport) {
          console.log('📦 Adding passport files:', formData.passport.length)
          Array.from(formData.passport).forEach((file, index) => {
            console.log(`📦 Adding passport file ${index + 1}:`, file.name, file.size, 'bytes')
            formDataToSend.append('passport', file)
          })
        }
        if (formData.identityDocument) {
          console.log('📦 Adding identity documents:', formData.identityDocument.length)
          Array.from(formData.identityDocument).forEach((file) => {
            formDataToSend.append('identityDocument', file)
          })
        }
      } else {
        formDataToSend.append('companyName', formData.companyName.trim())
        formDataToSend.append('companyEmail', formData.companyEmail.trim())
        formDataToSend.append('contactPersonName', formData.contactPersonName.trim())
        if (formData.companyPhone && formData.companyPhone.trim()) {
          formDataToSend.append('companyPhone', formData.companyPhone.trim())
        }
        if (formData.companyRegistration && formData.companyRegistration.trim()) {
          formDataToSend.append('companyRegistration', formData.companyRegistration.trim())
        }
        if (formData.companyStatutes) {
          console.log('📦 Adding company statutes:', formData.companyStatutes.length)
          Array.from(formData.companyStatutes).forEach((file) => {
            formDataToSend.append('companyStatutes', file)
          })
        }
        if (formData.companyBalanceSheet) {
          console.log('📦 Adding balance sheet:', formData.companyBalanceSheet.length)
          Array.from(formData.companyBalanceSheet).forEach((file) => {
            formDataToSend.append('companyBalanceSheet', file)
          })
        }
        if (formData.companyRegistrationDoc) {
          Array.from(formData.companyRegistrationDoc).forEach((file) => {
            formDataToSend.append('companyRegistrationDoc', file)
          })
        }
      }
      
      if (formData.assetDocuments) {
        console.log('📦 Adding asset documents:', formData.assetDocuments.length)
        Array.from(formData.assetDocuments).forEach((file, index) => {
          console.log(`📦 Adding asset doc ${index + 1}:`, file.name, file.size, 'bytes')
          formDataToSend.append('assetDocuments', file)
        })
      }
      
      if (formData.assetLink && formData.assetLink.trim()) {
        formDataToSend.append('assetLink', formData.assetLink.trim())
      }
      
      if (formData.additionalDocuments) {
        console.log('📦 Adding additional documents:', formData.additionalDocuments.length)
        Array.from(formData.additionalDocuments).forEach((file) => {
          formDataToSend.append('additionalDocuments', file)
        })
      }
      
      if (formData.additionalInfo && formData.additionalInfo.trim()) {
        formDataToSend.append('additionalInfo', formData.additionalInfo.trim())
      }

      console.log('🌐 FormData created. Preparing fetch request...')
      console.log('🌐 FormData size estimation:')
      let totalSize = 0
      for (const pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          totalSize += pair[1].size
        }
      }
      console.log('🌐 Total files size:', totalSize, 'bytes (', (totalSize / 1024 / 1024).toFixed(2), 'MB)')

      // Créer un AbortController pour le timeout
      const controller = new AbortController()
      const timeoutMs = 120000 // 2 minutes
      const fetchStartTime = Date.now()
      let timeoutReason = 'unknown'
      
      const timeoutId = setTimeout(() => {
        const elapsed = Date.now() - fetchStartTime
        timeoutReason = `Timeout after ${elapsed}ms (${(elapsed / 1000).toFixed(1)}s)`
        console.log('⏰ TIMEOUT REACHED:', timeoutReason)
        controller.abort()
      }, timeoutMs)

      console.log('🌐 Sending fetch request to /api/asset-submissions...')
      console.log('🌐 Request details:', {
        method: 'POST',
        url: '/api/asset-submissions',
        hasSignal: !!controller.signal,
        timestamp: new Date().toISOString(),
        timeoutSeconds: timeoutMs / 1000
      })
      console.log('🌐 Fetch call starting at:', fetchStartTime)
      console.log('🌐 Waiting for server response (timeout:', timeoutMs / 1000, 'seconds)...')
      
      let response
      try {
        response = await fetch('/api/asset-submissions', {
          method: 'POST',
          body: formDataToSend,
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        const fetchDuration = Date.now() - fetchStartTime
        console.log('🌐 Fetch call completed in:', fetchDuration, 'ms')
      } catch (fetchError) {
        clearTimeout(timeoutId)
        const fetchDuration = Date.now() - fetchStartTime
        console.error('❌ Fetch error after', fetchDuration, 'ms:', fetchError)
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('❌ Request was aborted. Reason:', timeoutReason)
          console.error('❌ Elapsed time:', fetchDuration, 'ms (', (fetchDuration / 1000).toFixed(1), 's)')
          if (fetchDuration >= timeoutMs - 1000) {
            // Le timeout s'est déclenché
            const abortError = new Error(`Request timeout after ${(fetchDuration / 1000).toFixed(1)} seconds. The upload is taking too long. Please try again with smaller files or check your connection.`)
            abortError.name = 'AbortError'
            throw abortError
          }
        }
        throw fetchError
      }
      
      const fetchDuration = Date.now() - fetchStartTime

      console.log('✅ Fetch completed!', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: fetchDuration + 'ms',
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        console.log('❌ Response not OK, parsing error...')
        console.log('❌ Response status:', response.status, response.statusText)
        console.log('❌ Response headers:', Object.fromEntries(response.headers.entries()))
        
        let errorMessage = 'Unknown error'
        try {
          // Cloner la réponse pour pouvoir lire le texte même si on a déjà accédé au body
          const clonedResponse = response.clone()
          const responseText = await clonedResponse.text()
          console.log('❌ Response text (raw):', responseText)
          console.log('❌ Response text length:', responseText.length)
          
          if (responseText && responseText.trim().length > 0) {
            // Essayer de parser comme JSON
            try {
              const data = JSON.parse(responseText)
              console.log('❌ Error response data (JSON):', data)
              errorMessage = data.error || data.message || `Error ${response.status}: ${response.statusText}`
            } catch (jsonError) {
              // Si ce n'est pas du JSON, utiliser le texte brut
              console.log('❌ Response is not JSON, using raw text')
              errorMessage = responseText.substring(0, 500) // Limiter à 500 caractères
            }
          } else {
            console.log('❌ Response body is empty')
            errorMessage = `Error ${response.status}: ${response.statusText || 'No response from server'}`
          }
        } catch (e) {
          console.log('❌ Failed to read response:', e)
          errorMessage = `Error ${response.status}: ${response.statusText || 'No response from server'}`
        }
        console.log('❌ Final error message:', errorMessage)
        throw new Error(errorMessage)
      }

      console.log('✅ Response OK, parsing JSON...')
      const data = await response.json()
      console.log('✅ Success! Response data:', data)

      setIsSubmitting(false)
      setSubmitSuccess(true)
      console.log('✅ State updated: isSubmitting=false, submitSuccess=true')
      
      setTimeout(() => {
        console.log('🔄 Resetting form...')
        setUserType(null)
        setFormData({
          userType: null,
          ownerName: '',
          ownerEmail: '',
          ownerPhone: '',
          companyName: '',
          companyEmail: '',
          companyPhone: '',
          companyRegistration: '',
          contactPersonName: '',
          assetType: 'real-estate',
          customAssetType: '',
          assetDescription: '',
          estimatedValue: '',
          location: '',
          assetLink: '',
          additionalInfo: '',
          passport: null,
          identityDocument: null,
          companyStatutes: null,
          companyBalanceSheet: null,
          companyRegistrationDoc: null,
          assetDocuments: null,
          additionalDocuments: null,
          termsAccepted: false
        })
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('❌ ========== ERROR CAUGHT ==========')
      console.error('❌ Error object:', error)
      console.error('❌ Error type:', typeof error)
      console.error('❌ Error instanceof Error:', error instanceof Error)
      
      if (error instanceof Error) {
        console.error('❌ Error name:', error.name)
        console.error('❌ Error message:', error.message)
        console.error('❌ Error stack:', error.stack)
        
        if (error.name === 'AbortError') {
          console.error('❌ Error is AbortError - Request was aborted')
          setSubmitError('Request timeout: The upload is taking too long. Please try again with smaller files or check your connection.')
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('❌ Error is NetworkError')
          setSubmitError('Network error: Please check your internet connection and try again.')
        } else {
          console.error('❌ Error is other type')
          setSubmitError(error.message || 'An error occurred while submitting your request')
        }
      } else {
        console.error('❌ Error is not an Error instance:', error)
        setSubmitError('An unexpected error occurred. Please try again.')
      }
      
      setIsSubmitting(false)
      console.error('✅ State updated: isSubmitting=false')
    } finally {
      console.log('🏁 ========== HANDLE SUBMIT END ==========')
    }
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header" style={{ textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ width: '100%' }}>
          <h1 style={{ textAlign: 'center' }}>Submit a Request</h1>
          <p style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '16px', textAlign: 'center' }}>
            Submit your asset (luxury, vehicle, real estate)
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Sélection du type d'utilisateur */}
        {!userType && (
          <Card variant="elevated" className="user-type-selection-card">
            <div className="user-type-selection">
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
                You are:
              </h2>
              <div className="user-type-buttons">
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('individual')}
                  className="user-type-button"
                >
                  <div className="user-type-icon">
                    <UserIcon className="icon-svg" />
                  </div>
                  <div className="user-type-content">
                    <h3>Individual</h3>
                    <p>I am submitting a request as an individual</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('company')}
                  className="user-type-button"
                >
                  <div className="user-type-icon">
                    <BuildingIcon className="icon-svg" />
                  </div>
                  <div className="user-type-content">
                    <h3>Company</h3>
                    <p>I am submitting a request on behalf of a company</p>
                  </div>
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Formulaire */}
        {userType && (
          <Card variant="elevated" className="asset-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
                {userType === 'individual' ? 'Request - Individual' : 'Request - Company'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setUserType(null)
                  setFormData(prev => ({ ...prev, userType: null }))
                }}
                className="change-user-type-button"
              >
                Change
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                console.log('📝 ========== FORM ONSUBMIT EVENT FIRED ==========')
                console.log('📝 Timestamp:', new Date().toISOString())
                console.log('📝 Event details:', e)
                console.log('📝 Calling handleSubmit...')
                const result = handleSubmit(e)
                console.log('📝 handleSubmit returned:', result)
                return false // Empêcher le submit par défaut
              }} 
              className="asset-form"
              noValidate
            >
              {/* Type d'actif - Boutons sélectionnables */}
              <div className="form-group">
                <label className="form-label">
                  Asset Type <span className="required">*</span>
                </label>
                <div className="asset-type-buttons">
                  {ASSET_TYPES.map((type) => {
                    const IconComponent = type.Icon
                    const isSelected = formData.assetType === type.value
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleAssetTypeSelect(type.value)}
                        className={`asset-type-button ${isSelected ? 'selected' : ''}`}
                      >
                        <span className={`asset-type-icon ${isSelected ? 'selected' : ''}`}>
                          <IconComponent className="icon-svg" />
                        </span>
                        <span className="asset-type-label">{type.label}</span>
                      </button>
                    )
                  })}
                </div>
                
                {formData.assetType === 'other' && (
                  <div className="custom-asset-type-wrapper">
                    <input
                      type="text"
                      name="customAssetType"
                      value={formData.customAssetType}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Specify the asset type..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Description et Valeur */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="estimatedValue" className="form-label">
                    Estimated Value (USDC) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="estimatedValue"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="500000"
                    min="10000"
                    step="1000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Paris, France"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="assetDescription" className="form-label">
                  Asset Description <span className="required">*</span>
                </label>
                <textarea
                  id="assetDescription"
                  name="assetDescription"
                  value={formData.assetDescription}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe your asset precisely: brand, model, year, unique characteristics, authenticity certificates..."
                  rows={5}
                  required
                />
              </div>

              {/* Informations selon le type */}
              <div className="form-section-divider">
                <h3 style={{ marginBottom: '12px' }}>
                  {userType === 'individual' ? 'Personal Information' : 'Company Information'}
                </h3>
              </div>

              {userType === 'individual' ? (
                <>
                  <div className="form-group">
                    <label htmlFor="ownerName" className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="ownerEmail" className="form-label">
                        Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="ownerEmail"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="ownerPhone" className="form-label">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="ownerPhone"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="companyName" className="form-label">
                      Company Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="My Company LLC"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="companyEmail" className="form-label">
                        Company Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="companyEmail"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="contact@mycompany.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="companyPhone" className="form-label">
                        Company Phone
                      </label>
                      <input
                        type="tel"
                        id="companyPhone"
                        name="companyPhone"
                        value={formData.companyPhone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contactPersonName" className="form-label">
                        Contact Person <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="contactPersonName"
                        name="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="companyRegistration" className="form-label">
                        Registration Number (SIRET / RCS)
                      </label>
                      <input
                        type="text"
                        id="companyRegistration"
                        name="companyRegistration"
                        value={formData.companyRegistration}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="123 456 789 00012"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Documents obligatoires */}
              <div className="form-section-divider">
                <h3 style={{ marginBottom: '12px' }}>
                  Supporting Documents <span className="required">*</span>
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  These documents are required to validate your request with our investors
                </p>
              </div>

              {userType === 'individual' ? (
                <div className="documents-section">
                  <div className="form-group">
                    <label htmlFor="passport" className="form-label">
                      Passport <span className="required">*</span>
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="passport"
                        name="passport"
                        onChange={(e) => handleFileChange(e, 'passport')}
                        className="form-file-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <label htmlFor="passport" className="file-upload-label">
                        <span className="file-upload-icon">
                          <AttachmentIcon className="icon-svg" />
                        </span>
                        <span>
                          {formData.passport && formData.passport.length > 0
                            ? `${formData.passport.length} file(s) selected`
                            : 'Choose passport (required)'}
                        </span>
                      </label>
                    </div>
                    <p className="form-hint">Valid passport</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="identityDocument" className="form-label">
                      Identity Document (optional)
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="identityDocument"
                        name="identityDocument"
                        onChange={(e) => handleFileChange(e, 'identityDocument')}
                        className="form-file-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="identityDocument" className="file-upload-label">
                        <span className="file-upload-icon">
                          <AttachmentIcon className="icon-svg" />
                        </span>
                        <span>
                          {formData.identityDocument && formData.identityDocument.length > 0
                            ? `${formData.identityDocument.length} file(s) selected`
                            : 'Choose identity document (optional)'}
                        </span>
                      </label>
                    </div>
                    <p className="form-hint">ID card or driver's license</p>
                  </div>
                </div>
              ) : (
                <div className="documents-section">
                  <div className="form-group">
                    <label htmlFor="companyStatutes" className="form-label">
                      Company Statutes <span className="required">*</span>
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="companyStatutes"
                        name="companyStatutes"
                        onChange={(e) => handleFileChange(e, 'companyStatutes')}
                        className="form-file-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <label htmlFor="companyStatutes" className="file-upload-label">
                        <span className="file-upload-icon">
                          <AttachmentIcon className="icon-svg" />
                        </span>
                        <span>
                          {formData.companyStatutes && formData.companyStatutes.length > 0
                            ? `${formData.companyStatutes.length} file(s) selected`
                            : 'Choose company statutes (required)'}
                        </span>
                      </label>
                    </div>
                    <p className="form-hint">Up-to-date company statutes</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyBalanceSheet" className="form-label">
                      Balance Sheet <span className="required">*</span>
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="companyBalanceSheet"
                        name="companyBalanceSheet"
                        onChange={(e) => handleFileChange(e, 'companyBalanceSheet')}
                        className="form-file-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <label htmlFor="companyBalanceSheet" className="file-upload-label">
                        <span className="file-upload-icon">
                          <AttachmentIcon className="icon-svg" />
                        </span>
                        <span>
                          {formData.companyBalanceSheet && formData.companyBalanceSheet.length > 0
                            ? `${formData.companyBalanceSheet.length} file(s) selected`
                            : 'Choose balance sheet (required)'}
                        </span>
                      </label>
                    </div>
                    <p className="form-hint">Latest financial statement</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyRegistrationDoc" className="form-label">
                      Registration Extract (K-bis / RCS)
                    </label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="companyRegistrationDoc"
                        name="companyRegistrationDoc"
                        onChange={(e) => handleFileChange(e, 'companyRegistrationDoc')}
                        className="form-file-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="companyRegistrationDoc" className="file-upload-label">
                        <span className="file-upload-icon">
                          <AttachmentIcon className="icon-svg" />
                        </span>
                        <span>
                          {formData.companyRegistrationDoc && formData.companyRegistrationDoc.length > 0
                            ? `${formData.companyRegistrationDoc.length} file(s) selected`
                            : 'Choose registration extract (optional)'}
                        </span>
                      </label>
                    </div>
                    <p className="form-hint">Registration certificate</p>
                  </div>
                </div>
              )}

              {/* Documents de l'actif */}
              <div className="form-section-divider">
                <h3 style={{ marginBottom: '12px' }}>
                  Asset Documents <span className="required">*</span>
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Provide at least one document or link showing your asset (screenshot, photos, link to a sales page, etc.)
                </p>
              </div>

              <div className="asset-documents-section">
                <div className="form-group">
                  <label htmlFor="assetDocuments" className="form-label">
                    Files (photos, screenshots, certificates, invoices)
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="assetDocuments"
                      name="assetDocuments"
                      onChange={(e) => handleFileChange(e, 'assetDocuments')}
                      className="form-file-input"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    />
                    <label htmlFor="assetDocuments" className="file-upload-label">
                      <span className="file-upload-icon">
                        <AttachmentIcon className="icon-svg" />
                      </span>
                      <span>
                        {formData.assetDocuments && formData.assetDocuments.length > 0
                          ? `${formData.assetDocuments.length} file(s) selected`
                          : 'Choose files or drag and drop'}
                      </span>
                    </label>
                  </div>
                  <p className="form-hint">Accepted formats: PDF, JPG, PNG, WEBP (Max 10MB per file)</p>
                </div>

                <div className="or-separator">
                  <span className="or-text">OR</span>
                </div>

                <div className="form-group">
                  <label htmlFor="assetLink" className="form-label">
                    Link to Asset
                  </label>
                  <input
                    type="url"
                    id="assetLink"
                    name="assetLink"
                    value={formData.assetLink}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/article-or-sales-page"
                  />
                  <p className="form-hint">
                    Link to a web page showing the asset (sales site, marketplace, gallery, etc.)
                  </p>
                  {formData.assetLink && (
                    <div className="link-preview">
                      <a 
                        href={formData.assetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link-preview-button"
                      >
                        <ChartUpIcon className="icon-svg icon-small" />
                        <span>View Link</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents supplémentaires */}
              <div className="form-section-divider">
                <h3 style={{ marginBottom: '12px' }}>
                  Additional Documents (optional)
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  You can add other useful documents if you have a complete file
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="additionalDocuments" className="form-label">
                  Additional Files
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="additionalDocuments"
                    name="additionalDocuments"
                    onChange={(e) => handleFileChange(e, 'additionalDocuments')}
                    className="form-file-input"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="additionalDocuments" className="file-upload-label">
                    <span className="file-upload-icon">
                      <AttachmentIcon className="icon-svg" />
                    </span>
                    <span>
                      {formData.additionalDocuments && formData.additionalDocuments.length > 0
                        ? `${formData.additionalDocuments.length} file(s) selected`
                        : 'Choose additional files or drag and drop'}
                    </span>
                  </label>
                </div>
                <p className="form-hint">You can add other useful documents (complete file, additional files, etc.)</p>
              </div>

              {/* Informations complémentaires */}
              <div className="form-group">
                <label htmlFor="additionalInfo" className="form-label">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="History, provenance, certificates, additional documentation..."
                  rows={3}
                />
              </div>

              {/* Conditions */}
              <div className="form-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    className="form-checkbox"
                    required
                  />
                  <span>
                    I accept the <a href="/dashboard/terms" target="_blank" style={{ color: 'var(--color-primary-500)', textDecoration: 'underline' }}>Terms & Conditions</a> and confirm that all information provided is accurate <span className="required">*</span>
                  </span>
                </label>
              </div>

              {/* Messages d'erreur */}
              {submitError && (
                <div className="form-error-message">
                  <WarningIcon className="icon-svg icon-inline" />
                  {submitError}
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="form-actions">
                {submitSuccess && (
                  <div className="form-success-message">
                    <CheckIcon className="icon-svg icon-inline" />
                    Your request has been submitted successfully! We will review it and get back to you within 48 hours.
                  </div>
                )}
                <Button
                  variant="primary"
                  className="form-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log('🔘 SUBMIT BUTTON CLICKED')
                    console.log('🔘 isSubmitting:', isSubmitting)
                    console.log('🔘 Event:', e)
                    // Ne pas empêcher le submit, juste logger
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" style={{ display: 'inline-block', marginRight: '8px' }}></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ChartUpIcon className="button-icon" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      <style jsx>{`
        .user-type-selection-card {
          padding: var(--space-8);
          margin-bottom: var(--space-8);
        }

        .user-type-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .user-type-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
          width: 100%;
          max-width: 600px;
        }

        @media (max-width: 768px) {
          .user-type-buttons {
            grid-template-columns: 1fr;
          }
        }

        .user-type-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-6);
          border: 2px solid var(--color-border-default);
          border-radius: var(--radius-lg);
          background: var(--color-bg-primary);
          cursor: pointer;
          transition: all var(--transition-normal);
          text-align: center;
        }

        .user-type-button:hover {
          border-color: var(--color-primary-500);
          background: var(--color-bg-secondary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .user-type-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-type-icon .icon-svg {
          width: 48px;
          height: 48px;
        }

        .user-type-content h3 {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0 0 var(--space-2) 0;
        }

        .user-type-content p {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .change-user-type-button {
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          color: var(--color-primary-500);
          background: transparent;
          border: 1px solid var(--color-primary-500);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .change-user-type-button:hover {
          background: var(--color-primary-500);
          color: white;
        }

        .asset-form-card {
          padding: var(--space-6);
          margin-bottom: var(--space-6);
        }

        .asset-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .asset-type-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        .asset-type-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          border: 2px solid var(--color-border-default);
          border-radius: var(--radius-md);
          background: var(--color-bg-primary);
          cursor: pointer;
          transition: all var(--transition-normal);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-primary);
          min-height: 100px;
          justify-content: center;
        }

        .asset-type-button:hover {
          border-color: var(--color-primary-500);
          background: var(--color-bg-secondary);
          transform: translateY(-2px);
        }

        .asset-type-button.selected {
          border-color: var(--color-primary-500);
          background: rgba(37, 99, 235, 0.1);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .asset-type-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          transition: all var(--transition-normal);
        }

        .asset-type-icon.selected {
          background: rgba(37, 99, 235, 0.1);
          border-color: var(--color-primary-500);
        }

        .asset-type-icon.selected .icon-svg {
          color: var(--color-primary-500);
        }

        .asset-type-icon .icon-svg {
          width: 28px;
          height: 28px;
          color: var(--color-text-primary);
          transition: color var(--transition-normal);
        }

        .asset-type-label {
          font-size: var(--text-sm);
        }

        .custom-asset-type-wrapper {
          margin-top: var(--space-4);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .documents-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
        }

        .asset-documents-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
        }

        .or-separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: var(--space-2) 0;
        }

        .or-separator::before,
        .or-separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--color-border-default);
        }

        .or-text {
          padding: 0 var(--space-4);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .link-preview {
          margin-top: var(--space-2);
        }

        .link-preview-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          font-size: var(--text-sm);
          color: var(--color-primary-500);
          text-decoration: none;
          border: 1px solid var(--color-primary-500);
          border-radius: var(--radius-md);
          transition: all var(--transition-normal);
        }

        .link-preview-button:hover {
          background: var(--color-primary-500);
          color: white;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .asset-type-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .asset-type-buttons {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .form-label {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .required {
          color: #EF4444;
        }

        .form-input,
        .form-textarea,
        .form-file-input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-family: var(--font-ui);
          color: var(--color-text-primary);
          background: var(--color-bg-primary);
          transition: all var(--transition-normal);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-file-input {
          display: none;
        }

        .file-upload-wrapper {
          position: relative;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border: 2px dashed var(--color-border-default);
          border-radius: var(--radius-md);
          background: var(--color-bg-primary);
          cursor: pointer;
          transition: all var(--transition-normal);
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
        }

        .file-upload-label:hover {
          border-color: var(--color-primary-500);
          background: var(--color-bg-tertiary);
        }

        .file-upload-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-upload-icon .icon-svg {
          width: 20px;
          height: 20px;
        }

        .form-hint {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: 4px;
        }

        .form-section-divider {
          margin: var(--space-4) 0;
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border-default);
        }

        .form-section-divider h3 {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-primary-500);
          text-align: left;
          margin-bottom: 16px;
        }

        .form-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          cursor: pointer;
          font-size: var(--text-sm);
          color: var(--color-text-primary);
        }

        .form-checkbox {
          margin-top: 2px;
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--color-primary-500);
        }

        .form-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-3);
        }

        .form-success-message {
          padding: var(--space-4);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          color: #059669;
          font-size: var(--text-sm);
          display: flex;
          align-items: center;
        }

        .form-error-message {
          padding: var(--space-4);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: #DC2626;
          font-size: var(--text-sm);
          display: flex;
          align-items: center;
        }

        .icon-inline {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .icon-small {
          width: 16px;
          height: 16px;
        }

        .form-error-message .icon-svg {
          color: #EF4444;
        }

        .form-success-message .icon-svg {
          color: #10B981;
        }

        .form-submit-button {
          width: 100%;
          padding: var(--space-4) var(--space-6);
          font-size: var(--text-base);
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .button-icon {
          width: 20px;
          height: 20px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
