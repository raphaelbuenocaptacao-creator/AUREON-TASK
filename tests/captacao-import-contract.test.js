const fs=require('fs');
const src=fs.readFileSync('captacao.html','utf8');
const required=[
  'id="setembroPaste"',
  'onclick="importSetembroX()"',
  'function importSetembroX()',
  'parseSetembroNumber',
  'Dados do Setembro X aplicados',
  "capture.importedAt"
];
for(const token of required){
  if(!src.includes(token)) throw new Error(`Contrato de importação ausente: ${token}`);
}
console.log('Captação Setembro X import contract OK');
