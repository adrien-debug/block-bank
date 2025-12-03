#!/bin/bash

# Script to configure Vercel environment variables
# Usage: ./scripts/setup-vercel-env.sh

echo "🔧 Configuring Vercel Environment Variables"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local file not found"
  echo "Please create .env.local with your environment variables first"
  exit 1
fi

# Source the .env.local file
source .env.local

# Required variables
VARS=(
  "GOOGLE_SERVICE_ACCOUNT_EMAIL"
  "GOOGLE_PRIVATE_KEY"
  "GOOGLE_DRIVE_FOLDER_ID"
  "ADMIN_PASSWORD_HASH"
  "ADMIN_SESSION_SECRET"
  "NODE_ENV"
)

echo "📋 Setting environment variables in Vercel..."
echo ""

for VAR in "${VARS[@]}"; do
  VALUE="${!VAR}"
  
  if [ -z "$VALUE" ]; then
    echo "⚠️  Warning: $VAR is not set in .env.local, skipping..."
    continue
  fi
  
  echo "Setting $VAR..."
  
  # For production environment
  vercel env add "$VAR" production <<< "$VALUE" 2>&1 | grep -v "Enter"
  
  # For preview environment
  vercel env add "$VAR" preview <<< "$VALUE" 2>&1 | grep -v "Enter"
  
  # For development environment
  vercel env add "$VAR" development <<< "$VALUE" 2>&1 | grep -v "Enter"
  
  echo "✓ $VAR configured"
  echo ""
done

echo "✅ All environment variables configured in Vercel!"
echo ""
echo "📝 To verify, run: vercel env ls"

