/**
 * Système de stockage simplifié - utilise le stockage local
 * Plus simple que Google Drive - aucune configuration requise
 * 
 * IMPORTANT: Ces fonctions utilisent le système de fichiers Node.js
 * et doivent uniquement être utilisées dans les API routes (côté serveur).
 */

export { saveSubmission, getSubmission, listSubmissions } from './localStorage'

