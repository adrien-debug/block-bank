# PROMPT COMPLET POUR RESTYLING DE TOUTES LES PAGES - BLOCKBANK

## 🎯 OBJECTIF PRINCIPAL

Tu dois restyler COMPLÈTEMENT toutes les pages de l'application BlockBank du début à la fin, sans t'arrêter, en appliquant un design premium cohérent basé sur les design tokens existants. Chaque page doit avoir un style graphique moderne, professionnel et premium.

---

## 📋 STRUCTURE DU PROJET

### Pages principales à styliser (dans l'ordre) :

1. **Page Landing** (`app/page.tsx` + `components/Landing.tsx`)
   - Route : `/`
   - Affichée quand wallet non connecté
   - Hero section avec titre, description, 3 cartes de fonctionnalités, CTA

2. **Dashboard Principal** (`app/dashboard/page.tsx`)
   - Route : `/dashboard`
   - Vue d'ensemble avec stats, graphiques (bar chart + donut chart), activité récente, alertes

3. **Page Explore** (`app/dashboard/explore/page.tsx` + `components/dashboard/Explore.tsx`)
   - Route : `/dashboard/explore`
   - Exploration de fonctionnalités et services

4. **Page Credit Score** (`app/dashboard/credit-score/page.tsx` + `components/dashboard/CreditScore.tsx`)
   - Route : `/dashboard/credit-score`
   - Vue détaillée du credit score avec onglets (overview, breakdown, recommendations, history, tokenisation, governance, tiers)

5. **Page My Loans** (`app/dashboard/loans/page.tsx` + `components/dashboard/Loans.tsx`)
   - Route : `/dashboard/loans`
   - Liste des prêts avec filtres, détails, historique de paiements

6. **Page NFT RWA** (`app/dashboard/nft/page.tsx` + `components/dashboard/NFTAssets.tsx`)
   - Route : `/dashboard/nft`
   - Gestion des NFT RWA avec onglets (my-nfts, marketplace, tokenization, analytics)

7. **Page Insurance** (`app/dashboard/insurance/page.tsx` + `components/dashboard/Insurance.tsx`)
   - Route : `/dashboard/insurance`
   - Gestion des assurances paramétriques

8. **Page Investor** (`app/dashboard/investor/page.tsx` + `components/dashboard/Investor.tsx`)
   - Route : `/dashboard/investor`
   - Interface investisseur

9. **Page Profile** (`app/dashboard/profile/page.tsx` + `components/dashboard/Profile.tsx`)
   - Route : `/dashboard/profile`
   - Profil utilisateur

10. **Page Terms & Conditions** (`app/dashboard/terms/page.tsx` + `components/dashboard/TermsAndConditions.tsx`)
    - Route : `/dashboard/terms`
    - Conditions générales

### Composants partagés à styliser :

- `components/ui/Sidebar.tsx` - Sidebar de navigation
- `components/ui/StatCard.tsx` - Cartes de statistiques
- `components/ui/Card.tsx` - Cartes génériques
- `components/ui/Button.tsx` - Boutons
- `components/ui/Badge.tsx` - Badges
- `components/WalletConnect.tsx` - Connexion wallet
- `components/dashboard/ActivityFeed.tsx` - Flux d'activité
- `components/dashboard/AlertsPanel.tsx` - Panneau d'alertes
- Tous les autres composants dans `components/dashboard/`

---

## 🎨 DESIGN TOKENS & PALETTE DE COULEURS

### Couleurs principales (à utiliser partout) :

```css
/* PRIMARY BLUE SYSTEM */
--bb-blue-deep: #0F172A
--bb-blue: #1E3A8A
--bb-blue-medium: #2563EB
--bb-blue-light: #3B82F6
--bb-blue-lighter: #60A5FA
--bb-blue-dark: #1E40AF
--bb-blue-darker: #1D4ED8

/* GREY SYSTEM */
--bb-grey-50: #FFFFFF
--bb-grey-100: #F8FAFC
--bb-grey-200: #F1F5F9
--bb-grey-300: #E2E8F0
--bb-grey-400: #CBD5E1
--bb-grey-500: #94A3B8
--bb-grey-600: #64748B
--bb-grey-700: #475569
--bb-grey-800: #334155
--bb-grey-850: #1E293B
--bb-grey-900: #0F172A
--bb-grey-950: #030712

/* GRADIENTS PREMIUM */
--bb-gradient-primary: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)
--bb-gradient-deep: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)
--bb-gradient-button: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #3B82F6 100%)
--bb-gradient-card: linear-gradient(145deg, rgba(15, 23, 42, 0.03) 0%, rgba(30, 58, 138, 0.02) 50%, rgba(241, 245, 249, 0.4) 100%)
--bb-gradient-soft: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)
```

