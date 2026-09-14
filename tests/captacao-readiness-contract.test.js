const fs=require('fs');
const src=fs.readFileSync('captacao-validacao.html','utf8');
const live=fs.readFileSync('captacao.html','utf8');
const required=[
  'PRONTIDÃO DA REUNIÃO',
  'id="readinessScore"',
  'id="readinessList"',
  'function buildReadiness()',
  'Q + NQ',
  'Captadores',
  'Plano de ação',
  'Sem responsável',
  'Sem prazo',
  'Ações vencidas',
  'VGV sem vendas',
  'Qualificação inválida',
  "CAP_ID='captacao-reuniao-v1'"
];
for(const token of required){
  if(!src.includes(token)) throw new Error(`Contrato de prontidão ausente: ${token}`);
}
const liveRequired=[
  'id="kNQ"',
  'NÃO QUALIFICADOS (NQ)',
  'kNQ.textContent=capture.nq||0',
  'id="kConvQ"',
  'CONVERSÃO / Q',
  'const convQ=capture.q?capture.vendas/capture.q*100:0',
  "kConvQ.textContent=convQ.toFixed(1)+'%'",
  'function captureTeamTotals()',
  'function actionHealth()',
  'Equipe reconciliada',
  'Ações sem responsável',
  'Ações vencidas'
];
for(const token of liveRequired){
  if(!live.includes(token)) throw new Error(`Leitura gerencial ao vivo ausente: ${token}`);
}
console.log('Captação meeting readiness contract OK');
