# DOCUMENTATION JURIDIQUE COMPLÈTE - BLOCKBANK

**Version :** 1.0  
**Date :** Décembre 2024  
**Statut :** Documentation Complète A à Z

---

## 📚 DOCUMENTS DISPONIBLES

### 1. Cadre Juridique Principal

**📄 [LEGAL_FRAMEWORK.md](./LEGAL_FRAMEWORK.md)**

Document complet couvrant :
- Analyse des codes civils par juridiction (Qatar, France, États-Unis, Émirats Arabes Unis, Suisse, Singapour)
- Architecture légale SPV et titre de propriété
- Processus de récupération par type d'actif
- Système de remises NFT RWA (10%, 15%, 20%)
- Termes et conditions généraux
- Partenaires NFT RWA et assurances

---

### 2. Termes et Conditions par Type d'Actif

#### Immobilier

**📄 [TERMS_IMMOBILIER.md](./TERMS_IMMOBILIER.md)**

Couvre :
- Appartements, villas, bureaux, terrains
- Processus d'obtention du titre de propriété
- Conditions de prêt spécifiques
- Processus d'expulsion par juridiction
- Délais et coûts de récupération

**Délais de récupération :**
- Qatar : 60-90 jours
- France : 6-12 mois
- États-Unis : 90-180 jours

---

#### Véhicules

**📄 [TERMS_VEHICULES.md](./TERMS_VEHICULES.md)**

Couvre :
- Voitures, camions, équipements mobiles
- Processus de repossession
- Localisation GPS
- Vente aux enchères

**Délais de récupération :**
- Toutes juridictions : 15-45 jours

---

#### Objets et Biens Meubles

**📄 [TERMS_OBJETS.md](./TERMS_OBJETS.md)**

Couvre :
- Mining equipment
- Machines industrielles
- Objets de collection
- Métaux précieux

**Délais de récupération :**
- Toutes juridictions : 20-40 jours

---

### 3. Partenaires

**📄 [PARTENAIRES_NFT_RWA.md](./PARTENAIRES_NFT_RWA.md)**

Documentation complète des :
- 10 partenaires NFT RWA (RealT, Tangibl, Courtyard, 4K, Maple, Backed Finance, Centrifuge, Landshare, 21.co, Dibbs)
- Partenaires assurance (Qatar Insurance Group, AXA, Allianz, Nexus Mutual, Cover Protocol, Risk Pool BlockBank)
- Conditions d'intégration
- Processus de récupération par partenaire

---

## 🎯 SYSTÈME DE REMISES NFT RWA

### Niveaux de Remise

| Remise | Conditions | Avantages |
|--------|------------|-----------|
| **10%** | Tous NFT éligibles | LTV - 10% |
| **15%** | NFT SAFE/MODERATE + Credit Tier A/B/C | LTV - 15%, Taux - 0.25% APY, Assurance - 5% |
| **20%** | NFT SAFE + Credit Tier A/B | LTV - 20%, Taux - 0.5% APY, Assurance - 10% |

### Calcul du Paiement Minimum

```
Paiement Minimum = Valeur NFT × Taux Remise

Exemple :
- NFT Valeur : 100,000 USDC
- Remise 15% : Paiement minimum = 15,000 USDC
- Montant prêt : 85,000 USDC (LTV 85%)
```

---

## 📋 PROCESSUS DE RÉCUPÉRATION PAR TYPE D'ACTIF

### Immobilier

**Phase 1 : Obtention du Titre**
- Documents : Acte de vente, certificat de propriété, plan cadastral
- Délai : 30-90 jours

**Phase 2 : Période de Prêt**
- Obligations : Paiement mensuel, maintenance, assurance
- Droits : Vérification, inspection

**Phase 3 : Défaut et Récupération**
- Déclenchement : Retard > 30 jours
- Notification : 15-30 jours selon juridiction
- Expulsion : 30-90 jours après jugement

**Phase 4 : Expulsion**
- Procédure : Notification → Délai grâce → Intervention huissier → Délogement
- Coûts : 2,000-10,000 USD selon juridiction

---

### Véhicules

**Phase 1 : Obtention du Titre**
- Documents : Certificat de propriété, carte grise
- Délai : 7-15 jours

