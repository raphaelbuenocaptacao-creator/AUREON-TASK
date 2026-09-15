const fs=require('fs');
const html=fs.readFileSync('captacao.html','utf8');
for(const token of ['id="kBrinde"','id="kCpc"','CUSTO BRINDES','CUSTO / CASAL','Qtd.','Custo unit.','Custo total']){
  if(!html.includes(token)) throw new Error(`Métrica de brindes ausente: ${token}`);
}
console.log('Captação gift efficiency contract OK');
