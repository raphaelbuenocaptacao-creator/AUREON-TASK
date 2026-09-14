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
if(manifest.name!=='Task'||manifest.short_name!=='Task') throw new Error('Nome instalado deve ser Task');
const primaryIcon=manifest.icons?.[0];
if(!primaryIcon||primaryIcon.src!=='icon.svg'||primaryIcon.type!=='image/svg+xml'||primaryIcon.purpose!=='any') throw new Error('Logo oficial icon.svg deve ser o ícone principal de instalação');
if(!manifest.icons.some(i=>i.src==='icon-maskable-512.png'&&String(i.purpose).includes('maskable'))) throw new Error('Ícone maskable deve continuar disponível como fallback Android');
if(!index.includes('rel="manifest"')) throw new Error('Página raiz deve expor o manifesto PWA');
console.log('Task PWA install contract OK');
