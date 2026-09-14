const fs=require('fs');
const src=fs.readFileSync('captacao.html','utf8');
const required=[
  'const SETEMBRO_2026_SEED=',
  'casais:224',
  'q:155',
  'nq:68',
  'vendas:32',
  'vgv:4258700',
  "periodo:'01 a 13/09/2026'",
  'function isCaptureBlank(',
  'SETEMBRO_2026_SEED',
  'LARISSA RIBEIRO',
  'MUSEU DE CERA'
];
for(const token of required){
  if(!src.includes(token)) throw new Error(`Snapshot Setembro X ausente: ${token}`);
}
console.log('Captação Setembro X snapshot contract OK');
