#!/bin/bash

# Quick Vercel Environment Variables Setup
# This script sets all required environment variables in Vercel

echo "🔧 Quick Vercel Environment Variables Setup"
echo ""
echo "This script will set environment variables in Vercel."
echo "Make sure you have the following values ready:"
echo "  - GOOGLE_SERVICE_ACCOUNT_EMAIL"
echo "  - GOOGLE_PRIVATE_KEY"
echo "  - GOOGLE_DRIVE_FOLDER_ID"
echo "  - ADMIN_PASSWORD_HASH"
echo "  - ADMIN_SESSION_SECRET"
echo ""

read -p "Press Enter to continue or Ctrl+C to cancel..."

# Read values
read -p "Google Service Account Email: " GOOGLE_SERVICE_ACCOUNT_EMAIL
read -p "Google Private Key (paste full key): " GOOGLE_PRIVATE_KEY
read -p "Google Drive Folder ID: " GOOGLE_DRIVE_FOLDER_ID
read -p "Admin Password Hash: " ADMIN_PASSWORD_HASH
read -p "Admin Session Secret: " ADMIN_SESSION_SECRET

echo ""
echo "📝 Setting variables in Vercel..."

# Set for all environments
for env in production preview development; do
  echo ""
  echo "Setting for $env environment:"
  
  echo "$GOOGLE_SERVICE_ACCOUNT_EMAIL" | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL $env
  echo "$GOOGLE_PRIVATE_KEY" | vercel env add GOOGLE_PRIVATE_KEY $env
  echo "$GOOGLE_DRIVE_FOLDER_ID" | vercel env add GOOGLE_DRIVE_FOLDER_ID $env
  echo "$ADMIN_PASSWORD_HASH" | vercel env add ADMIN_PASSWORD_HASH $env
  echo "$ADMIN_SESSION_SECRET" | vercel env add ADMIN_SESSION_SECRET $env
  echo "production" | vercel env add NODE_ENV $env
done

echo ""
echo "✅ All variables configured!"
echo ""
echo "To verify: vercel env ls"
