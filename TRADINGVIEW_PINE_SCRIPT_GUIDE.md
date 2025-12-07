# TradingView Pine Script Integration Guide

## 📝 How to Send Alerts from Your Indicator

This guide shows you how to configure your Pine Script indicator to send signals in the new JSON format.

---

## 🎯 Quick Setup

### Step 1: Create Alert in TradingView

1. Open your chart with the indicator
2. Click **"Alerts"** → **"Create Alert"**
3. Set **Condition** to your indicator signal
4. In the **Message** field, paste one of the templates below

---

## 📋 Alert Message Templates

### 🟢 LONG Signal Template

Copy this into your TradingView alert **Message** field for LONG signals:

```json
{
  "pair": "{{ticker}}",
  "signal_type": "Regular (Long)",
  "exchange": "Binance Futures",
  "leverage": "Isolated (10X)",
  "position_size": "1%",
  "entry_type": "Buy at current price",

  "take_profit_targets": {
    "1": {{close}},
    "2": {{close}},
    "3": {{close}},
    "4": {{close}},
    "5": {{close}}
  },

  "stop_targets": {
    "1": {{close}}
  },

  "trailing_configuration": {
    "entry": "Percentage (0.5%)",
    "take_profit": "Percentage (0.5%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "{{ticker}}",
    "side": "LONG",
    "size": "1%",
    "tag": "#SFP_SL"
  }
}
```

### 🔴 SHORT Signal Template

Copy this into your TradingView alert **Message** field for SHORT signals:

```json
{
  "pair": "{{ticker}}",
  "signal_type": "Regular (Short)",
  "exchange": "Binance Futures",
  "leverage": "Isolated (10X)",
  "position_size": "1%",
  "entry_type": "Sell at current price",

  "take_profit_targets": {
    "1": {{close}},
    "2": {{close}},
    "3": {{close}},
    "4": {{close}},
    "5": {{close}}
  },

  "stop_targets": {
    "1": {{close}}
  },

  "trailing_configuration": {
    "entry": "Percentage (0.5%)",
    "take_profit": "Percentage (0.5%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "{{ticker}}",
    "side": "SHORT",
    "size": "1%",
    "tag": "#SFP_SL"
  }
}
```

---

## 🔧 Advanced: Using Pine Script Variables

If your indicator calculates TP/SL levels, you can use Pine Script's `alertcondition()` with dynamic values.

### Example Pine Script Code

```pine
//@version=5
indicator("SFP_SL Strategy", overlay=true)

// Your indicator logic here
longCondition = ta.crossover(ta.sma(close, 10), ta.sma(close, 20))
shortCondition = ta.crossunder(ta.sma(close, 10), ta.sma(close, 20))

// Calculate TP/SL levels
longTP1 = close * 1.01  // 1% above entry
longTP2 = close * 1.02  // 2% above entry
longTP3 = close * 1.03  // 3% above entry
longTP4 = close * 1.04  // 4% above entry
longTP5 = close * 1.05  // 5% above entry
longSL = close * 0.98   // 2% below entry

shortTP1 = close * 0.99  // 1% below entry
shortTP2 = close * 0.98  // 2% below entry
shortTP3 = close * 0.97  // 3% below entry
shortTP4 = close * 0.96  // 4% below entry
shortTP5 = close * 0.95  // 5% below entry
shortSL = close * 1.02   // 2% above entry

// Build JSON message for LONG
longMessage = '{\n' +
  '  "pair": "' + syminfo.ticker + '",\n' +
  '  "signal_type": "Regular (Long)",\n' +
  '  "exchange": "Binance Futures",\n' +
  '  "leverage": "Isolated (10X)",\n' +
  '  "position_size": "1%",\n' +
  '  "entry_type": "Buy at current price",\n' +
  '  "take_profit_targets": {\n' +
  '    "1": ' + str.tostring(longTP1) + ',\n' +
  '    "2": ' + str.tostring(longTP2) + ',\n' +
  '    "3": ' + str.tostring(longTP3) + ',\n' +
  '    "4": ' + str.tostring(longTP4) + ',\n' +
  '    "5": ' + str.tostring(longTP5) + '\n' +
  '  },\n' +
  '  "stop_targets": {\n' +
  '    "1": ' + str.tostring(longSL) + '\n' +
  '  },\n' +
  '  "trailing_configuration": {\n' +
  '    "entry": "Percentage (0.5%)",\n' +
  '    "take_profit": "Percentage (0.5%)",\n' +
  '    "stop": "Moving Target",\n' +
  '    "trigger": "Target (1)"\n' +
  '  },\n' +
  '  "trade_signal": {\n' +
  '    "symbol": "' + syminfo.ticker + '",\n' +
  '    "side": "LONG",\n' +
  '    "size": "1%",\n' +
  '    "tag": "#SFP_SL"\n' +
  '  }\n' +
  '}'

// Build JSON message for SHORT
shortMessage = '{\n' +
  '  "pair": "' + syminfo.ticker + '",\n' +
  '  "signal_type": "Regular (Short)",\n' +
  '  "exchange": "Binance Futures",\n' +
  '  "leverage": "Isolated (10X)",\n' +
  '  "position_size": "1%",\n' +
  '  "entry_type": "Sell at current price",\n' +
  '  "take_profit_targets": {\n' +
  '    "1": ' + str.tostring(shortTP1) + ',\n' +
  '    "2": ' + str.tostring(shortTP2) + ',\n' +
  '    "3": ' + str.tostring(shortTP3) + ',\n' +
  '    "4": ' + str.tostring(shortTP4) + ',\n' +
  '    "5": ' + str.tostring(shortTP5) + '\n' +
  '  },\n' +
  '  "stop_targets": {\n' +
  '    "1": ' + str.tostring(shortSL) + '\n' +
  '  },\n' +
  '  "trailing_configuration": {\n' +
  '    "entry": "Percentage (0.5%)",\n' +
  '    "take_profit": "Percentage (0.5%)",\n' +
  '    "stop": "Moving Target",\n' +
  '    "trigger": "Target (1)"\n' +
  '  },\n' +
  '  "trade_signal": {\n' +
  '    "symbol": "' + syminfo.ticker + '",\n' +
  '    "side": "SHORT",\n' +
  '    "size": "1%",\n' +
  '    "tag": "#SFP_SL"\n' +
  '  }\n' +
  '}'

// Create alerts
if longCondition
    alert(longMessage, alert.freq_once_per_bar)

if shortCondition
    alert(shortMessage, alert.freq_once_per_bar)
```