### Ombres premium :

```css
--shadow-card: 0 4px 24px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)
--shadow-card-hover: 0 12px 48px rgba(15, 23, 42, 0.12), 0 6px 24px rgba(30, 58, 138, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)
--shadow-cta: 0 8px 24px rgba(37, 99, 235, 0.3), 0 4px 12px rgba(107, 114, 128, 0.2)
--shadow-glow: 0 0 30px rgba(37, 99, 235, 0.2), 0 0 60px rgba(107, 114, 128, 0.15)
```

### Typographie :

```css
/* Fonts */
--font-title: "SF Pro Display", -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif
--font-body: "SF Pro Text", -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif

/* Sizes */
h1: 48px (64px large), weight 700, line-height 1.1
h2: 32px (40px large), weight 600, line-height 1.2
h3: 24px (28px large), weight 500, line-height 1.3
body: 16px (18px large), weight 400, line-height 1.5
```

### Espacements :

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Border radius :

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 20px
--radius-xl: 24px
--radius-2xl: 32px
```

---

## 🎯 RÈGLES DE STYLE PREMIUM À APPLIQUER

### 1. **Cartes (Cards)**
- Fond blanc avec bordure subtile : `border: 1px solid rgba(37, 99, 235, 0.1)`
- Border radius : `24px` (grandes cartes) ou `12px` (petites cartes)
- Ombre : `var(--shadow-card)`
- Padding : `32px` (grandes) ou `24px` (petites)
- Hover : `var(--shadow-card-hover)` + légère élévation
- Transition : `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### 2. **Boutons**
- Primary : Gradient bleu (`var(--bb-gradient-button)`) avec ombre CTA
- Border radius : `12px`
- Padding : `12px 24px` (standard) ou `16px 32px` (large)
- Hover : Légère élévation + glow effect
- Transition : `all 0.3s ease`

### 3. **Badges**
- Fond : Gradient bleu ou gris selon le contexte
- Border radius : `8px` ou `12px`
- Padding : `4px 12px`
- Font size : `12px` ou `14px`
- Font weight : `600`

### 4. **Graphiques**
- Fond : Blanc avec bordure subtile
- Animations : Fade-in progressif avec délais
- Couleurs : Palette bleue avec dégradés
- Tooltips : Style premium avec ombre et animation

### 5. **Inputs / Formulaires**
- Border : `1px solid var(--bb-grey-300)`
- Border radius : `12px`
- Padding : `12px 16px`
- Focus : Border bleu + ring glow
- Background : Blanc

### 6. **Tables**
- Header : Fond `var(--bb-grey-100)` avec texte `var(--bb-grey-700)`
- Rows : Alternance subtile de fonds
- Hover : Fond `var(--bb-grey-50)`
- Border : `1px solid var(--bb-grey-200)`
- Border radius : `12px` pour le conteneur

### 7. **Sidebar**
- Fond : `var(--bb-grey-50)` ou blanc
- Items actifs : Gradient bleu ou fond bleu clair
- Hover : Fond `var(--bb-grey-100)`
- Border radius : `12px` pour les items
- Transition : `all 0.2s ease`

### 8. **Headers / Titres**
- H1 : Gradient bleu ou couleur bleue foncée
- Espacement : Margin bottom `24px` ou `32px`
- Font weight : `700` pour H1, `600` pour H2

### 9. **Backgrounds**
- Page principale : `var(--bb-gradient-body)` ou `var(--bb-grey-100)`
- Sections : Blanc ou `var(--bb-grey-50)`
- Cards : Blanc

