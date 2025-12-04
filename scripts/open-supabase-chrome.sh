#!/bin/bash

# Script to open Supabase in Chrome with user session
# This will open Chrome and navigate to Supabase SQL Editor

# Read SQL file
SQL_FILE="$(dirname "$0")/../EXECUTE-NOW.sql"

# Open Chrome with Supabase SQL Editor
# Using --new-window to open in a new window
# The user will need to be logged in to Supabase

open -a "Google Chrome" --new --args \
  --profile-directory="Default" \
  "https://supabase.com/dashboard/project/ipamfhfzflprptchlaei/sql/new"

# Wait a moment for Chrome to open
sleep 2

# Display instructions
echo ""
echo "✅ Chrome opened with Supabase SQL Editor"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure you're logged in to Supabase"
echo "   2. The SQL Editor should be open"
echo "   3. Copy the content from: $SQL_FILE"
echo "   4. Paste in the SQL Editor"
echo "   5. Click 'Run'"
echo ""
echo "📄 SQL file location:"
echo "   $SQL_FILE"
echo ""

