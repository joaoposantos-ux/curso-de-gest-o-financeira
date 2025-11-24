const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./os.db');

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS os (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  descricao TEXT,
  tipo TEXT,
  status TEXT,
  usuario_id INTEGER,
  data_criacao TEXT,
  cnpj TEXT,
  empresa_solicitante TEXT,
  telefone_solicitante TEXT,
  usuario_responsavel_id INTEGER,
  sistema_modulo_id INTEGER,
  tela_funcionalidade_id INTEGER,
  solucao_provisoria TEXT,
  analise_desenvolvimento TEXT,   -- NOVO
  solucao_proposta TEXT,          -- NOVO
  FOREIGN KEY (usuario_responsavel_id) REFERENCES usuarios(id),
  FOREIGN KEY (sistema_modulo_id) REFERENCES sistema_modulo(id),
  FOREIGN KEY (tela_funcionalidade_id) REFERENCES tela_funcionalidade(id)
)`);


// Crie a tabela de usuários se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT,
  telefone TEXT,
  foto TEXT,
  admin INTEGER DEFAULT 0
)`);

// Crie a tabela de módulos do sistema se não existir
db.run(`CREATE TABLE IF NOT EXISTS sistema_modulo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
)`);

// Crie a tabela de telas/funcionalidades se não existir
db.run(`CREATE TABLE IF NOT EXISTS tela_funcionalidade (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  sistema_modulo_id INTEGER,
  FOREIGN KEY (sistema_modulo_id) REFERENCES sistema_modulo(id)
)`);

// 1. Crie a tabela de evidências (imagens e vídeos) relacionadas à OS
db.run(`CREATE TABLE IF NOT EXISTS os_evidencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  os_id INTEGER NOT NULL,
  tipo TEXT NOT NULL, -- 'imagem' ou 'video'
  nome_arquivo TEXT,
  caminho_arquivo TEXT,
  data_upload TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (os_id) REFERENCES os(id)
)`);

// 3. Configuração do multer para salvar arquivos em /uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      ('0' + now.getDate()).slice(-2) + '_' +
      ('0' + now.getHours()).slice(-2) +
      ('0' + now.getMinutes()).slice(-2) +
      ('0' + now.getSeconds()).slice(-2);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});
const upload = multer({ storage });
const uploadMemory = multer(); // memoryStorage por padrão

// Listar todas as OS com nome do usuário
app.get('/os', (req, res) => {
  db.all(
    `SELECT os.*, 
            u1.nome AS usuario_nome, 
            u1.foto AS usuario_foto, 
            u2.nome AS responsavel_nome,
            u2.foto AS responsavel_foto
     FROM os
     LEFT JOIN usuarios u1 ON os.usuario_id = u1.id
     LEFT JOIN usuarios u2 ON os.usuario_responsavel_id = u2.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Criar nova OS
app.post('/os', (req, res) => {
  const {
    titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id,
    cnpj, empresa_solicitante, telefone_solicitante,
    sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria,
    analise_desenvolvimento, solucao_proposta // NOVOS CAMPOS
  } = req.body;

  db.run(
    `INSERT INTO os (titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria, analise_desenvolvimento, solucao_proposta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria, analise_desenvolvimento, solucao_proposta],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar OS
app.put('/os/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, sistema_modulo, tela_funcionalidade, solucao_provisoria } = req.body;
  db.run(
    `UPDATE os SET 
      titulo = ?, 
      descricao = ?, 
      tipo = ?, 
      status = ?, 
      data_criacao = ?, 
      usuario_id = ?, 
      usuario_responsavel_id = ?, 
      cnpj = ?, 
      empresa_solicitante = ?, 
      telefone_solicitante = ?
    WHERE id = ?`,
    [titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Deletar OS por ID
app.delete('/os/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM os WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Cadastro de usuário
app.post('/usuarios', uploadMemory.single('foto'), async (req, res) => {
  const { nome, email, senha, telefone, admin = 0 } = req.body;
  let fotoBase64 = null;
  let fotoMime = null;
  if (req.file) {
    fotoBase64 = req.file.buffer.toString('base64');
    fotoMime = req.file.mimetype; // Ex: 'image/png' ou 'image/jpeg'
  }
  const hash = await bcrypt.hash(senha, 10);
  db.run(
    'INSERT INTO usuarios (nome, email, senha, telefone, foto, admin) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, email, hash, telefone, fotoBase64, admin],
    function (err) {
      if (err) return res.status(400).json({ error: 'E-mail já cadastrado.' });
      res.json({ id: this.lastID, nome, email, telefone, foto: fotoBase64, admin });
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.json({ error: 'Usuário não encontrado.' });
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.json({ error: 'Senha incorreta.' });
    // Inclua o campo foto na resposta!
    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      foto: user.foto || null, // <-- importante!
        admin: user.admin
    });
  });
});

// Editar usuário (dados e foto)
app.put('/usuarios/:id', uploadMemory.single('foto'), (req, res) => {
  const { nome, email, telefone } = req.body;
  let fotoBase64 = req.file ? req.file.buffer.toString('base64') : null;

  let sql, params;
  if (fotoBase64) {
    sql = 'UPDATE usuarios SET nome=?, email=?, telefone=?, foto=? WHERE id=?';
    params = [nome, email, telefone, fotoBase64, req.params.id];
  } else {
    sql = 'UPDATE usuarios SET nome=?, email=?, telefone=? WHERE id=?';
    params = [nome, email, telefone, req.params.id];
  }

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });

    db.get('SELECT id, nome, email, telefone, foto, admin FROM usuarios WHERE id=?', [req.params.id], (err, user) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
      res.json(user);
    });
  });
});

