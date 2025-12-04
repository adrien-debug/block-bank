# Solution pour Google Drive Upload

## 🚨 Problème

Les Service Accounts n'ont **pas de quota de stockage** dans Google Drive, même dans des dossiers partagés. C'est une limitation de Google.

**Erreur typique :**
```
Service Accounts do not have storage quota. Leverage shared drives 
(https://developers.google.com/workspace/drive/api/guides/about-shareddrives), 
or use OAuth delegation (http://support.google.com/a/answer/7281227) instead.
```

---

## ✅ Solutions disponibles

### ⚡ Solution Rapide : Shared Drives (Recommandée si vous avez Google Workspace)

1. **Créer un Shared Drive** dans Google Drive
2. **Partager** le Shared Drive avec votre Service Account
3. **Configurer** les variables d'environnement :
   ```bash
   GOOGLE_USE_SHARED_DRIVE=true
   GOOGLE_SHARED_DRIVE_ID=XXXXXXXXXXXXXXXXX
   ```

👉 **Guide complet :** Voir [SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md)

---

### 🔧 Solution Alternative : OAuth

1. **Obtenir un Refresh Token OAuth** :
   ```bash
   node scripts/get-oauth-token-auto.js
   ```
   - Suivez les instructions
   - Autorisez l'application
   - Copiez le code d'autorisation
   - Le refresh token sera automatiquement ajouté à `.env.local`

2. **Le code utilisera automatiquement OAuth** si `GOOGLE_REFRESH_TOKEN` est configuré

---

## 📋 Documentation Complète

Pour une documentation détaillée avec toutes les options (Shared Drives, OAuth Delegation, OAuth Standard), consultez :

👉 **[SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md)** - Guide complet avec toutes les solutions

---

## 🎯 Prochaines Actions

1. **Si vous avez Google Workspace** : Configurez un Shared Drive (voir [SOLUTION_SHARED_DRIVES.md](./SOLUTION_SHARED_DRIVES.md))
2. **Sinon** : Utilisez OAuth standard (voir ci-dessus)

Une fois configuré, les uploads fonctionneront automatiquement !


