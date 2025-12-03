import { google } from 'googleapis'
import { Readable } from 'stream'

let driveClient: any = null

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

  if (privateKey && clientEmail) {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive'],
    })

    driveClient = google.drive({ version: 'v3', auth })
    return driveClient
  }

  // Méthode 2 : OAuth (si Service Account non configuré)
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
      : 'http://localhost:1001')

  if (clientId && clientSecret && refreshToken) {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })

    driveClient = google.drive({ version: 'v3', auth: oauth2Client })
    return driveClient
  }

  throw new Error('GOOGLE_DRIVE_CONFIG_MISSING: Google Drive environment variables are missing. Please configure either Service Account (GOOGLE_PRIVATE_KEY and GOOGLE_SERVICE_ACCOUNT_EMAIL) or OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and optionally GOOGLE_REDIRECT_URI) in your environment variables.')
}

/**
 * Crée un dossier dans Google Drive
 */
export async function createFolder(name: string, parentFolderId?: string): Promise<string> {
  const drive = initGoogleDrive()
  
  const fileMetadata: any = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
  }

  if (parentFolderId) {
    fileMetadata.parents = [parentFolderId]
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id',
  })

  return response.data.id!
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
  const drive = initGoogleDrive()

  // Convertir File en Buffer si nécessaire
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

/**
 * Crée un fichier JSON dans Google Drive
 */
export async function createJsonFile(
  data: any,
  fileName: string,
  folderId: string
): Promise<string> {
  const drive = initGoogleDrive()

  const fileMetadata: any = {
    name: fileName,
    parents: [folderId],
  }

  const media = {
    mimeType: 'application/json',
    body: Readable.from(Buffer.from(JSON.stringify(data, null, 2))),
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id',
  })

  return response.data.id!
}

/**
 * Liste les fichiers d'un dossier
 */
export async function listFiles(folderId: string): Promise<any[]> {
  const drive = initGoogleDrive()

  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime)',
  })

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

