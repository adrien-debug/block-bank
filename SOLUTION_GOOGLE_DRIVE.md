# Solution pour Google Drive Upload

## Problème
Les Service Accounts n'ont **pas de quota de stockage** dans Google Drive, même dans des dossiers partagés. C'est une limitation de Google.

## Solutions

### Solution 1 : Utiliser OAuth (Recommandé)

1. **Obtenir un Refresh Token OAuth** :
   ```bash
   node scripts/get-oauth-token-auto.js
   ```
   - Suivez les instructions
   - Autorisez l'application
   - Copiez le code d'autorisation
   - Le refresh token sera automatiquement ajouté à `.env.local`

2. **Le code utilisera automatiquement OAuth** si `GOOGLE_REFRESH_TOKEN` est configuré

3. **Tester** :
   ```bash
   node scripts/test-upload-file.js
   ```

### Solution 2 : Utiliser un Shared Drive (Google Workspace)

Si vous avez Google Workspace :
1. Créez un Shared Drive
2. Partagez-le avec le Service Account
3. Utilisez l'ID du Shared Drive comme `GOOGLE_DRIVE_FOLDER_ID`

### Solution 3 : Utiliser OAuth Delegation

Pour les comptes Google Workspace, vous pouvez utiliser OAuth delegation avec domain-wide delegation.

## Configuration Actuelle

- ✅ Service Account créé et configuré
- ✅ Dossier Google Drive créé et partagé
- ✅ Variables d'environnement configurées
- ⚠️ Uploads bloqués par limitation Google (Service Account sans quota)

## Prochaines Étapes

Pour activer les uploads, obtenez un refresh token OAuth :

```bash
node scripts/get-oauth-token-auto.js
```

Une fois le refresh token obtenu, le code utilisera automatiquement OAuth au lieu du Service Account pour les uploads.