### 10. **Animations**
- Fade-in : `opacity 0.3s ease`
- Slide-in : `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Hover : `transform: translateY(-2px)` pour les cartes
- Loading : Skeleton loaders avec animation shimmer

---

## 📝 INSTRUCTIONS DE TRAVAIL

### ORDRE DE TRAITEMENT (à suivre strictement) :

1. **Commencer par la page Landing** (`app/page.tsx` + `components/Landing.tsx`)
   - Styler le hero, les 3 cartes de fonctionnalités, le CTA
   - Utiliser les styles dans `styles/pages/landing.css`
   - Vérifier que tout est cohérent avec les design tokens

2. **Ensuite le Dashboard Principal** (`app/dashboard/page.tsx`)
   - Styler le header, les 4 StatCards, les 2 graphiques (bar + donut), ActivityFeed, AlertsPanel
   - Utiliser les styles dans `styles/dashboard.css`
   - S'assurer que les graphiques ont des animations fluides

3. **Puis toutes les pages du dashboard une par une** :
   - Explore
   - Credit Score (avec tous ses onglets)
   - My Loans (avec filtres, tableaux, détails)
   - NFT RWA (avec tous ses onglets)
   - Insurance
   - Investor
   - Profile
   - Terms & Conditions

4. **Styliser tous les composants partagés** :
   - Sidebar
   - StatCard
   - Card
   - Button
   - Badge
   - WalletConnect
   - ActivityFeed
   - AlertsPanel
   - Tous les autres composants UI

### RÈGLES IMPORTANTES :

✅ **DOIT FAIRE** :
- Utiliser TOUJOURS les variables CSS des design tokens (ne jamais hardcoder les couleurs)
- Appliquer un style premium et moderne sur TOUTES les pages
- Vérifier la cohérence visuelle entre toutes les pages
- Ajouter des animations fluides et subtiles
- Respecter les espacements et la hiérarchie visuelle
- Styler TOUS les états (hover, active, focus, disabled)
- Rendre responsive (mobile + desktop)
- Utiliser les gradients premium pour les éléments importants
- Ajouter des ombres subtiles pour la profondeur

❌ **NE PAS FAIRE** :
- Ne pas sauter de pages
- Ne pas utiliser de couleurs hardcodées (toujours via variables)
- Ne pas oublier les états hover/active/focus
- Ne pas créer de styles incohérents entre les pages
- Ne pas oublier la responsivité mobile
- Ne pas utiliser de styles trop chargés ou kitsch

### FICHIERS CSS À MODIFIER/CRÉER :

- `styles/dashboard.css` - Styles pour toutes les pages dashboard
- `styles/pages/landing.css` - Styles pour la landing page
- `styles/components/*.css` - Styles pour les composants
- `styles/layout/app-layout.css` - Layout général
- `styles/utilities/animations.css` - Animations globales

### STRUCTURE CSS À RESPECTER :

```css
/* Pour chaque page/component, utiliser cette structure */

.page-name {
  /* Container principal */
}

.page-name-header {
  /* Header de la page */
}

.page-name-content {
  /* Contenu principal */
}

.page-name-card {
  /* Cartes dans la page */
  background: var(--bb-white);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
}

.page-name-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

---

## 🔍 VÉRIFICATIONS FINALES

Après avoir stylisé chaque page, vérifier :

1. ✅ Toutes les couleurs utilisent les variables CSS
2. ✅ Tous les espacements sont cohérents
3. ✅ Toutes les animations sont fluides
4. ✅ Tous les états (hover, active, focus) sont stylisés
5. ✅ La page est responsive (mobile + desktop)
6. ✅ Les typographies sont cohérentes
7. ✅ Les ombres et effets sont subtils et premium
8. ✅ Pas de styles hardcodés
9. ✅ Cohérence visuelle avec les autres pages

---

## 🚀 DÉMARRAGE

**COMMENCE MAINTENANT par la page Landing et continue page par page jusqu'à la fin, sans t'arrêter.**

Pour chaque page :
1. Lire le fichier de la page
2. Lire le composant associé
3. Vérifier les styles existants
4. Appliquer/modifier les styles pour un rendu premium
5. Vérifier la cohérence avec les design tokens
6. Passer à la page suivante

**NE S'ARRÊTE PAS AVANT D'AVOIR FINI TOUTES LES PAGES !**

---

## 📚 RESSOURCES DISPONIBLES

- Design tokens : `styles/design-tokens.css`
- Design tokens JSON : `design-tokens.json`
- Styles dashboard existants : `styles/dashboard.css` (5402 lignes - à utiliser comme référence mais améliorer)
- Styles landing : `styles/pages/landing.css`
- Styles composants : `styles/components/*.css`
- Layout : `styles/layout/app-layout.css`

---

## 💡 EXEMPLES DE STYLE PREMIUM

### Carte premium :
```css
.premium-card {
  background: var(--bb-white);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-card:hover {
  box-shadow: 0 12px 48px rgba(15, 23, 42, 0.12), 0 6px 24px rgba(30, 58, 138, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}
```

### Bouton premium :
```css
.premium-button {
  background: var(--bb-gradient-button);
  color: var(--bb-white);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  box-shadow: var(--shadow-cta);
  transition: all 0.3s ease;
}

.premium-button:hover {
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}
```

### Badge premium :
```css
.premium-badge {
  background: var(--bb-gradient-primary);
  color: var(--bb-white);
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}
```

---

**MAINTENANT, COMMENCE LE RESTYLING COMPLET DE TOUTES LES PAGES DU DÉBUT À LA FIN ! 🚀**






