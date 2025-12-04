#!/bin/bash

# Script pour ouvrir Supabase SQL Editor avec le SQL prêt

require('dotenv').config({ path: '.env.local' })

SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2)
PROJECT_REF=$(echo $SUPABASE_URL | sed -E 's|https?://([^.]+)\.supabase\.co.*|\1|')

echo "🚀 Ouverture de Supabase SQL Editor..."
echo ""
echo "📋 Project Reference: $PROJECT_REF"
echo "🔗 URL: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo ""

# Ouvrir dans le navigateur (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
    echo "✅ Supabase Dashboard ouvert dans votre navigateur"
    echo ""
    echo "📝 Étapes suivantes:"
    echo "   1. Le SQL Editor devrait être ouvert"
    echo "   2. Copiez le contenu de: scripts/setup-users-table-complete.sql"
    echo "   3. Collez dans l'éditeur"
    echo "   4. Cliquez sur 'Run' (ou Cmd + Enter)"
    echo ""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "https://supabase.com/dashboard/project/$PROJECT_REF/sql/new" 2>/dev/null || echo "Ouvrez manuellement: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
else
    echo "Ouvrez manuellement: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
fi

