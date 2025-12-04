# 🔧 Solution: FUNCTION_PAYLOAD_TOO_LARGE

## 🎯 Problème Identifié

**Erreur 413 : Request Entity Too Large**

Votre soumission échoue car les fichiers uploadés (4.62 MB) dépassent la limite par défaut de Vercel.

### Détails de l'erreur
```
POST https://www.block-bank.com/api/asset-submissions 413 (Content Too Large)
FUNCTION_PAYLOAD_TOO_LARGE
Total files size: 4845271 bytes (4.62 MB)
```

## ⚠️ Limites Vercel

**Limites par défaut :**
- **Hobby Plan** : 4.5 MB par requête
- **Pro Plan** : 4.5 MB par requête (API Routes)
- **Enterprise Plan** : Configurable

Votre payload de **4.62 MB dépasse la limite**.

## 🚀 Solutions

### Solution 1 : Upload Direct vers Google Drive (Recommandé)

Au lieu d'envoyer les fichiers via l'API Next.js, uploadez directement depuis le navigateur vers Google Drive.

**Avantages :**
- ✅ Pas de limite de taille Vercel
- ✅ Upload plus rapide
- ✅ Moins de charge serveur
- ✅ Meilleure expérience utilisateur

**Architecture :**
```
Frontend → Google Drive API (direct)
         ↓
         → Next.js API (métadonnées uniquement)
```

### Solution 2 : Upload par Chunks (Morceaux)

Divisez les gros fichiers en morceaux de 3 MB et uploadez-les séparément.

### Solution 3 : Utiliser un Service d'Upload Tiers

Utilisez des services comme :
- **UploadThing** (spécialisé Next.js)
- **Cloudinary**
- **AWS S3** avec upload direct

### Solution 4 : Augmenter la limite (Ne fonctionne PAS sur Vercel)

⚠️ **IMPORTANT** : Même avec `bodySizeLimit` dans `next.config.js`, **Vercel impose une limite stricte de 4.5 MB** pour les API Routes.

La configuration suivante **ne fonctionnera PAS sur Vercel** :
```js
// NE FONCTIONNE PAS sur Vercel
experimental: {
  serverActions: {
    bodySizeLimit: '50mb'
  }
}
```

## ✅ Solution Recommandée : Upload Direct Google Drive

### Étape 1 : Créer une API Key Google Drive

1. Allez sur https://console.cloud.google.com
2. Sélectionnez votre projet **legalblock-480122**
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **API Key**
5. Restreignez l'API Key à **Google Drive API** uniquement
6. Ajoutez des restrictions HTTP Referrer : `https://block-bank.com/*`

### Étape 2 : Modifier le Frontend pour Upload Direct

Le frontend uploadera directement vers Google Drive en utilisant l'API Key publique (restreinte).

### Étape 3 : L'API Next.js reçoit uniquement les métadonnées

L'API `/api/asset-submissions` recevra :
- ✅ Les métadonnées du formulaire (< 10 KB)
- ✅ Les IDs des fichiers uploadés sur Google Drive
- ❌ PLUS les fichiers bruts

## 🔄 Workflow Proposé

```
1. User remplit le formulaire
   ↓
2. Frontend upload les fichiers directement vers Google Drive
   (avec progress bar)
   ↓
3. Google Drive retourne les file IDs
   ↓
4. Frontend envoie les file IDs + métadonnées à /api/asset-submissions
   ↓
5. API Next.js organise les fichiers dans les dossiers Google Drive
   ↓
6. Success !
```

## 📊 Comparaison des Solutions

| Solution | Limite | Complexité | Performance | Coût |
|----------|--------|------------|-------------|------|
| **Upload Direct** | Aucune | Moyenne | ⭐⭐⭐⭐⭐ | Gratuit |
| Upload par Chunks | ~100 MB | Haute | ⭐⭐⭐ | Gratuit |
| Service Tiers | Variable | Faible | ⭐⭐⭐⭐ | Payant |
| Augmenter limite | ❌ Impossible | - | - | - |

## 🎯 Action Immédiate

**Pour tester rapidement :**

1. **Réduisez la taille des fichiers de test** à moins de 3 MB total
2. Testez à nouveau la soumission
3. Si ça fonctionne, implémentez l'upload direct pour la production

**Pour la solution permanente :**

Implémentez l'upload direct vers Google Drive (je peux vous aider avec le code).

## 📝 Fichiers à Modifier

Si vous choisissez l'upload direct :

1. `/app/legalblock/opportunity/page.tsx` - Logique d'upload frontend
2. `/lib/utils/googleDriveClient.ts` - Nouveau fichier pour l'API client-side
3. `/app/api/asset-submissions/route.ts` - Recevoir les file IDs au lieu des fichiers

---

**Voulez-vous que j'implémente l'upload direct vers Google Drive ?**

