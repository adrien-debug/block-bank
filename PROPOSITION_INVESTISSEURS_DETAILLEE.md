# PROPOSITION DÉTAILLÉE : TAUX D'INTÉRÊT, FRAIS ET APR POUR INVESTISSEURS
## BlockBank - Protocole de Crédit On-Chain pour RWA

**Date:** Décembre 2024  
**Version:** 1.0  
**Auteur:** Analyse Stratégique BlockBank

---

## TABLE DES MATIÈRES

1. [Résumé Exécutif](#résumé-exécutif)
2. [Analyse du Marché](#analyse-du-marché)
3. [Structure des Taux d'Intérêt (APY)](#structure-des-taux-dintérêt-apy)
4. [Structure des Frais](#structure-des-frais)
5. [Calcul de l'APR Net](#calcul-de-lapr-net)
6. [Analyse des Marges](#analyse-des-marges)
7. [Scénarios de Performance](#scénarios-de-performance)
8. [Comparaison avec la Concurrence](#comparaison-avec-la-concurrence)
9. [Recommandations Stratégiques](#recommandations-stratégiques)
10. [Exemples Chiffrés](#exemples-chiffrés)
11. [Formules de Calcul](#formules-de-calcul)
12. [Annexes](#annexes)

---

## RÉSUMÉ EXÉCUTIF

### Proposition Globale

Cette proposition définit une structure optimale de rémunération pour les investisseurs du protocole BlockBank, équilibrant:
- **Attractivité** : Taux compétitifs supérieurs au marché
- **Viabilité** : Marges suffisantes pour le protocole
- **Diversité** : Profils de risque adaptés à différents investisseurs
- **Durabilité** : Modèle économique pérenne

### Points Clés

| Métrique | Valeur |
|----------|--------|
| **APY Moyen Pondéré** | 12.5% |
| **Spread Moyen Protocole** | 3.5% |
| **Marge Nette Protocole** | 2.8% |
| **Taux de Défaut Anticipé** | 2.0% |
| **ROI Investisseur Net** | 9.7% (après frais) |

---

## ANALYSE DU MARCHÉ

### Benchmarking Concurrents

#### Plateformes DeFi Traditionnelles

| Plateforme | APY Senior | APY Mezzanine | APY Junior | Commentaire |
|------------|------------|---------------|------------|-------------|
| **Aave** | 3.2% | N/A | N/A | Prêts over-collateralized |
| **Compound** | 2.8% | N/A | N/A | Modèle similaire à Aave |
| **Yearn Finance** | 5.5% | N/A | N/A | Vaults automatisés |
| **MakerDAO** | 4.2% | N/A | N/A | DAI Savings Rate |
| **BlockBank (Proposition)** | **8.0%** | **12.5%** | **18.5%** | **+2.5% à +14%** |

#### Plateformes RWA (Real World Assets)

| Plateforme | APY | Type | Commentaire |
|------------|-----|------|-------------|
| **Centrifuge** | 6-8% | RWA | Prêts garantis par actifs réels |
| **Goldfinch** | 8-12% | RWA | Prêts non garantis |
| **Maple Finance** | 9-11% | RWA | Prêts institutionnels |
| **BlockBank (Proposition)** | **8-20.5%** | **RWA NFT** | **Meilleure diversification** |

### Avantages Concurrentiels BlockBank

1. **Tranches Structurées** : Offre unique de 3 tranches (Senior/Mezzanine/Junior)
2. **Collatéralisation NFT RWA** : Actifs réels tokenisés, plus sécurisés
3. **Système d'Assurance** : Protection supplémentaire contre les défauts
4. **Credit Score Hybride** : Évaluation on-chain + off-chain plus précise
5. **Rendements Supérieurs** : +2% à +15% par rapport aux concurrents

---

## STRUCTURE DES TAUX D'INTÉRÊT (APY)

### Pool USDC (Principal)

#### Tranche Senior
- **APY Brut** : 8.0% (fixe)
- **APY Net** : 7.5% (après frais de gestion)
- **Profil Cible** : Qatar, institutions AAA, fonds souverains
- **Dépôt Minimum** : 10,000 USDC
- **Absorption Pertes** : 0% (protégée par tranches inférieures)
- **Risque** : Faible (probabilité de perte < 1%)

**Justification** :
- Taux supérieur de +2.5% vs Aave/Compound
- Protection totale par tranches junior/mezzanine
- Garantie de liquidité pour investissements > 100,000 USDC

#### Tranche Mezzanine
- **APY Brut** : 12.5% (variable selon performance)
- **APY Net** : 11.8% (après frais)
- **Profil Cible** : Investisseurs modérés, family offices, fonds
- **Dépôt Minimum** : 5,000 USDC
- **Absorption Pertes** : 20-25% (premières pertes après junior)
- **Risque** : Modéré (probabilité de perte 2-5%)

**Justification** :
- Équilibre risque/rendement optimal
- Protection partielle par tranche junior
- Rendement supérieur de +6% vs plateformes traditionnelles

#### Tranche Junior
- **APY Brut** : 18.5% (variable selon performance)
- **APY Net** : 17.5% (après frais)
- **Profil Cible** : LPs crypto, hedge funds, investisseurs expérimentés
- **Dépôt Minimum** : 1,000 USDC
- **Absorption Pertes** : 100% (premières pertes)
- **Risque** : Élevé (probabilité de perte 5-10%)

**Justification** :
- Rendement très attractif pour risque assumé
- Capture maximale des primes d'assurance
- Alignement avec attentes DeFi (15-25% APY)

### Pool USDT

#### Tranche Senior
- **APY Brut** : 8.5%
- **APY Net** : 8.0%
- **Justification** : Légèrement supérieur à USDC pour compenser risque de stabilité

#### Tranche Mezzanine
- **APY Brut** : 13.0%
- **APY Net** : 12.3%

#### Tranche Junior
- **APY Brut** : 20.0%
- **APY Net** : 19.0%

### Pool DAI

#### Tranche Senior
- **APY Brut** : 7.5%
- **APY Net** : 7.0%
- **Justification** : Légèrement inférieur car DAI plus stable et décentralisé

#### Tranche Mezzanine
- **APY Brut** : 11.8%
- **APY Net** : 11.1%

#### Tranche Junior
- **APY Brut** : 17.0%
- **APY Net** : 16.0%

### Tableau Récapitulatif APY

| Pool | Tranche | APY Brut | APY Net | Dépôt Min | Absorption |
|------|---------|----------|---------|-----------|------------|
| **USDC** | Senior | 8.0% | 7.5% | 10,000 | 0% |
| **USDC** | Mezzanine | 12.5% | 11.8% | 5,000 | 20% |
| **USDC** | Junior | 18.5% | 17.5% | 1,000 | 100% |
| **USDT** | Senior | 8.5% | 8.0% | 10,000 | 0% |
| **USDT** | Mezzanine | 13.0% | 12.3% | 5,000 | 25% |
| **USDT** | Junior | 20.0% | 19.0% | 1,000 | 100% |
| **DAI** | Senior | 7.5% | 7.0% | 10,000 | 0% |
| **DAI** | Mezzanine | 11.8% | 11.1% | 5,000 | 15% |
| **DAI** | Junior | 17.0% | 16.0% | 1,000 | 100% |

---

## STRUCTURE DES FRAIS

### Frais d'Entrée (Dépôt)

#### Frais de Dépôt
- **Taux** : 0% (GRATUIT)
- **Justification** : Attirer la liquidité, pas de barrière à l'entrée
- **Exception** : Frais de traitement optionnel de 0.1% (max 50 USDC) pour petits dépôts < 1,000 USDC

#### Frais de Traitement (Optionnel)
- **Taux** : 0.1% du montant déposé
- **Maximum** : 50 USDC/USDT/DAI
- **Applicable** : Uniquement pour dépôts < 1,000 USDC
- **Justification** : Couvrir les coûts de transaction pour petits montants

### Frais de Gestion

#### Frais de Gestion Annuel
- **Taux** : 0.5% du capital investi
- **Prélèvement** : Mensuel (0.0417% par mois)
- **Calcul** : `Capital × 0.5% / 12` par mois
- **Justification** : Couvrir les coûts opérationnels du protocole

**Exemple** :
- Investissement : 100,000 USDC
- Frais mensuel : 100,000 × 0.0417% = 41.70 USDC
- Frais annuel : 500 USDC

#### Frais de Performance
- **Taux** : 10% sur les rendements excédentaires
- **Base de Calcul** : Rendement réel - APY de base
- **Seuil** : Uniquement si rendement > APY promis
- **Justification** : Aligner les intérêts, récompenser la surperformance

**Exemple Tranche Mezzanine (12.5% APY base)** :
- Rendement réel : 15.0%
- Excédent : 15.0% - 12.5% = 2.5%
- Frais de performance : 2.5% × 10% = 0.25%
- Rendement net : 15.0% - 0.25% = 14.75%

### Frais de Sortie (Retrait)

#### Retrait à Maturité
- **Taux** : 0% (GRATUIT)
- **Condition** : Après période de lock ou à maturité
- **Justification** : Encourager les investissements à long terme

#### Retrait Avant Maturité
- **Taux** : 0.5% du montant retiré
- **Condition** : Retrait anticipé sans période de lock
- **Justification** : Décourager les retraits fréquents, stabiliser la liquidité

**Exemple** :
- Montant retiré : 50,000 USDC
- Frais : 50,000 × 0.5% = 250 USDC
- Montant reçu : 49,750 USDC

#### Retrait Anticipé (Période de Lock)
- **Taux** : 1.0% du montant retiré
- **Condition** : Retrait pendant période de verrouillage
- **Justification** : Pénalité pour engagement non respecté

**Exemple** :
- Montant verrouillé : 100,000 USDC
- Retrait anticipé : 100,000 × 1.0% = 1,000 USDC
- Montant reçu : 99,000 USDC

### Tableau Récapitulatif des Frais

| Type de Frais | Taux | Condition | Maximum |
|---------------|------|-----------|---------|
| **Dépôt** | 0% | Standard | - |
| **Traitement** | 0.1% | Dépôt < 1,000 | 50 USDC |
| **Gestion Annuel** | 0.5% | Tous | - |
| **Performance** | 10% | Rendement > APY base | - |
| **Retrait Maturité** | 0% | À maturité | - |
| **Retrait Anticipé** | 0.5% | Sans lock | - |
| **Retrait Lock** | 1.0% | Pendant lock | - |

---

## CALCUL DE L'APR NET

### Formule de Base

```
APR Net = APY Brut - Frais de Gestion - Frais de Performance - Frais de Sortie (si applicable)
```

### Calcul Détaillé

#### Composantes de l'APR Net

1. **APY Brut** : Taux annuel promis
2. **Frais de Gestion** : 0.5% annuel
3. **Frais de Performance** : 10% sur excédent (si applicable)
4. **Frais de Sortie** : 0% à maturité, 0.5-1.0% si anticipé

### Exemples de Calcul APR Net

#### Exemple 1 : Tranche Senior USDC (Scénario Normal)

**Données** :
- Investissement : 100,000 USDC
- APY Brut : 8.0%
- Rendement réel : 8.0% (pas d'excédent)
- Période : 12 mois
- Retrait : À maturité

**Calcul** :
```
Rendement brut annuel = 100,000 × 8.0% = 8,000 USDC
Frais de gestion = 100,000 × 0.5% = 500 USDC
Frais de performance = 0 USDC (pas d'excédent)
Frais de sortie = 0 USDC (maturité)

Rendement net = 8,000 - 500 = 7,500 USDC
APR Net = 7,500 / 100,000 = 7.5%
```

#### Exemple 2 : Tranche Mezzanine USDC (Surperformance)

**Données** :
- Investissement : 50,000 USDC
- APY Brut : 12.5%
- Rendement réel : 15.0% (surperformance)
- Période : 12 mois
- Retrait : À maturité

**Calcul** :
```
Rendement brut annuel = 50,000 × 15.0% = 7,500 USDC
Frais de gestion = 50,000 × 0.5% = 250 USDC
Excédent = 15.0% - 12.5% = 2.5%
Frais de performance = 50,000 × 2.5% × 10% = 125 USDC
Frais de sortie = 0 USDC

Rendement net = 7,500 - 250 - 125 = 7,125 USDC
APR Net = 7,125 / 50,000 = 14.25%
```

#### Exemple 3 : Tranche Junior USDT (Retrait Anticipé)

**Données** :
- Investissement : 25,000 USDT
- APY Brut : 20.0%
- Rendement réel : 20.0%
- Période : 6 mois (retrait anticipé)
- Retrait : Avant maturité (0.5% frais)

**Calcul** :
```
Rendement brut (6 mois) = 25,000 × 20.0% × (6/12) = 2,500 USDT
Frais de gestion (6 mois) = 25,000 × 0.5% × (6/12) = 62.5 USDT
Frais de performance = 0 USDT
Frais de sortie = 25,000 × 0.5% = 125 USDT

Rendement net = 2,500 - 62.5 - 125 = 2,312.5 USDT
APR Net (annualisé) = (2,312.5 / 25,000) × 2 = 18.5%
```

### Tableau APR Net par Tranche

| Pool | Tranche | APY Brut | APR Net (Normal) | APR Net (Surperformance) |
|------|---------|----------|-------------------|---------------------------|
| **USDC** | Senior | 8.0% | 7.5% | 7.5% |
| **USDC** | Mezzanine | 12.5% | 12.0% | 14.25% |
| **USDC** | Junior | 18.5% | 18.0% | 20.0% |
| **USDT** | Senior | 8.5% | 8.0% | 8.0% |
| **USDT** | Mezzanine | 13.0% | 12.5% | 14.75% |
| **USDT** | Junior | 20.0% | 19.5% | 21.5% |
| **DAI** | Senior | 7.5% | 7.0% | 7.0% |
| **DAI** | Mezzanine | 11.8% | 11.3% | 13.5% |
| **DAI** | Junior | 17.0% | 16.5% | 18.5% |

---

## ANALYSE DES MARGES

### Structure des Revenus du Protocole

#### 1. Spread Emprunteur/Investisseur

**Formule** : `Taux Emprunteur - Taux Investisseur`

**Exemples** :

| Credit Tier | Taux Emprunteur | Taux Investisseur (Senior) | Spread |
|-------------|-----------------|----------------------------|--------|
| **A+** | 6.0% | 8.0% | -2.0% |
| **A** | 6.5% | 8.0% | -1.5% |
| **B** | 8.5% | 8.0% | +0.5% |
| **C** | 10.5% | 8.0% | +2.5% |

**Note** : Les tranches A+/A peuvent avoir un spread négatif car financées par tranche Senior (Qatar) à taux préférentiel.

**Spread Moyen Pondéré** : +2.5%

#### 2. Frais de Gestion Investisseurs

**Revenu** : 0.5% du TVL (Total Value Locked)

**Exemple** :
- TVL Total : 11,500,000 USDC (tous pools)
- Revenu annuel : 11,500,000 × 0.5% = 57,500 USDC

#### 3. Frais de Performance

**Revenu** : 10% sur rendements excédentaires

**Exemple** :
- Excédent total : 500,000 USDC
- Revenu : 500,000 × 10% = 50,000 USDC

#### 4. Frais d'Assurance (Marge Protocole)

**Revenu** : 10-15% de la prime d'assurance

**Formule Assurance** :
```
Prime = PD × LGD × EAD × (1 + marge sécurité)
Marge Protocole = Prime × 10-15%
```

**Exemple** :
- Prime totale collectée : 500,000 USDC/an
- Marge protocole : 500,000 × 12.5% = 62,500 USDC

#### 5. Frais de Retrait

**Revenu** : 0.5-1.0% sur retraits anticipés

**Exemple** :
- Retraits anticipés : 2,000,000 USDC/an
- Revenu : 2,000,000 × 0.75% (moyenne) = 15,000 USDC

### Marge Nette du Protocole

#### Calcul Global

**Revenus Totaux** :
1. Spread : 2.5% × 8,000,000 (prêts actifs) = 200,000 USDC
2. Frais gestion : 57,500 USDC
3. Frais performance : 50,000 USDC
4. Marge assurance : 62,500 USDC
5. Frais retrait : 15,000 USDC

**Total Revenus** : 385,000 USDC/an

**Coûts** :
1. Coûts opérationnels : 100,000 USDC/an
2. Réserves défaut : 2.0% × 8,000,000 = 160,000 USDC
3. Marketing/Dev : 50,000 USDC/an

**Total Coûts** : 310,000 USDC/an

**Marge Nette** : 385,000 - 310,000 = **75,000 USDC/an (0.94% du TVL)**

### Tableau de Marge par Composante

| Composante | Revenu Annuel | % du Total |
|------------|---------------|------------|
| **Spread** | 200,000 USDC | 52% |
| **Frais Gestion** | 57,500 USDC | 15% |
| **Marge Assurance** | 62,500 USDC | 16% |
| **Frais Performance** | 50,000 USDC | 13% |
| **Frais Retrait** | 15,000 USDC | 4% |
| **TOTAL** | **385,000 USDC** | **100%** |

---

## SCÉNARIOS DE PERFORMANCE

### Scénario 1 : Normal (Base Case)

**Hypothèses** :
- Taux de défaut : 2.0%
- Taux de récupération : 60%
- Utilisation pools : 65%
- Rendements conformes aux APY promis

**Résultats par Tranche** :

| Tranche | APY Promis | APY Réel | Pertes | APR Net |
|---------|------------|----------|--------|---------|
| **Senior** | 8.0% | 8.0% | 0% | 7.5% |
| **Mezzanine** | 12.5% | 12.5% | 0% | 12.0% |
| **Junior** | 18.5% | 18.5% | 0% | 18.0% |

**Analyse** : Toutes les tranches atteignent leurs objectifs. Pas de pertes grâce à l'absorption par assurance.

### Scénario 2 : Stress (Défauts Élevés)

**Hypothèses** :
- Taux de défaut : 5.0%
- Taux de récupération : 50%
- Utilisation pools : 70%
- Rendements légèrement inférieurs

**Résultats par Tranche** :

| Tranche | APY Promis | APY Réel | Pertes | APR Net |
|---------|------------|----------|--------|---------|
| **Senior** | 8.0% | 7.8% | 0% | 7.3% |
| **Mezzanine** | 12.5% | 11.5% | 1.0% | 11.0% |
| **Junior** | 18.5% | 15.0% | 3.5% | 14.5% |

**Analyse** :
- Senior : Protégée, perte minime
- Mezzanine : Légère perte, mais reste positive
- Junior : Absorbe les pertes, mais reste rentable

### Scénario 3 : Extrême (Crise Systémique)

**Hypothèses** :
- Taux de défaut : 10.0%
- Taux de récupération : 40%
- Utilisation pools : 75%
- Rendements significativement impactés

**Résultats par Tranche** :

| Tranche | APY Promis | APY Réel | Pertes | APR Net |
|---------|------------|----------|--------|---------|
| **Senior** | 8.0% | 7.0% | 0% | 6.5% |
| **Mezzanine** | 12.5% | 8.0% | 4.5% | 7.5% |
| **Junior** | 18.5% | 5.0% | 13.5% | 4.0% |

**Analyse** :
- Senior : Protégée, rendement réduit mais positif
- Mezzanine : Perte significative mais capital préservé
- Junior : Perte importante, mais alignée avec profil risque/rendement

### Tableau Récapitulatif Scénarios

| Scénario | Senior APR | Mezzanine APR | Junior APR | Marge Protocole |
|----------|------------|---------------|-----------|-----------------|
| **Normal** | 7.5% | 12.0% | 18.0% | 0.94% |
| **Stress** | 7.3% | 11.0% | 14.5% | 0.65% |
| **Extrême** | 6.5% | 7.5% | 4.0% | 0.25% |

---

## COMPARAISON AVEC LA CONCURRENCE

### Analyse Comparative Détaillée

#### 1. Rendements

| Plateforme | Senior | Mezzanine | Junior | Avantage BlockBank |
|------------|--------|-----------|--------|-------------------|
| **Aave** | 3.2% | N/A | N/A | **+4.8%** |
| **Compound** | 2.8% | N/A | N/A | **+5.2%** |
| **Yearn** | 5.5% | N/A | N/A | **+2.5%** |
| **Centrifuge** | 6-8% | N/A | N/A | **+0-2%** |
| **Goldfinch** | 8-12% | N/A | N/A | **+0.5-4.5%** |
| **Maple** | 9-11% | N/A | N/A | **-1 à +1%** |
| **BlockBank** | **8.0%** | **12.5%** | **18.5%** | **Unique** |

#### 2. Frais

| Plateforme | Dépôt | Gestion | Performance | Retrait |
|------------|-------|---------|-------------|---------|
| **Aave** | 0% | 0% | 0% | 0% |
| **Compound** | 0% | 0% | 0% | 0% |
| **Yearn** | 0% | 2% | 20% | 0.5% |
| **BlockBank** | **0%** | **0.5%** | **10%** | **0-1%** |

**Analyse** : Frais BlockBank compétitifs, surtout avec rendements supérieurs.

#### 3. Sécurité

| Plateforme | Collatéral | Assurance | Credit Score |
|------------|------------|----------|--------------|
| **Aave** | Over-collateralized | Non | Non |
| **Compound** | Over-collateralized | Non | Non |
| **Centrifuge** | RWA | Partiel | Basique |
| **BlockBank** | **NFT RWA** | **Complet** | **Hybride** |

**Avantage** : BlockBank offre sécurité supérieure avec assurance et scoring avancé.

---

## RECOMMANDATIONS STRATÉGIQUES

### 1. Stratégie de Lancement

#### Phase 1 : Attraction Liquidité (Mois 1-3)
- **APY Bonus** : +1% sur toutes les tranches
- **Frais réduits** : 0% gestion pour 3 premiers mois
- **Minimum réduit** : 50% des minimums standards

#### Phase 2 : Stabilisation (Mois 4-6)
- **APY Bonus** : +0.5% sur tranches Mezzanine/Junior
- **Frais normaux** : Application progressive
- **Programme fidélité** : Lancement

#### Phase 3 : Croissance (Mois 7+)
- **APY standards** : Taux proposés dans ce document
- **Frais complets** : Structure finale
- **Optimisation** : Ajustements selon performance

### 2. Programmes d'Incentives

#### Bonus de Fidélité
- **+0.5% APY** après 12 mois d'investissement continu
- **+0.25% APY** après 6 mois
- **Justification** : Stabiliser la liquidité long terme

#### Bonus de Volume
- **+0.25% APY** pour investissements > 500,000 USDC
- **+0.5% APY** pour investissements > 1,000,000 USDC
- **Justification** : Attirer gros investisseurs institutionnels

#### Programme de Référence
- **+0.1% APY** pour chaque investisseur référé
- **Maximum** : +1.0% APY (10 références)
- **Justification** : Croissance organique

### 3. Conditions Spéciales Qatar

#### Tranche Senior Dédiée
- **APY Garanti** : 8.0% fixe, non variable
- **Liquidité Garantie** : Retrait sans frais à tout moment
- **Reporting Dédié** : Dashboard personnalisé
- **Minimum** : 1,000,000 USDC

#### Avantages Supplémentaires
- **Pas de frais** : Gestion, performance, retrait = 0%
- **Priorité** : Allocation prioritaire sur nouveaux prêts
- **Gouvernance** : Participation aux décisions protocole

### 4. Ajustements Dynamiques

#### Mécanisme d'Ajustement
- **Révision Trimestrielle** : Ajustement APY selon performance
- **Facteurs** :
  - Taux de défaut réel vs anticipé
  - Utilisation des pools
  - Conditions de marché
  - Performance concurrentielle

#### Formule d'Ajustement
```
APY Nouveau = APY Base × (1 + Ajustement)

Ajustement = f(Taux Défaut, Utilisation, Marché)
```

---

## EXEMPLES CHIFFRÉS

### Exemple 1 : Investisseur Institutionnel (Qatar)

**Profil** :
- Type : Institution AAA
- Montant : 5,000,000 USDC
- Tranche : Senior
- Durée : 24 mois
- Conditions : Spéciales Qatar

**Calcul** :
```
Investissement initial : 5,000,000 USDC
APY Brut : 8.0%
Frais gestion : 0% (spécial Qatar)
Frais performance : 0% (spécial Qatar)
Frais retrait : 0% (spécial Qatar)

Rendement annuel : 5,000,000 × 8.0% = 400,000 USDC
Rendement 24 mois : 400,000 × 2 = 800,000 USDC
Total à retrait : 5,800,000 USDC

ROI Net : 16.0% sur 24 mois
APR Net : 8.0%
```

### Exemple 2 : Investisseur Modéré (Family Office)

**Profil** :
- Type : Family Office
- Montant : 250,000 USDC
- Tranche : Mezzanine
- Durée : 12 mois
- Bonus : Fidélité (12 mois)

**Calcul** :
```
Investissement initial : 250,000 USDC
APY Brut : 12.5% + 0.5% (fidélité) = 13.0%
Frais gestion : 250,000 × 0.5% = 1,250 USDC
Frais performance : 0 USDC (pas d'excédent)
Frais retrait : 0 USDC (maturité)

Rendement brut : 250,000 × 13.0% = 32,500 USDC
Rendement net : 32,500 - 1,250 = 31,250 USDC
Total à retrait : 281,250 USDC

ROI Net : 12.5% sur 12 mois
APR Net : 12.5%
```

### Exemple 3 : Investisseur DeFi (LP Crypto)

**Profil** :
- Type : LP Crypto expérimenté
- Montant : 50,000 USDT
- Tranche : Junior
- Durée : 6 mois
- Rendement réel : 22.0% (surperformance)

**Calcul** :
```
Investissement initial : 50,000 USDT
APY Brut promis : 20.0%
APY Brut réel : 22.0%
Frais gestion (6 mois) : 50,000 × 0.5% × 0.5 = 125 USDT
Excédent : 22.0% - 20.0% = 2.0%
Frais performance : 50,000 × 2.0% × 10% = 100 USDT
Frais retrait : 0 USDT (maturité)

Rendement brut (6 mois) : 50,000 × 22.0% × 0.5 = 5,500 USDT
Rendement net : 5,500 - 125 - 100 = 5,275 USDT
Total à retrait : 55,275 USDT

ROI Net : 10.55% sur 6 mois
APR Net (annualisé) : 21.1%
```

### Exemple 4 : Investisseur Petit Montant (Retail)

**Profil** :
- Type : Investisseur retail
- Montant : 5,000 DAI
- Tranche : Junior
- Durée : 3 mois (retrait anticipé)
- Rendement réel : 17.0%

**Calcul** :
```
Investissement initial : 5,000 DAI
APY Brut : 17.0%
Frais gestion (3 mois) : 5,000 × 0.5% × 0.25 = 6.25 DAI
Frais performance : 0 DAI
Frais retrait anticipé : 5,000 × 0.5% = 25 DAI

Rendement brut (3 mois) : 5,000 × 17.0% × 0.25 = 212.5 DAI
Rendement net : 212.5 - 6.25 - 25 = 181.25 DAI
Total à retrait : 5,181.25 DAI

ROI Net : 3.625% sur 3 mois
APR Net (annualisé) : 14.5%
```

---

## FORMULES DE CALCUL

### 1. Calcul APY Brut

```
APY Brut = (Rendement Total / Capital Initial) × (365 / Jours) × 100
```

### 2. Calcul APR Net

```
APR Net = APY Brut - Frais Gestion - Frais Performance - Frais Sortie
```

Où :
- **Frais Gestion** = Capital × 0.5% × (Jours / 365)
- **Frais Performance** = Capital × (Rendement Réel - APY Base) × 10% (si > 0)
- **Frais Sortie** = Capital × Taux Retrait (si applicable)

### 3. Calcul Rendement Net

```
Rendement Net = Rendement Brut - Tous Frais
```

### 4. Calcul ROI

```
ROI = (Valeur Finale - Valeur Initiale) / Valeur Initiale × 100
```

### 5. Calcul Marge Protocole

```
Marge Protocole = Spread + Frais Gestion + Marge Assurance + Frais Performance + Frais Retrait - Coûts
```

### 6. Calcul Prime Assurance

```
Prime = PD × LGD × EAD × (1 + Marge Sécurité)
Marge Protocole = Prime × 10-15%
```

Où :
- **PD** = Probabilité de Défaut
- **LGD** = Perte en Cas de Défaut
- **EAD** = Exposition à Défaut

---

## ANNEXES

### Annexe A : Glossaire

- **APY** : Annual Percentage Yield (Taux de Rendement Annuel)
- **APR** : Annual Percentage Rate (Taux Annuel Effectif)
- **TVL** : Total Value Locked (Valeur Totale Verrouillée)
- **LTV** : Loan-to-Value (Ratio Prêt/Valeur)
- **PD** : Probability of Default (Probabilité de Défaut)
- **LGD** : Loss Given Default (Perte en Cas de Défaut)
- **EAD** : Exposure at Default (Exposition à Défaut)
- **ROI** : Return on Investment (Retour sur Investissement)

### Annexe B : Références Marché

1. **Aave** : https://aave.com
2. **Compound** : https://compound.finance
3. **Yearn Finance** : https://yearn.finance
4. **Centrifuge** : https://centrifuge.io
5. **Goldfinch** : https://goldfinch.finance
6. **Maple Finance** : https://maple.finance

### Annexe C : Contacts

Pour questions ou clarifications sur cette proposition :
- **Email** : strategy@blockbank.io
- **Documentation** : docs.blockbank.io
- **Support** : support@blockbank.io

---

## CONCLUSION

Cette proposition établit une structure optimale de rémunération pour les investisseurs BlockBank, offrant :

✅ **Rendements compétitifs** : +2% à +15% vs marché  
✅ **Sécurité renforcée** : Assurance + Scoring hybride  
✅ **Flexibilité** : 3 tranches adaptées à tous profils  
✅ **Viabilité** : Marges suffisantes pour pérennité protocole  
✅ **Transparence** : Calculs clairs et justifiés  

**Prochaine Étape** : Validation par l'équipe et mise en œuvre progressive selon stratégie de lancement.

---

**Document préparé par** : Équipe Stratégie BlockBank  
**Date** : Décembre 2024  
**Version** : 1.0  
**Statut** : Proposition Finale


