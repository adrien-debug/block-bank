# Guide de Test - Block Bank

## 🧪 Tests à Effectuer

### 1. Test de l'Authentification

#### Test Email/Password
1. Aller sur la page d'accueil (`/`)
2. Cliquer sur "Se Connecter"
3. Entrer email et mot de passe
4. Vérifier la redirection :
   - Si `role = 'admin'` → `/admin/dashboard`
   - Si `role = 'user'` → `/dashboard`

#### Test Wallet Connection
1. Aller sur la page d'accueil (`/`)
2. Cliquer sur "Connect Wallet"
3. Connecter MetaMask
4. Vérifier la redirection selon le rôle

### 2. Test des API Routes

#### Méthode 1 : Via le navigateur (Console)
1. Ouvrir la console du navigateur (F12)
2. Se connecter à l'application
3. Exécuter dans la console :
```javascript
// Test credit score
fetch('/api/credit-score')
  .then(r => r.json())
  .then(console.log)

// Test loans
fetch('/api/loans')
  .then(r => r.json())
  .then(console.log)

// Test NFT assets
fetch('/api/nft-assets')
  .then(r => r.json())
  .then(console.log)

// Test insurance
fetch('/api/insurance')
  .then(r => r.json())
  .then(console.log)
```

#### Méthode 2 : Via le script de test
```bash
# D'abord, obtenir userId et sessionToken depuis les cookies du navigateur
# Puis exécuter :
node scripts/test-api-routes.js <userId> <sessionToken>
```

### 3. Test des Composants Dashboard

#### Dashboard Principal (`/dashboard`)
1. Se connecter en tant qu'utilisateur
2. Vérifier que les statistiques s'affichent :
   - Score de crédit
   - Prêts actifs
   - NFT assets
   - Assurance
3. Vérifier les graphiques et les données

#### Loans (`/dashboard/loans`)
1. Naviguer vers `/dashboard/loans`
2. Vérifier que les prêts s'affichent
3. Vérifier les filtres (status, etc.)
4. Tester la création d'un nouveau prêt (si implémenté)

#### Credit Score (`/dashboard/credit-score`)
1. Naviguer vers `/dashboard/credit-score`
2. Vérifier que le score s'affiche
3. Vérifier les onglets (Overview, NFT Score, Partenaires)
4. Vérifier les graphiques

#### NFT Assets (`/dashboard/nft`)
1. Naviguer vers `/dashboard/nft`
2. Vérifier que les NFT assets s'affichent
3. Vérifier les filtres (type, status, risk)
4. Tester la création d'un nouveau NFT (si implémenté)

### 4. Test des Relations entre Tables

#### Vérifier les Foreign Keys
1. Créer un prêt avec un NFT asset
2. Vérifier que le NFT est marqué comme "locked"
3. Vérifier que les paiements sont liés au prêt
4. Vérifier que la police d'assurance est liée au prêt

### 5. Insertion de Données de Test

#### Méthode 1 : Via le script
```bash
# Obtenir userId depuis les cookies ou la base de données
node scripts/insert-test-data.js <userId>
```

Ce script va créer :
- 1 score de crédit
- 2 NFT assets
- 1 prêt actif
- 2 paiements
- 1 police d'assurance
- 2 partenaires de crédit score

#### Méthode 2 : Via l'interface (si implémenté)
1. Se connecter
2. Créer un NFT asset via l'interface
3. Créer un prêt via l'interface
4. Créer une police d'assurance via l'interface

### 6. Test des Erreurs

#### Test Authentification Manquante
1. Ouvrir une nouvelle fenêtre privée
2. Essayer d'accéder à `/dashboard`
3. Vérifier la redirection vers `/`

#### Test Rôle Incorrect
1. Se connecter en tant qu'utilisateur normal
2. Essayer d'accéder à `/admin/dashboard`
3. Vérifier la redirection vers `/dashboard`

#### Test API sans Authentification
1. Ouvrir la console
2. Exécuter :
```javascript
fetch('/api/loans')
  .then(r => r.json())
  .then(console.log)
```
3. Vérifier que l'erreur 401 est retournée

### 7. Test des Performances

#### Test de Chargement
1. Ouvrir les DevTools → Network
2. Recharger la page dashboard
3. Vérifier le temps de chargement des API
4. Vérifier qu'il n'y a pas de requêtes inutiles

#### Test de Cache
1. Charger le dashboard une première fois
2. Recharger la page
3. Vérifier que les données sont mises en cache si nécessaire

## ✅ Checklist de Validation

- [ ] Authentification email/password fonctionne
- [ ] Authentification wallet fonctionne
- [ ] Redirections selon le rôle fonctionnent
- [ ] API `/api/credit-score` retourne des données
- [ ] API `/api/loans` retourne des données
- [ ] API `/api/nft-assets` retourne des données
- [ ] API `/api/insurance` retourne des données
- [ ] Dashboard principal affiche les statistiques
- [ ] Page Loans affiche les prêts
- [ ] Page Credit Score affiche le score
- [ ] Page NFT Assets affiche les NFT
- [ ] Les relations entre tables fonctionnent
- [ ] Les erreurs sont gérées correctement
- [ ] Les états de chargement s'affichent
- [ ] Les données mockées ont été supprimées

## 🐛 Dépannage

### Problème : Les API retournent 401
**Solution** : Vérifier que vous êtes bien connecté et que les cookies sont présents

### Problème : Les données ne s'affichent pas
**Solution** : 
1. Vérifier la console pour les erreurs
2. Vérifier que les tables existent dans Supabase
3. Vérifier que les données de test ont été insérées

### Problème : Erreur "relation does not exist"
**Solution** : Exécuter le script de création des tables :
```bash
node scripts/create-all-tables.js
```

### Problème : Les foreign keys ne fonctionnent pas
**Solution** : Vérifier que les tables sont créées dans le bon ordre (voir `scripts/create-complete-schema.sql`)

## 📝 Notes

- Tous les tests doivent être effectués avec un utilisateur connecté
- Les données de test peuvent être supprimées et réinsérées à tout moment
- Les API routes nécessitent une authentification valide
- Les composants gèrent automatiquement les états de chargement et d'erreur


