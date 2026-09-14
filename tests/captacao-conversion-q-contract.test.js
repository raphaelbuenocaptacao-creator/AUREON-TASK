const fs = require('fs');
const html = fs.readFileSync('captacao.html', 'utf8');

const required = [
  'id="kConvQ"',
  'CONVERSÃO / Q',
  'convQ=capture.q?capture.vendas/capture.q*100:0',
  "kConvQ.textContent=convQ.toFixed(1)+'%'"
];

const missing = required.filter(token => !html.includes(token));
if (missing.length) {
  console.error('Captação conversão sobre Q ausente:', missing.join(', '));
  process.exit(1);
}

console.log('Captação conversão sobre Q contract OK');
