import { google } from 'googleapis'
import { Readable } from 'stream'

let driveClient: any = null
let authMethod: 'service-account' | 'oauth' | null = null

/**
 * Réinitialise le client (utile en cas d'erreur OAuth)
 */
function resetDriveClient() {
  driveClient = null
  authMethod = null
}

/**
 * Initialise le client Google Drive avec Service Account ou OAuth
 */
export function initGoogleDrive() {
  if (driveClient) {
    return driveClient
  }

  // Méthode 1 : Service Account (prioritaire si configuré)
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL

  // Vérifier que la clé privée est valide (contient BEGIN et END)
  const isValidPrivateKey = privateKey && 
    privateKey.includes('BEGIN PRIVATE KEY') && 
    privateKey.includes('END PRIVATE KEY')

  if (isValidPrivateKey && clientEmail) {
    try {
      // Support pour OAuth delegation (domain-wide delegation)
      const subject = process.env.GOOGLE_DELEGATION_SUBJECT // Email de l'utilisateur à impersonner (optionnel)
      
      const authOptions: any = {
        email: clientEmail,
        key: privateKey,
        scopes: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file',
        ],
      }
      
      // Si delegation subject est configuré, utiliser domain-wide delegation
      if (subject) {
        authOptions.subject = subject
        console.log(`[Google Drive] Using Service Account with domain-wide delegation for: ${subject}`)
      }

      const auth = new google.auth.JWT(authOptions)

      driveClient = google.drive({ version: 'v3', auth })
      authMethod = 'service-account'
      console.log('[Google Drive] Using Service Account authentication' + (subject ? ` (delegated to ${subject})` : ''))
      return driveClient
    } catch (error) {
      console.error('[Google Drive] Service Account initialization failed:', error)
      // Continue pour essayer OAuth
    }
  }

  // Méthode 2 : OAuth (si Service Account non configuré ou a échoué)
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
      : 'http://localhost:1001')

  if (clientId && clientSecret && refreshToken) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      )

      oauth2Client.setCredentials({
        refresh_token: refreshToken
      })

      driveClient = google.drive({ version: 'v3', auth: oauth2Client })
      authMethod = 'oauth'
      console.log('[Google Drive] Using OAuth authentication')
      return driveClient
    } catch (error) {
      console.error('[Google Drive] OAuth initialization failed:', error)
      // Si OAuth échoue et qu'on a un Service Account valide, on ne devrait pas arriver ici
      // mais on réessaie le Service Account au cas où
      if (isValidPrivateKey && clientEmail) {
        console.log('[Google Drive] Retrying with Service Account after OAuth failure')
        resetDriveClient()
        const auth = new google.auth.JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive'],
        })
        driveClient = google.drive({ version: 'v3', auth })
        authMethod = 'service-account'
        return driveClient
      }
    }
  }

  throw new Error('GOOGLE_DRIVE_CONFIG_MISSING: Google Drive environment variables are missing. Please configure either Service Account (GOOGLE_PRIVATE_KEY and GOOGLE_SERVICE_ACCOUNT_EMAIL) or OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and optionally GOOGLE_REDIRECT_URI) in your environment variables.')
}

/**
 * Crée un dossier dans Google Drive
 */
