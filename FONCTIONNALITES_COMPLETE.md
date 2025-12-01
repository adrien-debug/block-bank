# 📋 FONCTIONNALITÉS COMPLÈTES - BLOCK BANK

**Date :** 1 Décembre 2025  
**Application :** Block Bank - Infrastructure de crédit on-chain  
**Version :** 1.0

---

## 🏠 PAGES PRINCIPALES

### 1. **Page d'accueil (Landing Page)**
**Fichier :** `components/Landing.tsx`  
**Route :** `/` (affichée quand wallet non connecté)

**Contenu :**
- Titre principal : "Infrastructure de crédit on-chain pour actifs réels & mining Bitcoin"
- Description du protocole
- 3 cartes de fonctionnalités :
  - Credit Score (avec icône ChartIcon)
  - NFT RWA (avec icône NFTAssetIcon)
  - Assurance (avec icône ShieldIcon)
- Message CTA : "Connectez votre wallet pour commencer"

**Actions :**
- Aucune action directe (affichage uniquement)
- L'utilisateur doit se connecter via le header pour accéder au dashboard

---

### 2. **Dashboard Principal**
**Fichier :** `components/Dashboard.tsx`  
**Route :** `/` (affichée quand wallet connecté)

**Structure :**
- **Sidebar gauche (200px)** :
  - Header : "Block Bank" + adresse wallet tronquée
  - Navigation avec 6 onglets :
    1. Dashboard (icône DashboardIcon)
    2. Credit Score (icône StarIcon)
    3. Mes Prêts (icône MoneyIcon)
    4. NFT RWA (icône NFTIcon)
    5. Assurance (icône ShieldIcon)
    6. Profil (icône UserIcon)

- **Zone de contenu principale** : Affiche le contenu selon l'onglet actif

**Onglet Dashboard (vue par défaut) :**
- Titre : "Tableau de bord"
- 4 cartes statistiques :
  1. **Credit Score** : 750 + badge "Tranche A"
  2. **Prêts actifs** : 2 prêts + "150,000 USDC"
  3. **NFT RWA** : 3 NFT + "Valeur: 500,000 USDC"
  4. **Assurance** : "Actif" + "Couverture: 80%"