---

## 📱 Alert Configuration

### Webhook URL Setup

In the alert dialog:

1. **Name**: Give it a descriptive name (e.g., "BTC SFP_SL Long")
2. **Condition**: Select your indicator and condition
3. **Options**: 
   - ✅ Check "Webhook URL"
   - Enter: `https://strange-dyanne-tradingbot12-29686213.koyeb.app/webhook?token=YOUR_SECRET_TOKEN`
4. **Message**: Paste the JSON template
5. **Frequency**: "Once Per Bar Close" (recommended)

---

## 🎨 Customization Options

### Leverage

Change `"leverage": "Isolated (10X)"` to your desired leverage:
- `"Isolated (5X)"` for 5x
- `"Isolated (20X)"` for 20x
- `"Isolated (50X)"` for 50x

### Position Size

Change `"position_size": "1%"` and `"size": "1%"` to your risk percentage:
- `"1%"` = 1% of account
- `"2%"` = 2% of account
- `"5%"` = 5% of account

### Take Profit Levels

You can:
- **Remove TP levels**: Just delete the lines you don't need
- **Change number of TPs**: Keep 1-5 targets
- **Calculate dynamically**: Use Pine Script variables (see advanced example)

### Stop Loss

Set your SL in `"stop_targets"`:
```json
"stop_targets": {
  "1": 82990  // Your SL price
}
```

### Tag

Change `"tag": "#SFP_SL"` to identify different strategies:
- `"#SFP_SL"` = SFP Smart Liquidity strategy
- `"#SCALP"` = Scalping strategy
- `"#SWING"` = Swing trading
- `"#TEST"` = Testing

---

## ✅ Testing Your Setup

### 1. Test with Manual Alert

1. Create alert with the template
2. Click "Test" button in TradingView
3. Check your Telegram channel for the signal
4. Verify the format looks correct

### 2. Check Server Logs

Visit your Koyeb dashboard:
```
https://app.koyeb.com/
```

Look for webhook logs showing:
- ✅ Validation PASSED
- ✅ Cornix Command formatted
- ✅ Message sent to Telegram

---

## 🐛 Troubleshooting

### Alert Not Triggering?

1. **Check indicator condition**: Make sure it's actually firing
2. **Verify webhook URL**: Include `?token=YOUR_SECRET_TOKEN`
3. **Check TradingView alert history**: See if alerts are being sent

### Invalid JSON Error?

1. **Validate JSON**: Copy your message and test at https://jsonlint.com
2. **Check quotes**: Make sure all strings use double quotes `"`
3. **Remove comments**: JSON doesn't support comments

### Missing TP/SL Levels?

1. **Check template**: Ensure all required fields are present
2. **Verify numbers**: Make sure TP/SL are valid prices
3. **Test format**: Use the test file to verify

---

## 📊 Example Real-World Setup

**Scenario**: You want to trade BTC with:
- 10x leverage
- 1% position size
- 5 TP levels (1%, 2%, 3%, 4%, 5% profit)
- 2% stop loss

**Alert Message**:

```json
{
  "pair": "BTCUSDT",
  "signal_type": "Regular (Long)",
  "exchange": "Binance Futures",
  "leverage": "Isolated (10X)",
  "position_size": "1%",
  "entry_type": "Buy at current price",

  "take_profit_targets": {
    "1": 93400,
    "2": 93520,
    "3": 93680,
    "4": 93850,
    "5": 94000
  },

  "stop_targets": {
    "1": 91500
  },

  "trailing_configuration": {
    "entry": "Percentage (0.5%)",
    "take_profit": "Percentage (0.5%)",
    "stop": "Moving Target",
    "trigger": "Target (1)"
  },

  "trade_signal": {
    "symbol": "BTCUSDT",
    "side": "LONG",
    "size": "1%",
    "tag": "#SFP_SL"
  }
}
```

**Result in Cornix**:

```
⚡⚡ #BTCUSDT ⚡⚡
Exchanges: Binance Futures
Signal Type: Regular (Long)
Leverage: Isolated (10X)

Entry Zone:
Buy at current price

Take-Profit Targets:
1) 93400
2) 93520
3) 93680
4) 93850
5) 94000

Stop Targets:
1) 91500

Trailing Configuration:
Entry: Percentage (0.5%)
Take-Profit: Percentage (0.5%)
Stop: Moving Target -
Trigger: Target (1)

🚀 TRADE SIGNAL
─────────────────────
Symbol: BTCUSDT
Side: LONG
Size: 1%
Tag: #SFP_SL
```

---

## 🚀 You're Ready!

Your TradingBot is now configured to receive signals from TradingView in the new format!

1. ✅ Copy the template
2. ✅ Configure your alert
3. ✅ Set webhook URL
4. ✅ Start trading automatically!

Happy Trading! 📈
