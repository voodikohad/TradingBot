$WEBHOOK_URL = "http://localhost:3000/webhook"
$WEBHOOK_SECRET = "mkhxwyytbsbmizlwpfsaptlftlxkhqomryxibpedmeefstveaelpacftgmkiehunsjyydswasjjsioixbwnrlmoezfjkebqmszyntrozzhpzzveaqpxtviqtsaludeyb"

Write-Host "Testing webhook with BTCUSDT LONG entry..."

$body = @{
    action = "entry"
    side = "long"
    symbol = "BTCUSDT"
    size_type = "percent"
    size = 1.0
    tag = "TEST_LONG"
} | ConvertTo-Json

$headers = @{
    "X-Webhook-Secret" = $WEBHOOK_SECRET
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Headers $headers -Body $body
    Write-Host "Success!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`nSending another test - ETHUSDT SHORT..."

$body2 = @{
    action = "entry"
    side = "short"
    symbol = "ETHUSDT"
    size_type = "usd"
    size = 100
    tag = "TEST_SHORT"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri $WEBHOOK_URL -Method POST -Headers $headers -Body $body2
    Write-Host "Success!" -ForegroundColor Green
    $response2 | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
