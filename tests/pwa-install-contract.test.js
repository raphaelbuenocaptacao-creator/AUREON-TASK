const fs=require('fs');
const app=fs.readFileSync('app.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
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
if(manifest.start_url!=='./app.html') throw new Error('PWA deve iniciar diretamente em app.html');
if(manifest.id!=='./app.html') throw new Error('PWA deve ter id estável em app.html');
if(!index.includes('rel="manifest"')) throw new Error('Página raiz deve expor o manifesto PWA');
console.log('Task PWA install contract OK');