export async function createFolder(name: string, parentFolderId?: string): Promise<string> {
  try {
    const drive = initGoogleDrive()
    
    // Vérifier si parentFolderId est un Shared Drive (supportsAllDrives)
    const supportsAllDrives = process.env.GOOGLE_USE_SHARED_DRIVE === 'true'
    const sharedDriveId = process.env.GOOGLE_SHARED_DRIVE_ID
    
    const fileMetadata: any = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
    }

    // Si on utilise un Shared Drive, utiliser l'ID du Shared Drive comme parent
    if (supportsAllDrives && sharedDriveId) {
      fileMetadata.parents = [sharedDriveId]
    } else if (parentFolderId) {
      fileMetadata.parents = [parentFolderId]
    }

    const createOptions: any = {
      requestBody: fileMetadata,
      fields: 'id',
    }
    
    // Important : activer supportsAllDrives pour les Shared Drives
    if (supportsAllDrives) {
      createOptions.supportsAllDrives = true
      createOptions.supportsTeamDrives = true
    }

    const response = await drive.files.create(createOptions)

    return response.data.id!
  } catch (error: any) {
    // Si erreur de quota Service Account
    if (error?.message?.includes('storage quota') || error?.message?.includes('quota')) {
      console.error('[Google Drive] Storage quota error - Service Accounts do not have storage quota. Please use Shared Drives or OAuth delegation.')
      throw new Error('STORAGE_QUOTA_ERROR: Service Accounts do not have storage quota. Please configure GOOGLE_USE_SHARED_DRIVE=true and GOOGLE_SHARED_DRIVE_ID, or use OAuth instead.')
    }
    // Si erreur OAuth, réessayer avec Service Account
    if (error?.message?.includes('invalid_grant') || error?.code === 401) {
      console.error('[Google Drive] OAuth error in createFolder, retrying with Service Account')
      resetDriveClient()
      return createFolder(name, parentFolderId)
    }
    throw error
  }
}

/**
 * Upload un fichier vers Google Drive
 */
export async function uploadFile(
  file: File | Buffer,
  fileName: string,
  folderId: string,
  mimeType?: string
): Promise<string> {
  try {
    const drive = initGoogleDrive()

    // Convertir File en Buffer si nécessaire
    let fileBuffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
    } else {
      fileBuffer = file
    }

    // Vérifier si on utilise un Shared Drive
    const supportsAllDrives = process.env.GOOGLE_USE_SHARED_DRIVE === 'true'
    const sharedDriveId = process.env.GOOGLE_SHARED_DRIVE_ID

    const fileMetadata: any = {
      name: fileName,
    }

    // Si on utilise un Shared Drive, utiliser l'ID du Shared Drive comme parent
    if (supportsAllDrives && sharedDriveId) {
      fileMetadata.parents = [sharedDriveId]
    } else {
      fileMetadata.parents = [folderId]
    }

    const media = {
      mimeType: mimeType || (file instanceof File ? file.type : 'application/octet-stream'),
      body: Readable.from(fileBuffer),
    }

    const createOptions: any = {
      requestBody: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    }
    
    // Important : activer supportsAllDrives pour les Shared Drives
    if (supportsAllDrives) {
      createOptions.supportsAllDrives = true
      createOptions.supportsTeamDrives = true
    }

    const response = await drive.files.create(createOptions)

    return response.data.id!
  } catch (error: any) {
    // Si erreur de quota Service Account
    if (error?.message?.includes('storage quota') || error?.message?.includes('quota') || error?.message?.includes('do not have storage quota')) {
      console.error('[Google Drive] Storage quota error - Service Accounts do not have storage quota. Please use Shared Drives or OAuth delegation.')
      throw new Error('STORAGE_QUOTA_ERROR: Service Accounts do not have storage quota. Please configure GOOGLE_USE_SHARED_DRIVE=true and GOOGLE_SHARED_DRIVE_ID, or use OAuth instead.')
    }
    // Si erreur OAuth (invalid_grant), réessayer avec Service Account
    if (error?.message?.includes('invalid_grant') || error?.code === 401) {
      console.error('[Google Drive] OAuth error detected, resetting client and retrying with Service Account')
      resetDriveClient()
      
      // Réessayer une fois avec Service Account
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      
      if (privateKey && clientEmail && 
          privateKey.includes('BEGIN PRIVATE KEY') && 
          privateKey.includes('END PRIVATE KEY')) {
        const auth = new google.auth.JWT({
          email: clientEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive'],
        })
        
        const drive = google.drive({ version: 'v3', auth })
        driveClient = drive
        authMethod = 'service-account'
        
        // Réessayer l'upload
        let fileBuffer: Buffer
        if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer()
          fileBuffer = Buffer.from(arrayBuffer)
        } else {
          fileBuffer = file
        }

        const fileMetadata: any = {
          name: fileName,
          parents: [folderId],
        }

        const media = {
          mimeType: mimeType || (file instanceof File ? file.type : 'application/octet-stream'),
          body: Readable.from(fileBuffer),
        }

        const response = await drive.files.create({
          requestBody: fileMetadata,
          media,
          fields: 'id, webViewLink, webContentLink',
        })

        return response.data.id!
      }
    }
    
    throw error
  }
}

