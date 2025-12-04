#!/bin/bash

# 🚀 Script de Déploiement Vercel - État Stable J4mvS37rE
# Ce script déploie exactement comme dans l'état stable J4mvS37rE

set -e

echo "🚀 Déploiement Vercel - État Stable J4mvS37rE"
echo "=============================================="
echo ""

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions pour afficher les messages
info() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

step() {
    echo -e "${BLUE}📋 $1${NC}"
}

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    error "Vercel CLI n'est pas installé. Installez-le avec: npm i -g vercel"
    exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    error "Vous devez être dans le répertoire racine du projet"
    exit 1
fi

echo ""
step "Étape 1 : Vérification des fichiers de configuration"
echo "----------------------------------------------------"

# Vérifier next.config.js
if [ -f "next.config.js" ]; then
    info "next.config.js présent"
else
    error "next.config.js manquant"
    exit 1
fi

# Vérifier vercel.json
if [ -f "vercel.json" ]; then
    info "vercel.json présent"
else
    error "vercel.json manquant"
    exit 1
fi

# Vérifier .vercelignore
if [ -f ".vercelignore" ]; then
    info ".vercelignore présent"
else
    warn ".vercelignore manquant (création...)"
    cat > .vercelignore << EOF
# Vercel ignore file
.env.local
.env.*.local
*.backup
EOF
    info ".vercelignore créé"
fi

# Vérifier que globals.css est modulaire (petit)
if [ -f "app/globals.css" ]; then
    GLOBALS_KB=$(du -k app/globals.css 2>/dev/null | cut -f1 || echo "0")
    if [ "$GLOBALS_KB" -lt 10 ]; then
        info "globals.css est modulaire ($GLOBALS_KB KB) - OK"
    else
        warn "globals.css est volumineux ($GLOBALS_KB KB) - devrait être modulaire"
    fi
fi

echo ""
step "Étape 2 : Vérification des variables d'environnement"
echo "----------------------------------------------------"

# Variables requises (Service Account uniquement)
REQUIRED_VARS=(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL"
    "GOOGLE_PRIVATE_KEY"
    "GOOGLE_DRIVE_FOLDER_ID"
    "ADMIN_PASSWORD_HASH"
    "ADMIN_SESSION_SECRET"
    "NODE_ENV"
    "NEXT_PUBLIC_APP_URL"
)

# Variables OAuth à supprimer
OAUTH_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "GOOGLE_REFRESH_TOKEN"
)

# Lister toutes les variables
echo ""
echo "Variables d'environnement actuelles :"
vercel env ls 2>/dev/null || {
    warn "Impossible de lister les variables. Assurez-vous d'être connecté à Vercel."
    echo "Connectez-vous avec : vercel login"
    exit 1
}

echo ""
echo "🔍 Vérification des variables requises..."

# Vérifier les variables requises
MISSING_VARS=()
ENV_OUTPUT=$(vercel env ls 2>/dev/null || echo "")
for var in "${REQUIRED_VARS[@]}"; do
    if echo "$ENV_OUTPUT" | grep -q "$var"; then
        info "Variable présente: $var"
    else
        MISSING_VARS+=("$var")
        warn "Variable manquante: $var"
    fi
done

# Vérifier les variables OAuth à supprimer
OAUTH_FOUND=()
for var in "${OAUTH_VARS[@]}"; do
    if echo "$ENV_OUTPUT" | grep -q "$var"; then
        OAUTH_FOUND+=("$var")
        warn "Variable OAuth trouvée (à supprimer): $var"
    fi
done

# Afficher les variables manquantes
if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    error "Variables manquantes détectées :"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    warn "Vous devez configurer ces variables avant de déployer."
    echo "Consultez VARIABLES_VERCEL.md pour les valeurs."
    echo ""
    read -p "Continuer quand même ? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Supprimer les variables OAuth si présentes
if [ ${#OAUTH_FOUND[@]} -gt 0 ]; then
    echo ""
    warn "Variables OAuth détectées qui doivent être supprimées :"
    for var in "${OAUTH_FOUND[@]}"; do
        echo "  - $var"
    done
    
    echo ""
    read -p "Voulez-vous supprimer ces variables OAuth maintenant ? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for var in "${OAUTH_FOUND[@]}"; do
            echo "Suppression de $var..."
            vercel env rm "$var" production --yes 2>/dev/null || warn "Impossible de supprimer $var (peut-être déjà supprimée)"
        done
        info "Variables OAuth supprimées"
    else
        warn "Variables OAuth non supprimées. Elles peuvent causer des erreurs."
    fi
fi

echo ""
step "Étape 3 : Vérification Vercel Authentication"
echo "--------------------------------------------"

echo ""
warn "⚠️  ACTION MANUELLE REQUISE :"
echo ""
echo "Vous devez désactiver Vercel Authentication dans le Dashboard :"
echo ""
echo "1. Ouvrez : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/deployment-protection"
echo "2. Changez : 'Vercel Authentication' → 'Only Vercel for GitHub'"
echo "3. Cliquez sur 'Save'"
echo ""
read -p "Avez-vous désactivé Vercel Authentication ? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Vous devez désactiver Vercel Authentication avant de déployer !"
    echo ""
    echo "C'est le blocage principal - toutes les API sont bloquées si c'est activé."
    exit 1
fi

echo ""
step "Étape 4 : Build et test local"
echo "------------------------------"

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    info "Installation des dépendances..."
    npm install
else
    info "Dépendances déjà installées"
fi

# Test de build
echo ""
info "Test de build local..."
if npm run build; then
    info "Build réussi !"
else
    error "Build échoué. Corrigez les erreurs avant de déployer."
    exit 1
fi

echo ""
step "Étape 5 : Déploiement sur Vercel"
echo "----------------------------------"

echo ""
read -p "Voulez-vous déployer en production maintenant ? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info "Déploiement en cours..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        info "✅ Déploiement réussi !"
        echo ""
        echo "📋 Prochaines étapes :"
        echo "  1. Vérifiez que l'application fonctionne sur votre URL de production"
        echo "  2. Testez une soumission pour vérifier Google Drive"
        echo "  3. Vérifiez les logs avec : vercel logs --follow"
    else
        error "❌ Déploiement échoué. Vérifiez les erreurs ci-dessus."
        exit 1
    fi
else
    warn "Déploiement annulé. Pour déployer plus tard, exécutez : vercel --prod"
fi

echo ""
echo "=========================================="
echo "✅ Script terminé !"
echo ""
echo "📋 Résumé :"
echo "  - Variables requises : ${#REQUIRED_VARS[@]}"
echo "  - Variables manquantes : ${#MISSING_VARS[@]}"
echo "  - Variables OAuth supprimées : ${#OAUTH_FOUND[@]}"
echo ""
echo "📖 Documentation :"
echo "  - RESTAURATION_J4mvS37rE.md - Guide complet"
echo "  - VARIABLES_VERCEL.md - Configuration des variables"
echo ""



