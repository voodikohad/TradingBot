# Test New Format with PowerShell

# Replace YOUR_SECRET_TOKEN with your actual webhook secret
$webhookUrl = "https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=YOUR_SECRET_TOKEN"

# LONG Signal Test
$longSignal = @{
    pair = "BTCUSDT"
    signal_type = "Regular (Long)"
    exchange = "Binance Futures"
    leverage = "Isolated (10X)"
    position_size = "1%"
    entry_type = "Buy at current price"
    
    take_profit_targets = @{
        "1" = 93400
        "2" = 93520
        "3" = 93680
        "4" = 93850
        "5" = 94000
    }
    
    stop_targets = @{
        "1" = 82990
    }
    
    trailing_configuration = @{
        entry = "Percentage (0.5%)"
        take_profit = "Percentage (0.5%)"
        stop = "Moving Target"
        trigger = "Target (1)"
    }
    
    trade_signal = @{
        symbol = "BTCUSDT"
        side = "LONG"
        size = "1%"
        tag = "#SFP_SL"
    }
} | ConvertTo-Json -Depth 10

Write-Host "🧪 Testing LONG Signal..." -ForegroundColor Cyan
Write-Host "Sending to: $webhookUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Payload:" -ForegroundColor Green
Write-Host $longSignal
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $longSignal -ContentType "application/json"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""

# Wait a bit before next test
Start-Sleep -Seconds 2

# SHORT Signal Test
$shortSignal = @{
    pair = "ETHUSDT"
    signal_type = "Regular (Short)"
    exchange = "Binance Futures"
    leverage = "Isolated (15X)"
    position_size = "2%"
    entry_type = "Sell at current price"
    
    take_profit_targets = @{
        "1" = 2200
        "2" = 2180
        "3" = 2150
        "4" = 2120
        "5" = 2100
    }
    
    stop_targets = @{
        "1" = 2350
    }
    
    trailing_configuration = @{
        entry = "Percentage (0.5%)"
        take_profit = "Percentage (0.5%)"
        stop = "Moving Target"
        trigger = "Target (1)"
    }
    
    trade_signal = @{
        symbol = "ETHUSDT"
        side = "SHORT"
        size = "2%"
        tag = "#SFP_SL"
    }
} | ConvertTo-Json -Depth 10

Write-Host "🧪 Testing SHORT Signal..." -ForegroundColor Cyan
Write-Host "Sending to: $webhookUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Payload:" -ForegroundColor Green
Write-Host $shortSignal
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $shortSignal -ContentType "application/json"
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ FAILED!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Tests completed! Check your Telegram channel for the signals." -ForegroundColor Green