/**
 * Crée un fichier JSON dans Google Drive
 */
export async function createJsonFile(
  data: any,
  fileName: string,
  folderId: string
): Promise<string> {
  try {
    const drive = initGoogleDrive()

    // Vérifier si on utilise un Shared Drive
    const supportsAllDrives = process.env.GOOGLE_USE_SHARED_DRIVE === 'true'
    const sharedDriveId = process.env.GOOGLE_SHARED_DRIVE_ID

    const fileMetadata: any = {
      name: fileName,
    }

    // Si on utilise un Shared Drive, utiliser l'ID du Shared Drive comme parent
    if (supportsAllDrives && sharedDriveId) {
      fileMetadata.parents = [sharedDriveId]
    } else {
      fileMetadata.parents = [folderId]
    }

    const media = {
      mimeType: 'application/json',
      body: Readable.from(Buffer.from(JSON.stringify(data, null, 2))),
    }

    const createOptions: any = {
      requestBody: fileMetadata,
      media,
      fields: 'id',
    }
    
    // Important : activer supportsAllDrives pour les Shared Drives
    if (supportsAllDrives) {
      createOptions.supportsAllDrives = true
      createOptions.supportsTeamDrives = true
    }

    const response = await drive.files.create(createOptions)

    return response.data.id!
  } catch (error: any) {
    // Si erreur de quota Service Account
    if (error?.message?.includes('storage quota') || error?.message?.includes('quota') || error?.message?.includes('do not have storage quota')) {
      console.error('[Google Drive] Storage quota error - Service Accounts do not have storage quota. Please use Shared Drives or OAuth delegation.')
      throw new Error('STORAGE_QUOTA_ERROR: Service Accounts do not have storage quota. Please configure GOOGLE_USE_SHARED_DRIVE=true and GOOGLE_SHARED_DRIVE_ID, or use OAuth instead.')
    }
    // Si erreur OAuth, réessayer avec Service Account
    if (error?.message?.includes('invalid_grant') || error?.code === 401) {
      console.error('[Google Drive] OAuth error in createJsonFile, retrying with Service Account')
      resetDriveClient()
      return createJsonFile(data, fileName, folderId)
    }
    throw error
  }
}

/**
 * Liste les fichiers d'un dossier
 */
export async function listFiles(folderId: string): Promise<any[]> {
  const drive = initGoogleDrive()

  // Vérifier si on utilise un Shared Drive
  const supportsAllDrives = process.env.GOOGLE_USE_SHARED_DRIVE === 'true'

  const listOptions: any = {
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime)',
  }

  // Important : activer supportsAllDrives pour les Shared Drives
  if (supportsAllDrives) {
    listOptions.supportsAllDrives = true
    listOptions.supportsTeamDrives = true
    listOptions.includeItemsFromAllDrives = true
    listOptions.corpora = 'allDrives'
  }

  const response = await drive.files.list(listOptions)

  return response.data.files || []
}

/**
 * Obtient l'URL de téléchargement d'un fichier
 */
export async function getFileDownloadUrl(fileId: string): Promise<string> {
  const drive = initGoogleDrive()
  
  // Pour les fichiers Google Drive, on peut utiliser webContentLink
  // Sinon, on génère une URL de téléchargement temporaire
  const file = await drive.files.get({
    fileId,
    fields: 'webContentLink, webViewLink',
  })

  return file.data.webContentLink || file.data.webViewLink || ''
}

/**
 * Partage un fichier pour qu'il soit accessible publiquement (optionnel)
 */
export async function makeFilePublic(fileId: string): Promise<void> {
  const drive = initGoogleDrive()

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })
}

