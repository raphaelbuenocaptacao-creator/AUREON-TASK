const fs=require('fs');
const app=fs.readFileSync('app.html','utf8');
const required=[
  'beforeinstallprompt',
  'function installTask()',
  'id="installBtn"',
  'appinstalled',
  "display-mode: standalone"
];
for(const token of required){
  if(!app.includes(token)) throw new Error(`Contrato de instalação PWA ausente: ${token}`);
}
console.log('Task PWA install contract OK');
