# BLOCKBANK
## Schéma Complet de Financement et UX
### Plateforme On-Chain de Prêts Collatéralisés par NFT RWA

---

## TABLE DES MATIÈRES

1. [Architecture Globale](#architecture-globale)
2. [Pipeline Complet](#pipeline-complet)
3. [Diagramme Logique](#diagramme-logique)
4. [UX Flow par Écran](#ux-flow-par-écran)
5. [Data Model](#data-model)
6. [Risk Engine](#risk-engine)
7. [Insurance Model](#insurance-model)
8. [Liquidation & Buyback Model](#liquidation--buyback-model)
9. [Intégrations Partenaires RWA](#intégrations-partenaires-rwa)
10. [Optimisations & Recommandations](#optimisations--recommandations)

---

## ARCHITECTURE GLOBALE

### Composants On-Chain

- Smart Contract Principal : `BlockBankCore.sol`
- Smart Contract NFT Vault : `NFTVault.sol`
- Smart Contract Loan Engine : `LoanEngine.sol`
- Smart Contract Insurance Pool : `InsurancePool.sol`
- Smart Contract Liquidation : `LiquidationEngine.sol`
- Oracle Price Feed : Intégration Chainlink pour valorisation NFT RWA

### Composants Off-Chain

- Credit Score API : Calcul et mise à jour du BlockBank Credit Score
- Risk Assessment Engine : Évaluation du risque NFT RWA
- Insurance Calculator : Calcul des primes et couvertures
- Loan Calculator : Génération des 3 profils de prêt
- Marketplace Aggregator : Agrégation des NFT RWA depuis partenaires
- Admin Dashboard : Interface de gestion et monitoring

### Stack Technique

- Frontend : Next.js 14, TypeScript, Tailwind CSS
- Blockchain : Ethereum / Polygon / Arbitrum
- Smart Contracts : Solidity 0.8.x
- Oracle : Chainlink Price Feeds
- Storage : IPFS pour métadonnées NFT
- Backend : Node.js, PostgreSQL

---

## PIPELINE COMPLET

### Phase 1 : Onboarding Utilisateur

**Objectif** : Authentification wallet et initialisation du profil BlockBank

**Étapes** :

1. Connexion Wallet
   - Détection MetaMask / WalletConnect
   - Vérification réseau supporté
   - Enregistrement adresse utilisateur

2. Vérification KYC (Optionnel selon tranche)
   - Collecte identité (si requis)
   - Vérification via partenaire KYC
   - Statut : `KYC_PENDING` → `KYC_VERIFIED` → `KYC_REJECTED`

3. Calcul Credit Score Initial
   - Analyse on-chain : historique transactions, holdings, DeFi activity
   - Analyse off-chain : score de crédit traditionnel (si disponible)
   - Génération BlockBank Credit Score (0-1000)
   - Attribution tranche : A (800-1000), B (600-799), C (400-599), D (0-399)

4. Initialisation Profil
   - Création enregistrement utilisateur
   - Statut : `ONBOARDED`

**Durée estimée** : 2-5 minutes

---

### Phase 2 : Sélection NFT RWA

**Objectif** : Permettre à l'utilisateur de sélectionner un NFT RWA depuis les marketplaces partenaires

**Étapes** :

1. Accès Marketplace
   - Affichage agrégé des NFT RWA disponibles
   - Filtres : Type d'actif, Valeur, Risque, Marketplace source
   - Compatibilité : RealT, Tangibl, Courtyard, 4K, Maple, Backed Finance, Centrifuge, Landshare, 21.co, Dibbs

2. Sélection NFT
   - Affichage détails NFT :
     - Token ID, Contract Address
     - Type d'actif (Immobilier, Mining, Infrastructure, etc.)
     - Valeur estimée (USDC)
     - Risque classé (Low, Medium, High)
     - Marketplace source
     - Métadonnées complètes (IPFS)

3. Vérification Éligibilité
   - Vérification propriété NFT (si déjà possédé)
   - Vérification disponibilité sur marketplace
   - Vérification compatibilité avec BlockBank
   - Statut : `NFT_SELECTED`

**Durée estimée** : 1-3 minutes

---

### Phase 3 : Scoring & Risk Assessment

**Objectif** : Calculer les conditions de prêt basées sur le Credit Score utilisateur et le risque NFT

**Étapes** :

1. Évaluation Risque NFT RWA
   - Analyse actif sous-jacent :
     - Liquidité actif
     - Volatilité historique
     - Corrélations marché
     - Qualité documentation
     - Réputation émetteur
   - Score risque NFT : 0-100 (0 = très sûr, 100 = très risqué)
   - Classification : `SAFE` (0-30), `MODERATE` (31-60), `RISKY` (61-100)

2. Calcul Conditions Base
   - LTV Maximum selon Credit Score :
     - Tranche A : 60-70% LTV max
     - Tranche B : 50-60% LTV max
     - Tranche C : 40-50% LTV max
     - Tranche D : 30-40% LTV max
   - Ajustement selon risque NFT :
     - SAFE : +5% LTV
     - MODERATE : LTV base
     - RISKY : -10% LTV

3. Calcul Taux d'Intérêt Base
   - Taux base selon Credit Score :
     - Tranche A : 6-8% APY
     - Tranche B : 8-10% APY
     - Tranche C : 10-12% APY
     - Tranche D : 12-15% APY
   - Ajustement selon risque NFT :
     - SAFE : -0.5% APY
     - MODERATE : Taux base
     - RISKY : +1.5% APY

**Durée estimée** : 10-30 secondes (calcul instantané)

---

### Phase 4 : Assurance

**Objectif** : Calculer les options d'assurance et leurs impacts sur les conditions de prêt

**Étapes** :

1. Calcul Prime Assurance
   - Prime base selon risque utilisateur (Credit Score) :
     - Tranche A : 0.5-1% de la valeur prêt/an
     - Tranche B : 1-2% de la valeur prêt/an
     - Tranche C : 2-3% de la valeur prêt/an
     - Tranche D : 3-5% de la valeur prêt/an
   - Prime ajustée selon risque NFT :
     - SAFE : -20% prime
     - MODERATE : Prime base
     - RISKY : +30% prime

2. Options Couverture
   - Couverture Défaut Emprunteur : 50%, 75%, 100%
   - Couverture Risque Marché : 0%, 50%, 75%
   - Couverture Risque Actif : 0%, 50%, 75%

3. Impact sur Conditions Prêt
   - Avec assurance complète : +5% LTV max, -0.5% APY
   - Sans assurance : LTV et taux standards

**Durée estimée** : 5-10 secondes

---

### Phase 5 : Loan Engine - Génération 3 Profils

**Objectif** : Générer 3 profils de prêt (SAFE, BALANCED, MAX LEVERAGE) pour l'utilisateur

**Étapes** :

1. Profil SAFE
   - Apport : 50-60% de la valeur NFT
   - LTV : 40-50%
   - Taux : Taux base - 0.5%
   - Assurance : Optionnelle
   - Durée : 12-48 mois
   - Caractéristiques : Risque minimal, conditions favorables

2. Profil BALANCED
   - Apport : 30-40% de la valeur NFT
   - LTV : 60-70%
   - Taux : Taux base
   - Assurance : Recommandée
   - Durée : 12-48 mois
   - Caractéristiques : Équilibre apport/leverage

3. Profil MAX LEVERAGE
   - Apport : 10-20% de la valeur NFT
   - LTV : 80-90% (selon Credit Score)
   - Taux : Taux base + 1%
   - Assurance : Obligatoire
   - Durée : 12-36 mois
   - Caractéristiques : Leverage maximum, risque élevé

4. Présentation Comparaison
   - Tableau comparatif 3 profils
   - Calcul mensualités
   - Calcul coût total
   - Recommandation selon profil utilisateur

**Durée estimée** : 5-10 secondes

---

### Phase 6 : Sélection Profil & Validation

**Objectif** : Permettre à l'utilisateur de choisir un profil et valider les conditions

**Étapes** :

1. Sélection Profil
   - Utilisateur choisit SAFE, BALANCED ou MAX LEVERAGE
   - Affichage récapitulatif détaillé :
     - Montant prêt
     - Apport requis
     - Taux APY
     - Durée
     - Mensualité
     - Assurance (si applicable)
     - Coût total

2. Validation Conditions
   - Acceptation termes et conditions
   - Acceptation risques
   - Confirmation choix assurance (si applicable)
   - Statut : `PROFILE_SELECTED`

3. Vérification Solvabilité
   - Vérification solde wallet pour apport
   - Vérification capacité remboursement
   - Alerte si insuffisant

**Durée estimée** : 2-5 minutes

---

### Phase 7 : Achat & Lock NFT

**Objectif** : Acheter le NFT RWA et le verrouiller dans le smart contract BlockBank

**Étapes** :

1. Paiement Apport
   - Transaction on-chain : Transfert apport vers BlockBank Vault
   - Confirmation transaction
   - Statut : `DOWN_PAYMENT_RECEIVED`

2. Achat NFT
   - Si NFT déjà possédé : Transfert direct vers Vault
   - Si NFT sur marketplace : Achat via marketplace API
   - Transaction on-chain : Transfert NFT vers `NFTVault.sol`
   - Confirmation réception NFT
   - Statut : `NFT_PURCHASED` → `NFT_LOCKED`

3. Lock dans Smart Contract
   - NFT transféré vers `NFTVault.sol`
   - NFT verrouillé (non transférable sauf liquidation)
   - Enregistrement prêt créé
   - Statut : `NFT_LOCKED`

**Durée estimée** : 5-15 minutes (selon congestion réseau)

---

### Phase 8 : Déblocage Prêt

**Objectif** : Débloquer les stablecoins du prêt vers le wallet utilisateur

**Étapes** :

1. Vérification Finale
   - NFT verrouillé confirmé
   - Apport reçu confirmé
   - Assurance activée (si applicable)
   - Toutes conditions remplies

2. Déblocage Stablecoins
   - Transaction on-chain : Mint ou transfert stablecoins depuis `LoanEngine.sol`
   - Montant : Montant prêt calculé
   - Devise : USDC (ou USDT/DAI selon choix)
   - Transfert vers wallet utilisateur

3. Activation Prêt
   - Prêt marqué `ACTIVE`
   - Date début : Timestamp actuel
   - Date première échéance : +1 mois (ou selon durée choisie)
   - Intérêts commencent à courir
   - Statut : `LOAN_ACTIVE`

**Durée estimée** : 2-5 minutes

---

### Phase 9 : Gestion Prêt Actif

**Objectif** : Suivi et gestion du prêt pendant sa durée

**Étapes** :

1. Suivi Mensuel
   - Calcul mensualité due
   - Notification échéance (7 jours avant)
   - Rappel paiement (3 jours avant)
   - Alerte retard (jour échéance)

2. Paiement Mensualité
   - Interface paiement
   - Transaction on-chain : Transfert stablecoins vers `LoanEngine.sol`
   - Mise à jour solde restant
   - Mise à jour historique paiements
   - Statut : `PAYMENT_RECEIVED`

3. Remboursement Anticipé
   - Option remboursement total
   - Calcul intérêts restants
   - Calcul pénalité (si applicable, max 1%)
   - Transaction on-chain : Remboursement complet
   - Libération NFT (si remboursement total)
   - Statut : `LOAN_REPAID` → `NFT_RELEASED`

4. Renouvellement Assurance
   - Notification expiration (30 jours avant)
   - Option renouvellement
   - Paiement prime annuelle
   - Statut : `INSURANCE_RENEWED`

**Durée estimée** : Continu (gestion active)

---

### Phase 10 : Liquidation & Buyback

**Objectif** : Gérer les défauts de paiement et la liquidation du NFT collatéral

**Étapes** :

1. Détection Défaut
   - Retard paiement > 30 jours
   - Ratio collatéral < seuil liquidation (ex: 80% LTV)
   - Alerte automatique
   - Statut : `LOAN_DEFAULT` → `LIQUIDATION_PENDING`

2. Processus Liquidation
   - Notification utilisateur (7 jours avant liquidation)
   - Tentative rachat utilisateur (option)
   - Si non résolu : Déclenchement liquidation

3. Buyback Automatique
   - Partenaires RWA ou fonds interne notifiés
   - Offre buyback avec discount :
     - Classe SAFE : 10% discount
     - Classe MODERATE : 20% discount
     - Classe RISKY : 25% discount
   - Premier partenaire acceptant achète le NFT
   - Transaction on-chain : Transfert NFT vers partenaire
   - Remboursement prêt depuis fonds buyback
   - Solde restant (si positif) versé à utilisateur

4. Clôture Prêt
   - Prêt marqué `LIQUIDATED`
   - NFT libéré du Vault
   - Historique enregistré
   - Statut : `LOAN_CLOSED`

**Durée estimée** : 7-45 jours (selon processus)

---

## DIAGRAMME LOGIQUE

```
┌─────────────────────────────────────────────────────────────────┐
│                    BLOCKBANK LOAN PIPELINE                       │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─► [ONBOARDING]
  │     │
  │     ├─► Connect Wallet
  │     │     └─► Verify Network
  │     │
  │     ├─► KYC Verification (Optional)
  │     │     ├─► KYC_PENDING
  │     │     ├─► KYC_VERIFIED
  │     │     └─► KYC_REJECTED → END
  │     │
  │     └─► Calculate Credit Score
  │           ├─► On-Chain Analysis
  │           ├─► Off-Chain Analysis
  │           └─► Score: 0-1000 → Tranche A/B/C/D
  │
  ├─► [NFT SELECTION]
  │     │
  │     ├─► Browse Marketplaces
  │     │     ├─► RealT
  │     │     ├─► Tangibl
  │     │     ├─► Courtyard
  │     │     ├─► 4K
  │     │     ├─► Maple
  │     │     ├─► Backed Finance
  │     │     ├─► Centrifuge
  │     │     ├─► Landshare
  │     │     ├─► 21.co
  │     │     └─► Dibbs
  │     │
  │     ├─► Select NFT RWA
  │     │     └─► Verify Eligibility
  │     │
  │     └─► NFT_SELECTED
  │
  ├─► [SCORING & RISK]
  │     │
  │     ├─► Assess NFT Risk
  │     │     ├─► Asset Liquidity
  │     │     ├─► Historical Volatility
  │     │     ├─► Market Correlations
  │     │     ├─► Documentation Quality
  │     │     └─► Issuer Reputation
  │     │           └─► Risk Score: 0-100
  │     │                 ├─► SAFE (0-30)
  │     │                 ├─► MODERATE (31-60)
  │     │                 └─► RISKY (61-100)
  │     │
  │     ├─► Calculate Base Conditions
  │     │     ├─► LTV Max (Credit Score + NFT Risk)
  │     │     └─► Interest Rate (Credit Score + NFT Risk)
  │     │
  │     └─► CONDITIONS_CALCULATED
  │
  ├─► [INSURANCE]
  │     │
  │     ├─► Calculate Insurance Premium
  │     │     ├─► Base Premium (Credit Score)
  │     │     └─► Adjusted Premium (NFT Risk)
  │     │
  │     ├─► Coverage Options
  │     │     ├─► Borrower Default: 50%/75%/100%
  │     │     ├─► Market Risk: 0%/50%/75%
  │     │     └─► Asset Risk: 0%/50%/75%
  │     │
  │     └─► INSURANCE_OPTIONS_READY
  │
  ├─► [LOAN ENGINE]
  │     │
  │     ├─► Generate Profile SAFE
  │     │     ├─► Down Payment: 50-60%
  │     │     ├─► LTV: 40-50%
  │     │     ├─► Rate: Base - 0.5%
  │     │     └─► Insurance: Optional
  │     │
  │     ├─► Generate Profile BALANCED
  │     │     ├─► Down Payment: 30-40%
  │     │     ├─► LTV: 60-70%
  │     │     ├─► Rate: Base
  │     │     └─► Insurance: Recommended
  │     │
  │     ├─► Generate Profile MAX LEVERAGE
  │     │     ├─► Down Payment: 10-20%
  │     │     ├─► LTV: 80-90%
  │     │     ├─► Rate: Base + 1%
  │     │     └─► Insurance: Mandatory
  │     │
  │     └─► PROFILES_GENERATED
  │
  ├─► [SELECTION & VALIDATION]
  │     │
  │     ├─► User Selects Profile
  │     │     └─► SAFE | BALANCED | MAX_LEVERAGE
  │     │
  │     ├─► Review Terms
  │     │     ├─► Loan Amount
  │     │     ├─► Down Payment
  │     │     ├─► Interest Rate
  │     │     ├─► Duration
  │     │     ├─► Monthly Payment
  │     │     └─► Insurance (if applicable)
  │     │
  │     ├─► Accept Terms
  │     │
  │     └─► PROFILE_SELECTED
  │
  ├─► [PURCHASE & LOCK]
  │     │
  │     ├─► Pay Down Payment
  │     │     └─► Transfer to BlockBank Vault
  │     │           └─► DOWN_PAYMENT_RECEIVED
  │     │
  │     ├─► Purchase NFT
  │     │     ├─► If Owned: Direct Transfer
  │     │     └─► If Marketplace: Purchase via API
  │     │           └─► NFT_PURCHASED
  │     │
  │     └─► Lock NFT in Vault
  │           └─► Transfer to NFTVault.sol
  │                 └─► NFT_LOCKED
  │
  ├─► [LOAN DISBURSEMENT]
  │     │
  │     ├─► Final Verification
  │     │     ├─► NFT Locked ✓
  │     │     ├─► Down Payment Received ✓
  │     │     └─► Insurance Activated ✓ (if applicable)
  │     │
  │     ├─► Disburse Stablecoins
  │     │     └─► Transfer from LoanEngine.sol
  │     │           └─► To User Wallet
  │     │
  │     └─► LOAN_ACTIVE
  │
  ├─► [LOAN MANAGEMENT]
  │     │
  │     ├─► Monthly Tracking
  │     │     ├─► Calculate Payment Due
  │     │     ├─► Notify (7 days before)
  │     │     ├─► Remind (3 days before)
  │     │     └─► Alert (on due date)
  │     │
  │     ├─► Payment Flow
  │     │     ├─► User Pays Monthly Payment
  │     │     ├─► Update Remaining Balance
  │     │     └─► PAYMENT_RECEIVED
  │     │
  │     ├─► Early Repayment (Optional)
  │     │     ├─► Calculate Remaining Interest
  │     │     ├─► Calculate Penalty (max 1%)
  │     │     ├─► Full Repayment
  │     │     └─► Release NFT
  │     │           └─► LOAN_REPAID → NFT_RELEASED
  │     │
  │     └─► Insurance Renewal (Annual)
  │           └─► INSURANCE_RENEWED
  │
  └─► [LIQUIDATION & BUYBACK]
        │
        ├─► Default Detection
        │     ├─► Payment Delay > 30 days
        │     └─► Collateral Ratio < 80% LTV
        │           └─► LOAN_DEFAULT
        │
        ├─► Liquidation Process
        │     ├─► Notify User (7 days warning)
        │     ├─► User Buyback Option
        │     └─► If Not Resolved: Trigger Liquidation
        │
        ├─► Automatic Buyback
        │     ├─► Notify RWA Partners / Internal Fund
        │     ├─► Offer with Discount:
        │     │     ├─► SAFE: 10% discount
        │     │     ├─► MODERATE: 20% discount
        │     │     └─► RISKY: 25% discount
        │     ├─► First Acceptor Buys NFT
        │     ├─► Transfer NFT to Buyer
        │     ├─► Repay Loan from Buyback Fund
        │     └─► Remaining Balance to User (if positive)
        │
        └─► LOAN_CLOSED
              └─► END
```

---

## UX FLOW PAR ÉCRAN

### Écran 1 : Landing Page (Non Connecté)

**Objectif** : Présentation BlockBank et invitation à se connecter

**Contenu** :
- Hero Section
  - Titre : "BlockBank - Prêts Collatéralisés par NFT RWA"
  - Sous-titre : "Financez vos actifs réels tokenisés avec votre Credit Score on-chain"
  - CTA Principal : "Connecter Wallet"
- Features Section
  - 3 cartes :
    1. Credit Score On-Chain (0-1000)
    2. NFT RWA Marketplace (10+ partenaires)
    3. Assurance Automatique
- Stats Section
  - Volume total prêté
  - Nombre d'utilisateurs
  - NFT RWA disponibles
- Footer
  - Liens légaux
  - Documentation

**Actions** :
- Clic "Connecter Wallet" → Redirection vers connexion

---

### Écran 2 : Dashboard Principal (Connecté)

**Objectif** : Vue d'ensemble de l'activité utilisateur

**Contenu** :
- Header
  - Logo BlockBank
  - Adresse wallet (tronquée)
  - Notifications
- Sidebar Navigation
  - Dashboard (actif)
  - Credit Score
  - Mes Prêts
  - NFT RWA
  - Assurance
  - Profil
- Main Content
  - Stats Cards (4)
    1. Credit Score : 750 + Tranche A
    2. Prêts Actifs : 2 prêts + 150,000 USDC
    3. NFT RWA : 3 NFT + 950,000 USDC
    4. Assurance : Actif + 80% couverture
  - Graphiques
    - Évolution Credit Score (6 mois)
    - Répartition actifs (pie chart)
  - Activité Récente
    - Liste transactions récentes
  - Alertes
    - Paiements à venir
    - Notifications importantes
  - Actions Rapides
    - Nouveau prêt
    - Tokeniser actif
    - Mettre à jour score
    - Gérer assurance

**Actions** :
- Navigation entre onglets
- Accès rapide aux fonctionnalités principales

---

### Écran 3 : Credit Score

**Objectif** : Affichage détaillé du Credit Score et de ses composantes

**Contenu** :
- Header
  - Titre : "Mon Credit Score"
  - Score Principal : 750 (grand cercle)
  - Tranche : A (badge)
- Détail Composantes (4)
  1. On-Chain Behavioral : 280/300
     - Barre progression
     - Détails : Transactions, DeFi activity, historique wallet
  2. Off-Chain Financial : 250/300
     - Barre progression
     - Détails : Score crédit traditionnel, revenus, historique bancaire
  3. Asset-Based : 150/200
     - Barre progression
     - Détails : Holdings crypto, NFT, actifs tokenisés
  4. Reputation & Trust : 70/100
     - Barre progression
     - Détails : Réputation on-chain, références, historique prêts
- Historique
  - Graphique évolution (12 mois)
  - Liste événements impactant score
- Actions
  - Bouton "Mettre à jour mon score"
  - Bouton "Voir l'historique complet"

**Actions** :
- Mise à jour score (déclenche recalcul)
- Consultation historique

---

### Écran 4 : Marketplace NFT RWA

**Objectif** : Permettre la sélection d'un NFT RWA depuis les marketplaces partenaires

**Contenu** :
- Header
  - Titre : "Sélectionner un NFT RWA"
  - Filtres
    - Type actif (Immobilier, Mining, Infrastructure, etc.)
    - Marketplace source
    - Fourchette valeur
    - Niveau risque
- Grille NFT
  - Carte par NFT affichant :
    - Image / Preview
    - Nom actif
    - Type
    - Valeur (USDC)
    - Marketplace source (badge)
    - Risque (badge : Low/Medium/High)
    - Token ID
    - Contract Address
  - Pagination
- Détails NFT (Modal)
  - Informations complètes
  - Métadonnées IPFS
  - Historique transactions
  - Documentation actif
  - Bouton "Utiliser pour prêt"

**Actions** :
- Filtrage NFT
- Sélection NFT
- Ouverture modal détails
- Clic "Utiliser pour prêt" → Redirection vers calcul conditions

---

### Écran 5 : Calcul Conditions & Scoring

**Objectif** : Afficher le calcul des conditions de prêt en temps réel

**Contenu** :
- Header
  - NFT sélectionné (nom, valeur, type)
  - Credit Score utilisateur
- Calcul en Temps Réel
  - Section Risque NFT
    - Score risque : 35/100
    - Classification : MODERATE
    - Détails analyse
  - Section Conditions Base
    - LTV Maximum : 65%
    - Taux Base : 8.5% APY
    - Ajustements appliqués
  - Section Assurance
    - Prime calculée : 1,200 USDC/an
    - Options couverture
    - Impact sur conditions
- Loading State
  - Animation calcul
  - "Calcul des conditions optimales..."

**Actions** :
- Affichage automatique après sélection NFT
- Redirection vers profils de prêt

---

### Écran 6 : 3 Profils de Prêt

**Objectif** : Présenter les 3 profils et permettre la sélection

**Contenu** :
- Header
  - Titre : "Choisissez votre profil de prêt"
  - NFT sélectionné (rappel)
- 3 Cartes Profils (côte à côte)

  **Profil SAFE**
  - Badge : "Sécurisé"
  - Apport : 150,000 USDC (50%)
  - Prêt : 150,000 USDC
  - LTV : 50%
  - Taux : 8.0% APY
  - Durée : 36 mois
  - Mensualité : 4,700 USDC
  - Assurance : Optionnelle
  - Coût total : 169,200 USDC
  - Bouton "Choisir SAFE"

  **Profil BALANCED**
  - Badge : "Équilibré" (Recommandé)
  - Apport : 90,000 USDC (30%)
  - Prêt : 210,000 USDC
  - LTV : 70%
  - Taux : 8.5% APY
  - Durée : 36 mois
  - Mensualité : 6,600 USDC
  - Assurance : Recommandée
  - Coût total : 237,600 USDC
  - Bouton "Choisir BALANCED"

  **Profil MAX LEVERAGE**
  - Badge : "Leverage Max"
  - Apport : 30,000 USDC (10%)
  - Prêt : 270,000 USDC
  - LTV : 90%
  - Taux : 9.5% APY
  - Durée : 36 mois
  - Mensualité : 8,650 USDC
  - Assurance : Obligatoire
  - Coût total : 311,400 USDC
  - Bouton "Choisir MAX LEVERAGE"

- Comparaison Tableau
  - Comparaison côte à côte des 3 profils
- Recommandation
  - Message personnalisé selon profil utilisateur

**Actions** :
- Sélection profil → Redirection vers validation

---

### Écran 7 : Validation & Confirmation

**Objectif** : Récapitulatif final et validation avant exécution

**Contenu** :
- Header
  - Titre : "Confirmer votre prêt"
  - Étape : 4/4
- Récapitulatif Complet
  - NFT RWA
    - Nom, Type, Valeur
    - Token ID, Contract
  - Profil Sélectionné
    - Type profil
    - Apport
    - Montant prêt
    - LTV
    - Taux
    - Durée
    - Mensualité
  - Assurance
    - Statut (Oui/Non)
    - Couverture
    - Prime annuelle
  - Coûts
    - Apport
    - Prime assurance (si applicable)
    - Coût total prêt
- Conditions Légales
  - Checkbox : "J'accepte les termes et conditions"
  - Checkbox : "J'ai lu et compris les risques"
  - Lien vers documents complets
- Vérification Solvabilité
  - Solde wallet actuel
  - Apport requis
  - Statut : ✓ Suffisant / ✗ Insuffisant
- Actions
  - Bouton "Retour" (modifier choix)
  - Bouton "Confirmer et Payer" (primary, disabled si conditions non acceptées)

**Actions** :
- Validation conditions
- Paiement apport
- Déclenchement processus achat NFT

---

### Écran 8 : Processus Achat & Lock

**Objectif** : Suivi en temps réel du processus d'achat et verrouillage NFT

**Contenu** :
- Header
  - Titre : "Finalisation de votre prêt"
- Progress Steps
  1. Paiement Apport
     - Statut : En cours / ✓ Complété
     - Hash transaction
     - Lien explorer
  2. Achat NFT
     - Statut : En attente / En cours / ✓ Complété
     - Hash transaction
     - Lien explorer
  3. Lock NFT
     - Statut : En attente / En cours / ✓ Complété
     - Hash transaction
     - Lien explorer
  4. Déblocage Prêt
     - Statut : En attente / En cours / ✓ Complété
     - Hash transaction
     - Lien explorer
- Détails Transactions
  - Liste transactions avec statuts
  - Temps estimé restant
- Message État
  - "Votre apport a été reçu..."
  - "Achat du NFT en cours..."
  - "NFT verrouillé avec succès..."
  - "Prêt débloqué !"

**Actions** :
- Suivi automatique des transactions
- Notification à chaque étape
- Redirection vers dashboard une fois complété

---

### Écran 9 : Mes Prêts (Liste)

**Objectif** : Afficher tous les prêts de l'utilisateur

**Contenu** :
- Header
  - Titre : "Mes Prêts"
  - Bouton "+ Nouveau prêt"
- Filtres
  - Statut (Tous, Actifs, Clôturés, En défaut)
  - Type NFT
  - Date
- Liste Prêts
  - Carte par prêt affichant :
    - ID Prêt
    - NFT Collatéral (nom, image)
    - Montant prêt
    - LTV
    - Taux
    - Durée
    - Statut (badge)
    - Prochain paiement
    - Échéance
    - Bouton "Voir détails"
    - Bouton "Payer maintenant" (si échéance proche)
- Stats Résumé
  - Total prêts actifs
  - Montant total emprunté
  - Solde restant
  - Prochain paiement total

**Actions** :
- Filtrer prêts
- Voir détails prêt
- Payer mensualité
- Créer nouveau prêt

---

### Écran 10 : Détails Prêt

**Objectif** : Affichage détaillé d'un prêt spécifique

**Contenu** :
- Header
  - Titre : "Prêt #1234"
  - Statut badge
  - Bouton "Retour"
- Informations Prêt
  - NFT Collatéral
    - Image, nom, type
    - Valeur actuelle
    - Token ID
  - Conditions Prêt
    - Montant initial
    - Solde restant
    - LTV actuel
    - Taux APY
    - Durée
    - Date début
    - Date fin prévue
  - Assurance
    - Statut
    - Couverture
    - Prime
    - Date expiration
- Historique Paiements
  - Tableau paiements
    - Date
    - Montant
    - Statut (✓ Payé / ⏳ En attente)
    - Hash transaction
- Prochain Paiement
  - Montant dû
  - Date échéance
  - Jours restants
  - Bouton "Payer maintenant"
- Actions
  - Remboursement anticipé
  - Renouveler assurance
  - Voir NFT collatéral

**Actions** :
- Paiement mensualité
- Remboursement anticipé
- Renouvellement assurance

---

### Écran 11 : Assurance

**Objectif** : Gestion des polices d'assurance

**Contenu** :
- Header
  - Titre : "Mes Assurances"
- Résumé
  - Couverture totale
  - Prime annuelle totale
  - Nombre polices actives
- Liste Polices
  - Carte par police affichant :
    - Prêt associé
    - Statut (Actif / Expiré)
    - Couverture (%)
    - Prime annuelle
    - Risques couverts (badges)
    - Date expiration
    - Bouton "Voir détails"
    - Bouton "Renouveler"
- Options
  - Souscrire nouvelle assurance
  - Modifier couverture existante

**Actions** :
- Voir détails police
- Renouveler police
- Souscrire nouvelle assurance

---

### Écran 12 : Profil Utilisateur

**Objectif** : Gestion du profil et paramètres

**Contenu** :
- Header
  - Titre : "Mon Profil"
- Informations Wallet
  - Adresse (formatée)
  - Réseau
  - Bouton "Copier"
- Informations KYC
  - Statut vérification
  - Badge "✓ Vérifié" / "⏳ En attente"
  - Bouton "Mettre à jour"
- Paramètres
  - Notifications email
  - Notifications push
  - Mode sombre
  - Langue
- Statistiques
  - Nombre prêts
  - Volume total
  - Score moyen
- Actions
  - Déconnecter wallet
  - Exporter données

**Actions** :
- Mise à jour KYC
- Modification paramètres
- Déconnexion

---

### Écran 13 : Dashboard Admin

**Objectif** : Interface de gestion pour administrateurs BlockBank

**Contenu** :
- Header
  - Titre : "Admin Dashboard"
  - Utilisateur admin
- Navigation Admin
  - Vue d'ensemble
  - Prêts (tous)
  - Utilisateurs
  - NFT RWA
  - Liquidations
  - Assurance
  - Analytics
  - Paramètres
- Vue d'Ensemble
  - Stats Globales
    - Total prêts actifs
    - Volume total
    - Taux défaut
    - Réserves assurance
  - Graphiques
    - Évolution volume
    - Répartition risques
    - Performance par tranche
  - Alertes
    - Prêts en défaut
    - Liquidations en cours
    - Problèmes système
- Gestion Prêts
  - Liste tous prêts
  - Filtres avancés
  - Actions : Voir détails, Modifier, Liquider
- Gestion Utilisateurs
  - Liste utilisateurs
  - Credit Scores
  - Historique prêts
  - Actions : Modifier score, Suspendre compte
- Gestion Liquidations
  - Prêts en défaut
  - Processus liquidation
  - Buyback offers
  - Actions : Approuver, Rejeter, Forcer liquidation

**Actions** :
- Gestion complète plateforme
- Monitoring risques
- Interventions manuelles

---

## DATA MODEL

### User

```typescript
interface User {
  id: string
  walletAddress: string
  network: 'ethereum' | 'polygon' | 'arbitrum'
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED'
  kycData?: {
    firstName?: string
    lastName?: string
    email?: string
    verifiedAt?: Date
  }
  creditScore: number // 0-1000
  creditTier: 'A' | 'B' | 'C' | 'D'
  creditScoreHistory: CreditScoreEntry[]
  createdAt: Date
  updatedAt: Date
}
```

### CreditScoreEntry

```typescript
interface CreditScoreEntry {
  id: string
  userId: string
  score: number
  components: {
    onChainBehavioral: number // 0-300
    offChainFinancial: number // 0-300
    assetBased: number // 0-200
    reputationTrust: number // 0-100
  }
  calculatedAt: Date
  factors: string[] // Raisons changement score
}
```

### NFT RWA

```typescript
interface NFTRWA {
  id: string
  tokenId: string
  contractAddress: string
  marketplace: 'REALT' | 'TANGIBL' | 'COURTYARD' | '4K' | 'MAPLE' | 'BACKED' | 'CENTRIFUGE' | 'LANDSHARE' | '21CO' | 'DIBBS'
  assetType: 'REAL_ESTATE' | 'MINING' | 'INFRASTRUCTURE' | 'COMMODITIES' | 'OTHER'
  name: string
  description: string
  value: number // USDC
  valueCurrency: 'USDC' | 'USDT' | 'DAI'
  riskScore: number // 0-100
  riskClass: 'SAFE' | 'MODERATE' | 'RISKY'
  metadataURI: string // IPFS
  ownerAddress?: string
  isLocked: boolean
  lockedInLoanId?: string
  createdAt: Date
  updatedAt: Date
}
```

### Loan

```typescript
interface Loan {
  id: string
  userId: string
  nftRwaId: string
  profile: 'SAFE' | 'BALANCED' | 'MAX_LEVERAGE'
  
  // Conditions
  nftValue: number // Valeur NFT au moment prêt
  downPayment: number // Apport utilisateur
  loanAmount: number // Montant prêt
  ltv: number // Loan-to-Value ratio
  interestRate: number // APY
  duration: number // Mois
  monthlyPayment: number
  
  // Dates
  startDate: Date
  endDate: Date
  nextPaymentDate: Date
  
  // État
  status: 'PENDING' | 'ACTIVE' | 'REPAID' | 'DEFAULT' | 'LIQUIDATED' | 'CLOSED'
  remainingBalance: number
  totalPaid: number
  
  // Assurance
  insuranceId?: string
  insuranceRequired: boolean
  
  // Transactions
  transactions: LoanTransaction[]
  
  createdAt: Date
  updatedAt: Date
}
```

### LoanTransaction

```typescript
interface LoanTransaction {
  id: string
  loanId: string
  type: 'DOWN_PAYMENT' | 'DISBURSEMENT' | 'PAYMENT' | 'EARLY_REPAYMENT' | 'LIQUIDATION'
  amount: number
  currency: 'USDC' | 'USDT' | 'DAI'
  txHash: string
  blockNumber: number
  timestamp: Date
  status: 'PENDING' | 'CONFIRMED' | 'FAILED'
}
```

### Insurance

```typescript
interface Insurance {
  id: string
  loanId: string
  userId: string
  
  // Couverture
  borrowerDefaultCoverage: number // 50, 75, 100
  marketRiskCoverage: number // 0, 50, 75
  assetRiskCoverage: number // 0, 50, 75
  totalCoverage: number // %
  
  // Prime
  annualPremium: number
  premiumCurrency: 'USDC' | 'USDT' | 'DAI'
  
  // Dates
  startDate: Date
  endDate: Date
  renewalDate: Date
  
  // État
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
  
  createdAt: Date
  updatedAt: Date
}
```

### Liquidation

```typescript
interface Liquidation {
  id: string
  loanId: string
  userId: string
  nftRwaId: string
  
  // Déclenchement
  triggerReason: 'PAYMENT_DELAY' | 'COLLATERAL_RATIO' | 'MANUAL'
  triggerDate: Date
  daysOverdue?: number
  collateralRatio?: number
  
  // Processus
  status: 'PENDING' | 'USER_BUYBACK_OPTION' | 'PARTNER_NOTIFIED' | 'BUYBACK_OFFERED' | 'EXECUTED' | 'CANCELLED'
  
  // Buyback
  buybackDiscount: number // 10, 20, 25
  buybackPrice: number
  buybackBuyer?: string // Adresse partenaire ou fonds interne
  buybackTxHash?: string
  
  // Résultat
  loanRepaid: number
  remainingToUser?: number
  
  executedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Marketplace Integration

```typescript
interface MarketplaceIntegration {
  id: string
  name: string
  apiEndpoint: string
  apiKey?: string
  supportedAssetTypes: string[]
  isActive: boolean
  lastSync: Date
}
```

---

## RISK ENGINE

### Calcul Credit Score

**Formule Base** :
```
Credit Score = (On-Chain Behavioral × 0.30) + 
               (Off-Chain Financial × 0.30) + 
               (Asset-Based × 0.20) + 
               (Reputation & Trust × 0.20)
```

**On-Chain Behavioral (0-300)** :
- Historique transactions (0-100)
  - Volume total transactions
  - Fréquence transactions
  - Diversité protocoles utilisés
- DeFi Activity (0-100)
  - Prêts précédents (on-chain)
  - Liquidations passées
  - Utilisation protocoles DeFi
- Wallet Age & Activity (0-100)
  - Ancienneté wallet
  - Activité continue
  - Holdings stables

**Off-Chain Financial (0-300)** :
- Score crédit traditionnel (0-150)
  - Si disponible via partenaire
  - Sinon : 0
- Revenus déclarés (0-100)
  - Si KYC complet
  - Sinon : 0
- Historique bancaire (0-50)
  - Si disponible
  - Sinon : 0

**Asset-Based (0-200)** :
- Holdings crypto (0-100)
  - Valeur totale portefeuille
  - Diversification
  - Liquidité actifs
- NFT Holdings (0-50)
  - Valeur collection NFT
  - Diversité
- Actifs tokenisés (0-50)
  - RWA possédés
  - Valeur totale

**Reputation & Trust (0-100)** :
- Réputation on-chain (0-50)
  - Score via protocoles réputation
  - Historique interactions
- Références (0-30)
  - Références autres utilisateurs
  - Vouching system
- Historique prêts BlockBank (0-20)
  - Nombre prêts précédents
  - Taux remboursement
  - Délais paiement

### Calcul Risque NFT RWA

**Formule Base** :
```
Risk Score = (Liquidity Risk × 0.30) + 
             (Volatility Risk × 0.25) + 
             (Market Correlation × 0.20) + 
             (Documentation Quality × 0.15) + 
             (Issuer Reputation × 0.10)
```

**Liquidity Risk (0-100)** :
- Volume échanges NFT (0-40)
- Nombre détenteurs (0-30)
- Facilité vente (0-30)

**Volatility Risk (0-100)** :
- Volatilité historique valeur (0-50)
- Corrélation marché crypto (0-30)
- Corrélation marché traditionnel (0-20)

**Market Correlation (0-100)** :
- Corrélation avec indices (0-50)
- Sensibilité cycles économiques (0-30)
- Diversification (0-20)

**Documentation Quality (0-100)** :
- Complétude documentation (0-40)
- Vérification légale (0-30)
- Transparence actif (0-30)

**Issuer Reputation (0-100)** :
- Réputation émetteur (0-50)
- Historique émissions (0-30)
- Backing institutionnel (0-20)

### Calcul Conditions Prêt

**LTV Maximum** :
```
Base LTV = f(Credit Tier)
  A: 70%
  B: 60%
  C: 50%
  D: 40%

Adjusted LTV = Base LTV + f(NFT Risk)
  SAFE: +5%
  MODERATE: 0%
  RISKY: -10%

Final LTV = min(Adjusted LTV, 90%)
```

**Taux d'Intérêt** :
```
Base Rate = f(Credit Tier)
  A: 7% APY
  B: 9% APY
  C: 11% APY
  D: 13.5% APY

Adjusted Rate = Base Rate + f(NFT Risk)
  SAFE: -0.5%
  MODERATE: 0%
  RISKY: +1.5%

Profile Adjustment = f(Profile)
  SAFE: -0.5%
  BALANCED: 0%
  MAX_LEVERAGE: +1%

Final Rate = Adjusted Rate + Profile Adjustment
```

### Seuils Liquidation

**Déclenchement Liquidation** :
1. Retard paiement > 30 jours
2. Ratio collatéral < 80% LTV
   ```
   Current LTV = (Remaining Balance / Current NFT Value) × 100
   ```
3. Défaut volontaire (détection manuelle)

**Calcul Ratio Collatéral** :
```
Current NFT Value = Oracle Price Feed (Chainlink)
Current LTV = (Remaining Balance / Current NFT Value) × 100

If Current LTV > 80% → Trigger Liquidation Warning
If Current LTV > 90% → Trigger Immediate Liquidation
```

---

## INSURANCE MODEL

### Calcul Prime Assurance

**Formule Base** :
```
Base Premium = Loan Amount × Base Rate

Base Rate = f(Credit Tier)
  A: 0.75% / year
  B: 1.5% / year
  C: 2.5% / year
  D: 4% / year

Adjusted Rate = Base Rate × f(NFT Risk)
  SAFE: × 0.8
  MODERATE: × 1.0
  RISKY: × 1.3

Final Premium = Loan Amount × Adjusted Rate
```

### Options Couverture

**Couverture Défaut Emprunteur** :
- 50% : Prime × 0.7
- 75% : Prime × 1.0
- 100% : Prime × 1.4

**Couverture Risque Marché** :
- 0% : Prime × 0.0 (non incluse)
- 50% : Prime × 0.3
- 75% : Prime × 0.5

**Couverture Risque Actif** :
- 0% : Prime × 0.0 (non incluse)
- 50% : Prime × 0.2
- 75% : Prime × 0.35

**Prime Totale** :
```
Total Premium = Base Premium × 
                (1 + Borrower Default Multiplier) ×
                (1 + Market Risk Multiplier) ×
                (1 + Asset Risk Multiplier)
```

### Impact Assurance sur Conditions

**Avec Assurance Complète** :
- LTV Maximum : +5%
- Taux d'Intérêt : -0.5% APY
- Réduction prime : 10% si assurance complète

**Sans Assurance** :
- Conditions standards
- Pas de bonus

---

## LIQUIDATION & BUYBACK MODEL

### Processus Liquidation

**Phase 1 : Détection Défaut**
- Monitoring automatique quotidien
- Vérification paiements en retard
- Vérification ratios collatéraux
- Alerte automatique si seuil atteint

**Phase 2 : Notification Utilisateur**
- Email + Notification in-app
- Délai grâce : 7 jours
- Option rachat utilisateur :
  - Paiement montant dû + pénalité
  - Réduction LTV sous 80%

**Phase 3 : Notification Partenaires**
- Liste partenaires RWA notifiés
- Fonds interne BlockBank notifié
- Offre buyback avec discount

**Phase 4 : Buyback Automatique**
- Premier partenaire acceptant exécute
- Transaction on-chain :
  - Transfert NFT vers acheteur
  - Remboursement prêt depuis fonds
  - Solde restant vers utilisateur (si positif)

### Calcul Discount Buyback

**Discount selon Classe Risque NFT** :
```
SAFE: 10% discount
  Buyback Price = NFT Value × 0.90

MODERATE: 20% discount
  Buyback Price = NFT Value × 0.80

RISKY: 25% discount
  Buyback Price = NFT Value × 0.75
```

**Priorité Buyback** :
1. Fonds interne BlockBank (si disponible)
2. Partenaires RWA (ordre préférence)
3. Marketplace publique (dernier recours)

### Fonds Buyback

**Structure** :
- Pool réserves BlockBank
- Contributions primes assurance (10%)
- Contributions frais plateforme (5%)
- Objectif : 5% du volume total prêts

**Utilisation** :
- Remboursement prêts liquidés
- Garantie stabilité système
- Protection utilisateurs

---

## INTÉGRATIONS PARTENAIRES RWA

### Marketplaces Supportées

**RealT**
- Type : Immobilier tokenisé
- API : REST
- Assets : Propriétés immobilières US
- Intégration : Directe via API

**Tangibl**
- Type : Actifs réels divers
- API : REST + GraphQL
- Assets : Immobilier, Commodities
- Intégration : Directe via API

**Courtyard**
- Type : Actifs physiques tokenisés
- API : REST
- Assets : Objets de collection, métaux précieux
- Intégration : Directe via API

**4K**
- Type : Infrastructure
- API : REST
- Assets : Data centers, énergie
- Intégration : Directe via API

**Maple**
- Type : Prêts institutionnels
- API : REST
- Assets : Crédits tokenisés
- Intégration : Directe via API

**Backed Finance**
- Type : Actifs traditionnels tokenisés
- API : REST
- Assets : Actions, ETFs tokenisés
- Intégration : Directe via API

**Centrifuge**
- Type : Finance décentralisée RWA
- API : REST + Subgraph
- Assets : Factoring, prêts
- Intégration : Directe via API + Subgraph

**Landshare**
- Type : Immobilier tokenisé
- API : REST
- Assets : Propriétés immobilières
- Intégration : Directe via API

**21.co**
- Type : Bitcoin et crypto institutionnels
- API : REST
- Assets : BTC, ETH tokenisés
- Intégration : Directe via API

**Dibbs**
- Type : Actifs physiques tokenisés
- API : REST
- Assets : Cartes, objets collection
- Intégration : Directe via API

### Architecture Intégration

**Marketplace Aggregator** :
- Service centralisé agrégation
- Cache résultats (5 minutes)
- Normalisation données
- Filtrage et tri
- Pagination

**Sync NFT RWA** :
- Sync automatique toutes les 15 minutes
- Sync manuelle on-demand
- Détection nouveaux NFT
- Mise à jour valeurs
- Vérification disponibilité

---

## OPTIMISATIONS & RECOMMANDATIONS

### Optimisations Techniques

1. **Cache Aggressif**
   - Cache Credit Scores (1 heure)
   - Cache NFT RWA (5 minutes)
   - Cache conditions prêt (30 secondes)
   - Réduction appels API

2. **Batch Transactions**
   - Regrouper transactions multiples
   - Réduction coûts gas
   - Meilleure UX

3. **Lazy Loading**
   - Chargement progressif NFT
   - Images optimisées
   - Pagination efficace

4. **Oracle Optimisation**
   - Cache prix Chainlink (1 minute)
   - Fallback oracles multiples
   - Réduction appels on-chain

### Optimisations UX

1. **Onboarding Simplifié**
   - Étapes progressives
   - Explications claires
   - Aide contextuelle

2. **Feedback Temps Réel**
   - Notifications transactions
   - Statuts clairs
   - Progress indicators

3. **Comparaison Visuelle**
   - Graphiques 3 profils
   - Calculs interactifs
   - Scénarios what-if

4. **Mobile First**
   - Design responsive
   - PWA support
   - Wallet mobile intégré

### Optimisations Business

1. **Gamification**
   - Badges utilisateurs
   - Niveaux Credit Score
   - Récompenses fidélité

2. **Programme Référence**
   - Commission référents
   - Bonus nouveaux utilisateurs
   - Croissance organique

3. **Tiers Personnalisés**
   - Offres personnalisées
   - Recommandations NFT
   - Alertes opportunités

4. **Analytics Avancés**
   - Tracking comportement
   - A/B testing
   - Optimisation conversion

### Recommandations Sécurité

1. **Audit Smart Contracts**
   - Audit externe régulier
   - Bug bounty program
   - Tests exhaustifs

2. **Multi-Sig**
   - Admin multi-sig
   - Vault multi-sig
   - Sécurité fonds

3. **Insurance Protocol**
   - Assurance smart contracts
   - Coverage fonds utilisateurs
   - Protection risques

4. **Compliance**
   - KYC/AML selon juridiction
   - Reporting réglementaire
   - Transparence maximale

---

## CONCLUSION

Ce schéma complet définit l'architecture, le pipeline, l'UX, les modèles de données et les moteurs de BlockBank. Tous les composants sont conçus pour être :

- **Clairs** : Documentation exhaustive
- **Premium** : Design Apple-like, UX soignée
- **Exploitables** : Prêt pour implémentation production
- **Évolutifs** : Architecture modulaire et extensible

Le système est conçu pour évoluer avec l'écosystème RWA croissant et s'adapter aux nouvelles marketplaces et types d'actifs.

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Auteur** : BlockBank Architecture Team