**Phase 2 : Période de Prêt**
- Obligations : Paiement, maintenance, assurance, localisation GPS

**Phase 3 : Défaut et Repossession**
- Déclenchement : Retard > 30 jours
- Notification : 8-15 jours
- Repossession : Avec ou sans ordre judiciaire (selon juridiction)

**Phase 4 : Récupération Physique**
- Méthodes : Repossession volontaire, saisie sur place, ordre judiciaire
- Coûts : 500-2,500 USD

---

### Objets et Biens Meubles

**Phase 1 : Identification et Titre**
- Documents : Facture d'achat, certificat d'authenticité, inventaire
- Délai : 1-7 jours

**Phase 2 : Période de Prêt**
- Obligations : Paiement, maintenance, stockage sécurisé

**Phase 3 : Défaut et Saisie**
- Déclenchement : Retard > 30 jours
- Notification : 5-10 jours
- Saisie : Remise volontaire ou saisie sur place

**Phase 4 : Récupération Physique**
- Méthodes : Remise volontaire, saisie, transport et stockage
- Coûts : 200-1,000 USD

---

## 💼 INTÉGRATION DANS L'APPLICATION

### Composants Créés

1. **TermsAndConditions.tsx**
   - Composant modal pour afficher et accepter les T&C
   - Intégré dans le processus de validation de prêt
   - Affichage conditionnel selon type d'actif

2. **nftDiscountCalculator.ts**
   - Service de calcul des remises NFT RWA
   - Calcul du paiement minimum
   - Calcul des avantages (réduction taux, prime assurance)

### Fichiers Modifiés

1. **LoanValidation.tsx**
   - Intégration du composant TermsAndConditions
   - Modal pour accepter les T&C avant confirmation

2. **globals.css**
   - Styles pour le composant TermsAndConditions
   - Styles pour les modals et boutons

---

## 📊 TABLEAUX RÉCAPITULATIFS

### Délais de Récupération par Type d'Actif

| Type d'Actif | Juridiction | Délai Obtention Titre | Délai Récupération | Délai Total |
|--------------|-------------|----------------------|-------------------|-------------|
| Immobilier | Qatar | 30-60 jours | 60-90 jours | 90-150 jours |
| Immobilier | France | 60-90 jours | 6-12 mois | 7-13 mois |
| Immobilier | États-Unis | 30-60 jours | 90-180 jours | 120-240 jours |
| Véhicule | Toutes | 7-15 jours | 15-45 jours | 22-60 jours |
| Objets | Toutes | 1-7 jours | 20-40 jours | 21-47 jours |
| Infrastructure | Multi | 60-180 jours | 90-180 jours | 150-360 jours |

### Coûts de Récupération

| Type d'Actif | Frais Minimum | Frais Maximum | Frais Moyens |
|--------------|---------------|---------------|--------------|
| Immobilier | 2,000 USD | 10,000 USD | 5,000 USD |
| Véhicule | 500 USD | 2,500 USD | 1,200 USD |
| Objets | 200 USD | 1,000 USD | 500 USD |
| Infrastructure | 5,000 USD | 50,000 USD | 20,000 USD |

---

## 🔗 LIENS RAPIDES

- [Cadre Juridique Complet](./LEGAL_FRAMEWORK.md)
- [T&C Immobilier](./TERMS_IMMOBILIER.md)
- [T&C Véhicules](./TERMS_VEHICULES.md)
- [T&C Objets](./TERMS_OBJETS.md)
- [Partenaires NFT RWA et Assurances](./PARTENAIRES_NFT_RWA.md)

---

## ✅ STATUT DE LA DOCUMENTATION

- ✅ Documentation juridique complète créée
- ✅ T&C spécifiques par type d'actif créés
- ✅ Système de remises NFT RWA implémenté
- ✅ Composants d'intégration créés
- ✅ Documentation des partenaires complétée
- ✅ Styles CSS ajoutés
- ✅ Intégration dans l'application terminée

---

**Document préparé par :** Équipe Juridique et Technique BlockBank  
**Dernière mise à jour :** Décembre 2024  
**Version :** 1.0





