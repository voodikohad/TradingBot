#!/bin/bash

# TradingView Webhook Test Script
# This script sends sample TradingView alerts to your webhook

WEBHOOK_URL="http://localhost:3000/webhook"
WEBHOOK_SECRET="your_secure_webhook_token_here"

echo "🧪 Testing TradingView Webhook Integration..."
echo ""

# Test 1: Valid Entry Signal (Long with Percent)
echo "📤 Test 1: Sending LONG entry with 1% size..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "action": "entry",
    "side": "long",
    "symbol": "BTCUSDT",
    "size_type": "percent",
    "size": 1.0,
    "tag": "SFP_SL"
  }' | jq .
echo ""

# Test 2: Valid Entry Signal (Short with USD)
echo "📤 Test 2: Sending SHORT entry with 100 USD..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "action": "entry",
    "side": "short",
    "symbol": "ETHUSDT",
    "size_type": "usd",
    "size": 100,
    "tag": "SCALP"
  }' | jq .
echo ""

# Test 3: Missing Required Field (should fail)
echo "📤 Test 3: Sending invalid webhook (missing field)..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "action": "entry",
    "side": "long",
    "symbol": "BTCUSDT"
  }' | jq .
echo ""

# Test 4: Invalid Secret (should fail with 401)
echo "📤 Test 4: Sending with invalid token (should fail)..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: wrong_token" \
  -d '{
    "action": "entry",
    "side": "long",
    "symbol": "BTCUSDT",
    "size_type": "percent",
    "size": 1.0
  }' | jq .
echo ""

# Test 5: Health Check
echo "📤 Test 5: Checking server health..."
curl -X GET "http://localhost:3000/health" | jq .
echo ""

echo "✅ Tests completed!"
