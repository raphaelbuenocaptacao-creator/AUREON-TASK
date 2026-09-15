const fs=require('fs');
const html=fs.readFileSync('captacao.html','utf8');
for(const token of ['id="kBrindeQtd"','id="kBrindeMedio"','TOTAL BRINDES','BRINDES / CASAL']){
  if(!html.includes(token)) throw new Error(`Resumo de eficiência de brindes ausente: ${token}`);
}
console.log('Captação gift efficiency contract OK');
