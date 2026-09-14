const fs=require('fs');
const app=fs.readFileSync('captacao.html','utf8');
const required=[
  'id="perfisBody"',
  'function addPerfilCasal()',
  'function updatePerfilCasal(',
  'function removePerfilCasal(',
  'function renderPerfisCasais()',
  "perfisCasais:[]",
  '<th>Status</th><th>Profissão</th><th>Renda</th><th>Cidade</th><th>Carro</th><th>Observações</th>'
];
for(const token of required){
  if(!app.includes(token)) throw new Error(`Perfil estruturado de casais ausente: ${token}`);
}
console.log('Captação structured couple profiles contract OK');
