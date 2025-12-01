# Palette de Couleurs BlockBank

## Couleurs Principales

### Primary Colors (Bleu Amadeus)
- **Primary**: `#0077BD` - Couleur principale BlockBank
- **Primary Hover**: `#0067A4` - État au survol
- **Primary Active**: `#00527F` - État actif
- **Primary Light**: `#0BA4FF` - Variante claire pour dégradés
- **Primary Gradient**: `linear-gradient(135deg, #0077BD 0%, #0BA4FF 100%)`

### Backgrounds
- **Background Light**: `#F8FAFD` - Fond clair
- **Background Dark**: `#0A0F14` - Fond sombre
- **Background Card**: `#FFFFFF` - Surfaces de cartes

### Text Colors
- **Text Dark**: `#0A0A0A` - Texte principal
- **Text Light**: `#FFFFFF` - Texte sur fond sombre

### Borders & UI
- **Border**: `#DCE7F2` - Bordures et séparateurs
- **Shadow**: `rgba(0, 119, 189, 0.25)` - Ombres avec teinte bleue

## Variables CSS

Toutes les couleurs sont disponibles via les variables CSS :

```css
--bb-primary: #0077BD;
--bb-primary-hover: #0067A4;
--bb-primary-active: #00527F;
--bb-primary-gradient: linear-gradient(135deg, #0077BD 0%, #0BA4FF 100%);
--bb-bg-light: #F8FAFD;
--bb-bg-dark: #0A0F14;
--bb-text-dark: #0A0A0A;
--bb-text-light: #FFFFFF;
--bb-border: #DCE7F2;
--bb-shadow: rgba(0, 119, 189, 0.25);
```

## Fichiers Mis à Jour

1. **app/globals.css** - Variables principales mises à jour
2. **styles/design-tokens.css** - Tokens de design mis à jour
3. **components/Dashboard.tsx** - Graphiques avec nouvelles couleurs
4. **components/dashboard/CreditScore.tsx** - Dégradés mis à jour
5. **components/icons/Logo.tsx** - Logo avec nouvelle palette

## Utilisation

Utilisez les variables CSS plutôt que les couleurs en dur :

```css
/* Bon */
color: var(--bb-primary);
background: var(--bb-primary-gradient);
border: 1px solid var(--bb-border);

/* À éviter */
color: #0077BD;
```

