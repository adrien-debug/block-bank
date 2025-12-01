# Guide d'Utilisation - BlockBank

## Comment voir les nouvelles modifications

### 1. Accéder au Dashboard

1. **Connectez votre wallet** :
   - Cliquez sur "Connecter Wallet" dans le header
   - Acceptez la connexion dans MetaMask
   - Le Dashboard s'affiche automatiquement

### 2. Démarrer le Flow de Création de Prêt

Il y a **2 façons** de démarrer le flow complet :

#### Option A : Depuis "Mes Prêts"
1. Cliquez sur l'onglet **"Mes Prêts"** dans la sidebar
2. Cliquez sur le bouton **"+ Nouveau prêt"**
3. Le flow démarre automatiquement

#### Option B : Depuis "NFT RWA"
1. Cliquez sur l'onglet **"NFT RWA"** dans la sidebar
2. Cliquez sur **"Utiliser pour prêt"** sur un NFT disponible
3. Le flow démarre automatiquement

### 3. Flow Complet (5 Étapes)

Une fois le flow démarré, vous verrez les nouvelles fonctionnalités :

#### Étape 1 : Marketplace NFT RWA
- **Composant** : `MarketplaceNFT`
- **Fonctionnalités** :
  - Filtres par marketplace (RealT, Tangibl, Courtyard, 4K, etc.)
  - Filtres par type d'actif (Immobilier, Mining, Infrastructure)
  - Filtres par valeur et risque
  - Modal de détails pour chaque NFT
  - Sélection d'un NFT pour prêt

#### Étape 2 : Calcul Conditions & Scoring
- **Composant** : `LoanConditions`
- **Fonctionnalités** :
  - Calcul automatique du risque NFT (0-100)
  - Classification (SAFE, MODERATE, RISKY)
  - Calcul LTV maximum selon Credit Score
  - Calcul taux d'intérêt ajusté
  - Options d'assurance avec primes

#### Étape 3 : 3 Profils de Prêt
- **Composant** : `LoanProfiles`
- **Fonctionnalités** :
  - **Profil SAFE** : Apport élevé (50%), LTV bas (40-50%), taux réduit
  - **Profil BALANCED** : Apport modéré (30%), LTV moyen (60-70%), taux standard
  - **Profil MAX LEVERAGE** : Apport minimal (10%), LTV élevé (80-90%), taux majoré, assurance obligatoire
  - Comparaison visuelle des 3 profils
  - Tableau comparatif détaillé

#### Étape 4 : Validation & Confirmation
- **Composant** : `LoanValidation`
- **Fonctionnalités** :
  - Récapitulatif complet du prêt
  - Vérification solvabilité (solde wallet)
  - Acceptation conditions légales
  - Validation finale avant paiement

#### Étape 5 : Processus Achat & Lock
- **Composant** : `LoanProcess`
- **Fonctionnalités** :
  - Suivi en temps réel des 4 étapes :
    1. Paiement apport
    2. Achat NFT
    3. Verrouillage NFT dans smart contract
    4. Déblocage prêt en stablecoins
  - Affichage des hash de transactions
  - Progress indicators

### 4. Services Backend Disponibles

Les services suivants sont implémentés et utilisés automatiquement :

- **Risk Engine** (`lib/services/riskEngine.ts`)
  - Calcul Credit Tier (A, B, C, D)
  - Calcul risque NFT
  - Calcul conditions prêt
  - Génération 3 profils

- **Insurance Calculator** (`lib/services/insuranceCalculator.ts`)
  - Calcul primes assurance
  - Options couverture
  - Impact sur conditions

- **Marketplace Aggregator** (`lib/services/marketplaceAggregator.ts`)
  - Agrégation 10 marketplaces RWA
  - Filtrage et recherche
  - Données mockées (prêtes pour API réelle)

### 5. Types TypeScript

Tous les types sont définis dans `types/index.ts` :
- User, Loan, NFTRWA, Insurance, Liquidation
- LoanProfileOption, LoanConditions, InsuranceOption
- Enums pour statuts et classifications

## Résolution de Problèmes

### Le flow ne démarre pas
- Vérifiez que vous êtes connecté avec un wallet
- Vérifiez la console du navigateur (F12) pour les erreurs
- Assurez-vous d'avoir cliqué sur "Nouveau prêt" ou "Utiliser pour prêt"

### Les composants ne s'affichent pas
- Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
- Vérifiez que le serveur tourne sur http://localhost:1001
- Vérifiez les logs du serveur dans le terminal

### Erreurs TypeScript
- Tous les fichiers sont typés
- Les erreurs de compilation apparaissent dans le terminal
- Le serveur ne démarre pas s'il y a des erreurs critiques

## Prochaines Étapes

Pour finaliser l'implémentation :
1. Ajouter les styles CSS pour les nouveaux composants
2. Connecter aux smart contracts blockchain
3. Remplacer les données mockées par des appels API réels
4. Ajouter les tests unitaires et d'intégration


