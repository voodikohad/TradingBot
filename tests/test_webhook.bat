@echo off
REM TradingView Webhook Test Script (Windows PowerShell)
REM This script sends sample TradingView alerts to your webhook

setlocal enabledelayedexpansion

set WEBHOOK_URL=http://localhost:3000/webhook
set WEBHOOK_SECRET=mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb

echo.
echo 🧪 Testing TradingView Webhook Integration...
echo.

REM Test 1: Valid Entry Signal (Long with Percent)
echo 📤 Test 1: Sending LONG entry with 1 percent size...
powershell -Command "^
  $body = @{^
    action = 'entry'^
    side = 'long'^
    symbol = 'BTCUSDT'^
    size_type = 'percent'^
    size = 1.0^
    tag = 'SFP_SL'^
  } | ConvertTo-Json; ^
  Invoke-WebRequest -Uri '%WEBHOOK_URL%' -Method POST ^
    -Headers @{'X-Webhook-Secret'='%WEBHOOK_SECRET%'} ^
    -Body $body -ContentType 'application/json' | ^
    ConvertTo-Json -Depth 10 | Write-Host"
echo.

REM Test 2: Valid Entry Signal (Short with USD)
echo 📤 Test 2: Sending SHORT entry with 100 USD...
powershell -Command "^
  $body = @{^
    action = 'entry'^
    side = 'short'^
    symbol = 'ETHUSDT'^
    size_type = 'usd'^
    size = 100^
    tag = 'SCALP'^
  } | ConvertTo-Json; ^
  Invoke-WebRequest -Uri '%WEBHOOK_URL%' -Method POST ^
    -Headers @{'X-Webhook-Secret'='%WEBHOOK_SECRET%'} ^
    -Body $body -ContentType 'application/json' | ^
    ConvertTo-Json -Depth 10 | Write-Host"
echo.

REM Test 3: Missing Required Field (should fail)
echo 📤 Test 3: Sending invalid webhook (missing field)...
powershell -Command "^
  $body = @{^
    action = 'entry'^
    side = 'long'^
    symbol = 'BTCUSDT'^
  } | ConvertTo-Json; ^
  try { ^
    Invoke-WebRequest -Uri '%WEBHOOK_URL%' -Method POST ^
      -Headers @{'X-Webhook-Secret'='%WEBHOOK_SECRET%'} ^
      -Body $body -ContentType 'application/json' | ^
      ConvertTo-Json -Depth 10 | Write-Host ^
  } catch { ^
    $_.Exception.Response | Write-Host ^
  }"
echo.

REM Test 4: Invalid Secret (should fail with 401)
echo 📤 Test 4: Sending with invalid token (should fail)...
powershell -Command "^
  $body = @{^
    action = 'entry'^
    side = 'long'^
    symbol = 'BTCUSDT'^
    size_type = 'percent'^
    size = 1.0^
  } | ConvertTo-Json; ^
  try { ^
    Invoke-WebRequest -Uri '%WEBHOOK_URL%' -Method POST ^
      -Headers @{'X-Webhook-Secret'='wrong_token'} ^
      -Body $body -ContentType 'application/json' | ^
      ConvertTo-Json -Depth 10 | Write-Host ^
  } catch { ^
    Write-Host ('Error: ' + $_.Exception.Response.StatusCode) ^
  }"
echo.

REM Test 5: Health Check
echo 📤 Test 5: Checking server health...
powershell -Command "^
  Invoke-WebRequest -Uri 'http://localhost:3000/health' -Method GET | ^
    ConvertTo-Json -Depth 10 | Write-Host"
echo.

echo ✅ Tests completed!
pause
