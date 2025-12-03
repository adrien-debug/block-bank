#!/bin/bash

# Production Testing Script
# Tests all functionality 10 times on localhost and production

BASE_URL_LOCAL="http://localhost:1001"
BASE_URL_PRODUCTION="https://blockbank.com"

echo "🚀 Starting comprehensive production tests..."
echo ""

# Test localhost
echo "📋 Testing Localhost (10 iterations each)..."
TEST_URL=$BASE_URL_LOCAL npm run test:production

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test production
echo "📋 Testing Production - blockbank.com (10 iterations each)..."
TEST_URL=$BASE_URL_PRODUCTION npm run test:production

echo ""
echo "✅ All tests completed!"

