const fs=require('fs');
const src=fs.readFileSync('captacao.html','utf8');

// Setembro X is now a manual input source. The contract must validate that
// imported data can be pasted, parsed, timestamped and persisted without
// requiring a stale hard-coded September 2026 snapshot inside the app.
const required=[
  'id="setembroPaste"',
  'onclick="importSetembroX()"',
  'function importSetembroX()',
  'parseSetembroNumber',
  'extractMetric',
  'capture.importedAt',
  'saveCapture()'
];
for(const token of required){
  if(!src.includes(token)) throw new Error(`Fluxo Setembro X ausente: ${token}`);
}

// Guard against reintroducing the obsolete embedded operational snapshot.
if(src.includes('const SETEMBRO_2026_SEED=')){
  throw new Error('Snapshot fixo do Setembro X não deve ser obrigatório no Task; use entrada manual.');
}

console.log('Captação Setembro X manual snapshot contract OK');
