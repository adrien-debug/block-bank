# Gestion Manuelle des Domaines Vercel

## ⚠️ Important : Domaines gérés manuellement

**Les domaines personnalisés doivent être assignés manuellement via le dashboard Vercel.**

Ce projet est configuré pour ne pas assigner automatiquement de domaines personnalisés lors des déploiements.

## 📋 Configuration actuelle

- ✅ Domaines personnalisés : **Gestion manuelle uniquement**
- ⚠️ Domaine `.vercel.app` : Créé automatiquement par Vercel (non désactivable)
- ✅ Déploiements de production : Activés pour la branche `Stable`

## 🔧 Comment gérer les domaines manuellement

### 1. Accéder au Dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **Block Bank**
3. Allez dans **Settings** → **Domains**

### 2. Supprimer un domaine existant

Pour retirer un domaine déjà assigné :

1. Dans **Settings** → **Domains**
2. Trouvez le domaine à supprimer
3. Cliquez sur les **3 points** (⋯) à côté du domaine
4. Sélectionnez **Remove**
5. Confirmez la suppression

### 3. Ajouter un domaine personnalisé

Pour ajouter votre propre domaine (ex: `blockbank.com`) :

1. Dans **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `blockbank.com` ou `www.blockbank.com`)
4. Suivez les instructions pour configurer les DNS :
   - Ajoutez les enregistrements DNS indiqués
   - Attendez la propagation DNS (peut prendre quelques minutes à 24h)
5. Vérifiez que le statut devient **Valid**

### 4. Domaine de production

Le domaine de production doit être :
- ✅ Assigné **manuellement** via le dashboard
- ✅ Configuré pour pointer vers la branche `Stable` (production)
- ✅ Vérifié et validé avant utilisation

## 📝 Notes importantes

### Domaines `.vercel.app`

Vercel crée **toujours automatiquement** un domaine `.vercel.app` pour chaque projet. 
- Ce domaine **ne peut pas être désactivé**
- Il est utile pour les tests et prévisualisations
- Vous pouvez simplement **l'ignorer** si vous ne l'utilisez pas

### Domaines de prévisualisation

Si vous voulez désactiver les domaines de prévisualisation automatiques pour chaque PR :

1. Allez dans **Settings** → **Git**
2. Désactivez **"Automatic Preview Deployments"**

## ✅ Vérification

Après avoir configuré vos domaines :

1. Vérifiez que seul votre domaine personnalisé est assigné (si souhaité)
2. Testez que votre domaine fonctionne correctement
3. Vérifiez les certificats SSL (automatiques avec Vercel)

## 🔗 Ressources

- [Documentation Vercel - Domaines](https://vercel.com/docs/concepts/projects/domains)
- [Configuration DNS Vercel](https://vercel.com/docs/concepts/projects/domains/domain-configuration)

