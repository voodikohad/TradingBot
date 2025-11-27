/**
 * Test message formatting
 */

const testData = {
  action: 'entry',
  side: 'long',
  symbol: 'BTCUSDT',
  size: 1.0,
  size_type: 'percent',
  tag: 'LONG_ENTRY'
};

const cornixCommand = '/entry BTCUSDT long 1% LONG_ENTRY';

function formatCornixMessage(cornixCommand, data) {
  const timestamp = new Date().toLocaleString();

  // Use simple formatting without special characters that break Markdown
  const message = `${cornixCommand}

🚀 TRADE SIGNAL
─────────────────────
Symbol: ${data.symbol}
Action: ${data.action.toUpperCase()}
Side: ${data.side.toUpperCase()}
Size: ${data.size}${data.size_type === 'percent' ? '%' : 'USD'}
${data.tag ? `Tag: ${data.tag}` : ''}
Time: ${timestamp}`;

  return message;
}

const message = formatCornixMessage(cornixCommand, testData);

console.log('Message to send:');
console.log('─────────────────────────────────');
console.log(message);
console.log('─────────────────────────────────');
console.log('\nMessage length:', message.length);
console.log('Contains special chars:', /[*_`\[\]()]/.test(message) ? 'Yes (might need escaping)' : 'No (safe)');
