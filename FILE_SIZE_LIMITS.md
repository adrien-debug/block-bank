# Limitations de Taille des Documents

## 📋 Résumé des Limitations

### Limitations Actuelles

| Service | Limite | Plan |
|---------|--------|------|
| **Vercel API Routes** | 4.5 MB par requête | Tous les plans |
| **Supabase Storage (Global)** | 50 MB par fichier | Plan Free |
| **Supabase Storage (Global)** | Jusqu'à 500 GB par fichier | Plan Pro+ |
| **Next.js Server Actions** | 50 MB | Configuré dans `next.config.js` |
| **Timeout API Route** | 300 secondes (5 minutes) | Configuré |

### Limites Recommandées pour l'Application

Limites configurées dans l'application :

- **Par fichier** : 50 MB maximum
- **Total par soumission** : 200 MB maximum
- **Nombre de fichiers** : Illimité (mais pratique : max 20 fichiers)

## 🔧 Limitations Techniques

### 1. Vercel API Routes

**Limite par défaut : 4.5 MB par requête**

Cette limite est imposée par Vercel pour les fonctions serverless. Si vous essayez d'uploader des fichiers plus grands, vous recevrez une erreur `413 FUNCTION_PAYLOAD_TOO_LARGE`.

**Solution :** Les fichiers doivent être uploadés directement vers Supabase Storage, pas via l'API route.

### 2. Supabase Storage

#### Plan Free
- **Limite globale** : 50 MB par fichier
- **Limite configurable par bucket** : Jusqu'à 50 MB (ne peut pas dépasser la limite globale)

#### Plan Pro et Supérieur
- **Limite globale** : Jusqu'à 500 GB (configurable)
- **Limite configurable par bucket** : Jusqu'à la limite globale

#### Méthodes d'Upload

1. **Upload Standard** : Jusqu'à 5 GB
   - Pour fichiers < 6 MB : OK
   - Pour fichiers > 6 MB : Utiliser TUS Resumable Uploads recommandé

2. **Upload Résumable (TUS)** : Jusqu'à 50 GB
   - Meilleure fiabilité pour gros fichiers
   - Support de la reprise en cas d'erreur

3. **Upload S3** : Jusqu'à 50 GB
   - Pour intégration avec S3

### 3. Next.js Configuration

Actuellement configuré dans `next.config.js` :
```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '50mb'  // Pour Server Actions uniquement
  }
}
```

**Note :** Cette configuration ne s'applique pas aux API Routes, seulement aux Server Actions.

## ⚠️ Limites Actuelles dans le Code

### Validation Actuelle

Actuellement, **aucune validation explicite de taille de fichier** n'est implémentée dans le code.

Le code vérifie seulement :
- ✅ Que les fichiers existent et ont une taille > 0
- ✅ Que les documents obligatoires sont présents
- ✅ Affiche la taille totale dans les logs

### Problèmes Potentiels

1. **Fichiers trop gros** : Un client peut uploader un fichier de 100 MB qui :
   - Peut dépasser la limite Vercel (4.5 MB)
   - Peut dépasser la limite Supabase (50 MB sur Free plan)
   - Peut causer un timeout (limite : 5 minutes)

2. **Total trop volumineux** : Plusieurs fichiers peuvent totaliser > 50 MB

## ✅ Recommandations

### À Implémenter

1. **Validation côté client** :
   - Vérifier la taille de chaque fichier avant l'upload
   - Afficher un message d'erreur clair si la limite est dépassée
   - Limite recommandée : 10 MB par fichier

2. **Validation côté serveur** :
   - Vérifier la taille totale avant traitement
   - Vérifier chaque fichier individuellement
   - Retourner des erreurs claires

3. **Limites recommandées** :
   - **Par fichier** : 10 MB
   - **Total par soumission** : 50 MB
   - **Timeout** : Garder 300 secondes (5 min) pour gros uploads

### Configuration Supabase

Pour vérifier/modifier les limites Supabase :

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Storage** → **Settings**
4. Vérifiez la **Global File Size Limit**
5. Pour chaque bucket, vérifiez la limite spécifique

## 📊 Exemple de Tailles de Documents Typiques

| Type de Document | Taille Typique | Taille Max Recommandée |
|------------------|----------------|------------------------|
| Passeport (scan) | 500 KB - 2 MB | 5 MB |
| Document d'identité | 500 KB - 2 MB | 5 MB |
| Statuts entreprise (PDF) | 200 KB - 1 MB | 5 MB |
| Bilan financier (PDF) | 500 KB - 5 MB | 10 MB |
| Photos d'actifs | 1 MB - 5 MB | 10 MB |
| Documents légaux | 1 MB - 10 MB | 10 MB |

## 🔄 Prochaines Étapes

1. ✅ Ajouter validation de taille côté serveur
2. ✅ Ajouter validation de taille côté client
3. ✅ Afficher des messages d'erreur clairs
4. ⏳ Implémenter upload résumable pour gros fichiers (futur)
5. ⏳ Progress bar pour uploads (futur)

## 📚 Ressources

- [Vercel Function Limitations](https://vercel.com/docs/functions/limitations)
- [Supabase Storage File Limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [Supabase Resumable Uploads](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)

