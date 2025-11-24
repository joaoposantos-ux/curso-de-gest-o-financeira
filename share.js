import localtunnel from 'localtunnel';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function start() {
  console.log('🚀 Iniciando script de compartilhamento...');

  // 1. Iniciar Backend
  console.log('📦 Iniciando Servidor Backend...');
  const backend = spawn('node', ['backend/server.js'], { 
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  backend.stdout.on('data', (data) => {
    // console.log(`[Backend]: ${data}`); // Descomente para ver logs do backend
  });
  backend.stderr.on('data', (data) => {
    console.error(`[Backend Erro]: ${data}`);
  });

  // 2. Criar Túnel Backend
  console.log('🔗 Criando link público para o Backend (Porta 3002)...');
  const backendTunnel = await localtunnel({ port: 3002 });
  console.log(`✅ Backend disponível em: ${backendTunnel.url}`);

  // 3. Atualizar .env
  console.log('📝 Configurando aplicação para usar o novo link...');
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  
  // Atualiza ou adiciona VITE_API_URL
  if (envContent.includes('VITE_API_URL=')) {
    envContent = envContent.replace(/VITE_API_URL=.*/g, `VITE_API_URL=${backendTunnel.url}`);
  } else {
    envContent += `\nVITE_API_URL=${backendTunnel.url}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Configuração atualizada.');

  // 4. Iniciar Frontend
  console.log('🎨 Iniciando Frontend (Site)...');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const frontend = spawn(npmCmd, ['run', 'dev'], { 
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  frontend.stdout.on('data', (data) => {
    // console.log(`[Frontend]: ${data}`); // Descomente para ver logs do frontend
  });
  frontend.stderr.on('data', (data) => {
    // Vite joga info no stderr as vezes, ou erros reais
    // console.error(`[Frontend Info]: ${data}`);
  });

  // Pequena pausa para garantir que o Vite subiu
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 5. Criar Túnel Frontend
  console.log('🔗 Criando link público para o Site (Porta 6300)...');
  const frontendTunnel = await localtunnel({ port: 6300 });
  
  console.log('='.repeat(50));
  console.log(`🎉  SEU PROJETO ESTÁ ONLINE!`);
  console.log('='.repeat(50));
  console.log(`\n👉  COMPARTILHE ESTE LINK: ${frontendTunnel.url}`);
  console.log(`\n⚠️  IMPORTANTE:`);
  console.log(`1. Ao abrir o link, você verá uma tela de aviso do "localtunnel".`);
  console.log(`2. Clique no botão "Click to Continue".`);
  console.log(`3. Se pedir senha/IP, é apenas uma verificação de segurança.`);
  console.log(`   Se precisar do seu IP público, acesse: https://ipv4.icanhazip.com/`);
  console.log(`\n⌨️  Mantenha esta janela aberta. Pressione Ctrl+C para parar.`);

  backendTunnel.on('close', () => {
    console.log('Túnel do Backend fechado.');
  });
  frontendTunnel.on('close', () => {
    console.log('Túnel do Frontend fechado.');
  });

  // Limpeza ao sair
  process.on('SIGINT', () => {
    console.log('\n🛑 Parando servidores...');
    backend.kill();
    frontend.kill();
    backendTunnel.close();
    frontendTunnel.close();
    
    // Restaurar .env para localhost (opcional, mas boa prática)
    console.log('Restaurando configuração local...');
    const currentEnv = fs.readFileSync(envPath, 'utf-8');
    const restoredEnv = currentEnv.replace(/VITE_API_URL=.*/g, `VITE_API_URL=http://localhost:3002`);
    fs.writeFileSync(envPath, restoredEnv);
    
    process.exit();
  });
}

start();