**Actions :**
- ✅ Navigation entre onglets (changement d'état `activeTab`)
- ✅ Affichage conditionnel du contenu selon l'onglet sélectionné

---

## 📊 PAGES DU DASHBOARD

### 3. **Page Credit Score**
**Fichier :** `components/dashboard/CreditScore.tsx`  
**Onglet :** "Credit Score"

**Contenu :**
- **Titre :** "Mon Credit Score"
- **Affichage du score :**
  - Cercle avec score : **750**
  - Tranche : **A**
  - Badge "Tranche A"
  - Description : "Votre score vous permet d'accéder à des conditions de prêt favorables avec un LTV maximum de 60-70% et des taux compétitifs."

- **Détail du score (4 composants) :**
  1. **On-Chain Behavioral** : 280/300
  2. **Off-Chain Financial** : 250/300
  3. **Asset-Based** : 150/200
  4. **Reputation & Trust** : 70/100
  - Chaque composant affiche une barre de progression

**Boutons :**
1. ✅ **"Mettre à jour mon score"** (btn-primary)
   - **Action actuelle :** Aucune (bouton non fonctionnel)
   - **Action attendue :** Déclencher une mise à jour du score

2. ✅ **"Voir l'historique"** (btn-secondary)
   - **Action actuelle :** Aucune (bouton non fonctionnel)
   - **Action attendue :** Afficher l'historique des scores

---

### 4. **Page Mes Prêts**
**Fichier :** `components/dashboard/Loans.tsx`  
**Onglet :** "Mes Prêts"

**Contenu :**
- **Header :**
  - Titre : "Mes Prêts"
  - Bouton : **"+ Nouveau prêt"** (btn-primary)

**Liste des prêts actifs (2 prêts) :**

**Prêt #1 :**
- Montant : 100,000 USDC
- Actif : Villa Paris - NFT #1234
- LTV : 65%
- Taux : 8.5%
- Durée : 36 mois
- Statut : active
- Prochain paiement : 15,000 USDC
- Échéance : 2024-02-15
- Bouton : **"Payer maintenant"** (btn-pay)

**Prêt #2 :**
- Montant : 50,000 USDC
- Actif : Mining Farm - NFT #5678
- LTV : 55%
- Taux : 9.2%
- Durée : 24 mois
- Statut : active
- Prochain paiement : 7,500 USDC
- Échéance : 2024-02-20
- Bouton : **"Payer maintenant"** (btn-pay)

**Modal "Nouveau prêt" :**
- **Déclencheur :** Bouton "+ Nouveau prêt"
- **Formulaire :**
  - Montant demandé (input number) + sélecteur devise (USDC/USDT/DAI)
  - Actif à nantir (select avec options NFT RWA)
  - Durée (select : 12/24/36/48 mois)
- **Boutons :**
  1. ✅ **"Annuler"** (btn-secondary)
     - **Action :** Ferme la modal (`setShowNewLoan(false)`)
  2. ⚠️ **"Soumettre la demande"** (btn-primary)
     - **Action actuelle :** Aucune (formulaire non soumis)
     - **Action attendue :** Soumettre la demande de prêt

**Actions :**
- ✅ Ouvrir/fermer modal nouveau prêt
- ⚠️ Soumettre demande de prêt (non implémenté)
- ⚠️ Payer un prêt (bouton "Payer maintenant" non fonctionnel)

---

### 5. **Page NFT RWA**
**Fichier :** `components/dashboard/NFTAssets.tsx`  
**Onglet :** "NFT RWA"

**Contenu :**
- **Header :**
  - Titre : "Mes NFT RWA"
  - Bouton : **"+ Tokeniser un actif"** (btn-primary)

**Grille de NFT (3 NFT) :**

**NFT #1 - Villa Paris :**
- Type : Immobilier
- Token ID : #1234
- Valeur : 300,000 USDC
- Statut : 🔒 Verrouillé (utilisé dans Prêt #1)
- Boutons : **"Détails"** (btn-secondary, disabled)

**NFT #2 - Mining Farm :**
- Type : Mining
- Token ID : #5678
- Valeur : 150,000 USDC
- Statut : 🔒 Verrouillé (utilisé dans Prêt #2)
- Boutons : **"Détails"** (btn-secondary, disabled)

**NFT #3 - Data Center :**
- Type : Infrastructure
- Token ID : #9012
- Valeur : 500,000 USDC
- Statut : ✅ Disponible
- Boutons :
  1. **"Voir détails"** (btn-secondary)
  2. **"Utiliser pour prêt"** (btn-primary)

**Actions :**
- ⚠️ Tokeniser un actif (bouton "+ Tokeniser un actif" non fonctionnel)
- ⚠️ Voir détails d'un NFT (bouton "Voir détails" non fonctionnel)
- ⚠️ Utiliser NFT pour prêt (bouton "Utiliser pour prêt" non fonctionnel)

---

### 6. **Page Assurance**
**Fichier :** `components/dashboard/Insurance.tsx`  
**Onglet :** "Assurance"

**Contenu :**
- **Titre :** "Mes Assurances"

**Résumé (2 cartes) :**
1. **Couverture totale :** 155% de la valeur des prêts
2. **Prime annuelle :** 3,600 USDC (répartie sur 2 polices)

**Polices actives (2 polices) :**

**Police #1 :**
- Prêt : Prêt #1
- Statut : Actif
- Couverture : 80%
- Prime annuelle : 2,400 USDC
- Risques couverts :
  - Badge "Défaut emprunteur"
  - Badge "Risque marché"
- Boutons :
  1. **"Voir les détails"** (btn-secondary)
  2. **"Renouveler"** (btn-primary)

**Police #2 :**
- Prêt : Prêt #2
- Statut : Actif
- Couverture : 75%
- Prime annuelle : 1,200 USDC
- Risques couverts :
  - Badge "Défaut emprunteur"
- Boutons :
  1. **"Voir les détails"** (btn-secondary)
  2. **"Renouveler"** (btn-primary)

**Actions :**
- ⚠️ Voir détails d'une police (bouton "Voir les détails" non fonctionnel)
- ⚠️ Renouveler une police (bouton "Renouveler" non fonctionnel)

---

### 7. **Page Profil**
**Fichier :** `components/dashboard/Profile.tsx`  
**Onglet :** "Profil"

**Contenu :**
- **Titre :** "Mon Profil"

**Section 1 : Informations Wallet**
- Adresse : Formatée (ex: 0x1234...5678)
- Réseau : Ethereum Mainnet

**Section 2 : Informations KYC**
- Badge : "✓ Vérifié"
- Description : "Votre identité a été vérifiée et validée"
- Bouton : **"Mettre à jour"** (btn-secondary)

**Section 3 : Paramètres**
- **Notifications par email** : Checkbox (checked par défaut)
- **Notifications push** : Checkbox (unchecked)
- **Mode sombre** : Checkbox (checked par défaut)

**Actions :**
- ⚠️ Mettre à jour KYC (bouton "Mettre à jour" non fonctionnel)
- ⚠️ Modifier paramètres (checkboxes non fonctionnels)

---

## 🔌 COMPOSANT WALLET CONNECTION

### 8. **WalletConnect Component**
**Fichier :** `components/WalletConnect.tsx`  
**Emplacement :** Header (toujours visible)

**États :**

**État 1 : Wallet non connecté**
- Bouton : **"Connecter Wallet"** (btn-connect-wallet)
- **Action :**
  - Vérifie si MetaMask est installé
  - Demande la connexion via `eth_requestAccounts`
  - Met à jour l'état `address`
  - Affiche "Connexion..." pendant le processus

**État 2 : Wallet connecté**
- Affichage : Icône wallet + adresse formatée (ex: 0x1234...5678)
- Bouton : **"Déconnecter"** (btn-disconnect)
- **Action :**
  - Réinitialise l'état `address` à `null`
  - Déconnecte le wallet

**Fonctionnalités :**
- ✅ Détection automatique de la connexion au chargement
- ✅ Écoute des changements de compte MetaMask
- ✅ Gestion des erreurs de connexion
- ✅ Formatage de l'adresse (fonction `formatAddress`)

---

## 🎯 RÉCAPITULATIF DES ACTIONS

### ✅ Actions Fonctionnelles (Implémentées)

1. **Connexion Wallet**
   - Bouton "Connecter Wallet" dans le header
   - Connexion MetaMask fonctionnelle
   - Détection automatique de la connexion

2. **Déconnexion Wallet**
   - Bouton "Déconnecter" dans le header
   - Déconnexion fonctionnelle

3. **Navigation Dashboard**
   - 6 onglets de navigation fonctionnels
   - Changement de vue selon l'onglet sélectionné

4. **Modal Nouveau Prêt**
   - Ouverture/fermeture de la modal
   - Bouton "Annuler" fonctionnel

---

### ⚠️ Actions Non Fonctionnelles (À Implémenter)

1. **Credit Score**
   - "Mettre à jour mon score" → Appel API/blockchain
   - "Voir l'historique" → Affichage historique

2. **Prêts**
   - "Soumettre la demande" → Création de prêt on-chain
   - "Payer maintenant" → Paiement de prêt

3. **NFT RWA**
   - "+ Tokeniser un actif" → Processus de tokenisation
   - "Voir détails" → Modal avec détails NFT
   - "Utiliser pour prêt" → Lier NFT à un prêt

4. **Assurance**
   - "Voir les détails" → Modal avec détails police
   - "Renouveler" → Renouvellement de police

5. **Profil**
   - "Mettre à jour" KYC → Processus KYC
   - Checkboxes paramètres → Sauvegarde préférences

---

## 🔗 FLUX DE NAVIGATION

```
┌─────────────────────────────────────────┐
│         LANDING PAGE (non connecté)      │
│  └─> Connecter Wallet (header)          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         DASHBOARD (connecté)            │
│                                         │
│  Sidebar Navigation:                    │
│  ├─ Dashboard (vue par défaut)         │
│  ├─ Credit Score                       │
│  ├─ Mes Prêts                          │
│  │   └─> + Nouveau prêt                │
│  │       └─> Modal formulaire          │
│  ├─ NFT RWA                            │
│  │   └─> + Tokeniser un actif          │
│  │   └─> Voir détails / Utiliser       │
│  ├─ Assurance                           │
│  │   └─> Voir détails / Renouveler     │
│  └─ Profil                              │
│      └─> Mettre à jour KYC             │
└─────────────────────────────────────────┘
```

---

## 📝 NOTES IMPORTANTES

### Données Mockées
- Tous les prêts, NFT, assurances sont des données statiques (hardcodées)
- Aucune connexion à une blockchain ou API backend
- Les scores et statistiques sont fixes

### État de l'Application
- **Frontend :** ✅ Complet et fonctionnel
- **Backend/Blockchain :** ⚠️ Non connecté
- **Actions utilisateur :** ⚠️ Majoritairement non fonctionnelles

### Prochaines Étapes Recommandées
1. Implémenter les appels blockchain pour les actions critiques
2. Connecter les formulaires à des smart contracts
3. Ajouter la gestion d'état globale (Context/Redux)
4. Implémenter les modals de détails
5. Ajouter la validation des formulaires
6. Implémenter la sauvegarde des préférences utilisateur

---

**Dernière mise à jour :** 1 Décembre 2025  
**Statut :** Documentation complète des fonctionnalités actuelles

