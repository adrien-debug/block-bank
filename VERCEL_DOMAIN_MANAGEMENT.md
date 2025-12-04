# Gestion Manuelle des Domaines Vercel

## Configuration : Domaines gérés manuellement

Les domaines sont **gérés manuellement** via le dashboard Vercel, pas automatiquement lors des déploiements.

## Comment désactiver l'assignation automatique de domaine

### Option 1 : Via le Dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Domains**
4. Pour chaque domaine automatique assigné :
   - Cliquez sur les **3 points** à côté du domaine
   - Sélectionnez **Remove** ou **Unassign**
   - Confirmez la suppression

### Option 2 : Désactiver les domaines de prévisualisation

1. Allez dans **Settings** → **Git**
2. Désactivez **"Automatic Preview Deployments"** si vous ne voulez pas de domaines de prévisualisation automatiques

### Option 3 : Configuration du projet

1. Allez dans **Settings** → **General**
2. Décochez les options d'assignation automatique de domaine si disponibles

## Assigner un domaine manuellement

1. Allez dans **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine personnalisé (ex: `blockbank.com`)
4. Suivez les instructions pour configurer les DNS
5. Vérifiez la configuration

## Domaine de production

Le domaine de production principal doit être assigné manuellement et ne sera pas créé automatiquement lors des déploiements.

## Note

Les domaines `.vercel.app` sont toujours créés automatiquement par Vercel pour chaque projet. Pour les supprimer :
- Vous devez supprimer le projet et le recréer, OU
- Les laisser en place mais ne pas les utiliser

Les domaines personnalisés doivent toujours être ajoutés manuellement via le dashboard.