app.patch('/os/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run(
    'UPDATE os SET status = ? WHERE id = ?',
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.patch('/os/:id/descricao', (req, res) => {
  const { id } = req.params;
  const {
    descricao,
    usuario_responsavel_id,
    analise_desenvolvimento,   // NOVO
    solucao_proposta           // NOVO
  } = req.body;

  db.run(
    'UPDATE os SET descricao = ?, usuario_responsavel_id = ?, analise_desenvolvimento = ?, solucao_proposta = ? WHERE id = ?',
    [descricao, usuario_responsavel_id, analise_desenvolvimento, solucao_proposta, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});



app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar módulos do sistema
app.get('/sistema_modulo', (req, res) => {
  db.all('SELECT * FROM sistema_modulo', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar novo módulo do sistema
app.post('/sistema_modulo', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  db.run('INSERT INTO sistema_modulo (nome) VALUES (?)', [nome], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nome });
  });
});

// Listar funcionalidades
app.get('/tela_funcionalidade', (req, res) => {
  db.all('SELECT * FROM tela_funcionalidade', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar nova funcionalidade
app.post('/tela_funcionalidade', (req, res) => {
  const { nome, sistema_modulo_id } = req.body;
  if (!nome || !sistema_modulo_id) return res.status(400).json({ error: 'Nome e módulo são obrigatórios' });
  db.run(
    'INSERT INTO tela_funcionalidade (nome, sistema_modulo_id) VALUES (?, ?)',
    [nome, sistema_modulo_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nome, sistema_modulo_id });
    }
  );
});

// 4. Endpoint para upload de evidências (imagem ou vídeo)
app.post('/os/:id/evidencias', upload.single('arquivo'), (req, res) => {
  const os_id = req.params.id;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

  const tipo = file.mimetype.startsWith('image/') ? 'imagem'
              : file.mimetype.startsWith('video/') ? 'video'
              : 'outro';

  db.run(
    `INSERT INTO os_evidencias (os_id, tipo, nome_arquivo, caminho_arquivo) VALUES (?, ?, ?, ?)`,
    [os_id, tipo, file.originalname, file.filename],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, tipo, nome_arquivo: file.originalname, caminho_arquivo: file.filename });
    }
  );
});

// 5. Endpoint para listar evidências de uma OS
app.get('/os/:id/evidencias', (req, res) => {
  db.all('SELECT * FROM os_evidencias WHERE os_id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Tabela e endpoints para progresso de quizzes por usuário e módulo
db.run(`CREATE TABLE IF NOT EXISTS quiz_progresso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  modulo_id INTEGER NOT NULL,
  acertos INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  data_finalizacao TEXT,
  UNIQUE(usuario_id, modulo_id)
)`);

// Salvar/atualizar progresso do quiz
app.post('/quiz/progresso', (req, res) => {
  const { usuario_id, modulo_id, acertos, total } = req.body;
  if (!usuario_id || !modulo_id) return res.status(400).json({ error: 'Dados obrigatórios.' });
  const data_finalizacao = new Date().toISOString();
  db.run(
    `INSERT INTO quiz_progresso (usuario_id, modulo_id, acertos, total, data_finalizacao)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(usuario_id, modulo_id) DO UPDATE SET acertos=excluded.acertos, total=excluded.total, data_finalizacao=excluded.data_finalizacao`,
    [usuario_id, modulo_id, acertos, total, data_finalizacao],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

// Buscar progresso do quiz por usuário
app.get('/quiz/progresso', (req, res) => {
  const { usuario_id } = req.query;
  if (!usuario_id) return res.status(400).json({ error: 'usuario_id obrigatório.' });
  db.all(
    `SELECT modulo_id, acertos, total, data_finalizacao FROM quiz_progresso WHERE usuario_id = ?`,
    [usuario_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 6. Endpoint para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(uploadDir));

// 7. (Opcional) Endpoint para deletar uma evidência
app.delete('/os/evidencias/:id', (req, res) => {
  db.get('SELECT caminho_arquivo FROM os_evidencias WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Evidência não encontrada' });
    const filePath = path.join(uploadDir, row.caminho_arquivo);
    fs.unlink(filePath, () => {
      db.run('DELETE FROM os_evidencias WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  });
});

// Agendar para rodar todo dia às 14:35
cron.schedule('35 14 * * 1-5', () => {
  // Chame aqui o método que você deseja executar diariamente às 14:35
  console.log('Executando rotina diária às 14:35');
  // Exemplo: atualizarStatusOS();
});

app.listen(3001, '0.0.0.0', () => console.log('API rodando em http://0.0.0.0:3001'));