const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Banco de Dados SQLite
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    createTables();
  }
});

// Função para criar tabelas
function createTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS gf_usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      telefone TEXT,
      foto TEXT,
      admin INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gf_sistema_modulo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gf_tela_funcionalidade (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sistema_modulo_id INTEGER,
      FOREIGN KEY (sistema_modulo_id) REFERENCES gf_sistema_modulo(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gf_os (
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
      analise_desenvolvimento TEXT,
      solucao_proposta TEXT,
      FOREIGN KEY (usuario_id) REFERENCES gf_usuarios(id),
      FOREIGN KEY (usuario_responsavel_id) REFERENCES gf_usuarios(id),
      FOREIGN KEY (sistema_modulo_id) REFERENCES gf_sistema_modulo(id),
      FOREIGN KEY (tela_funcionalidade_id) REFERENCES gf_tela_funcionalidade(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gf_os_evidencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      os_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      nome_arquivo TEXT,
      caminho_arquivo TEXT,
      data_upload TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (os_id) REFERENCES gf_os(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS gf_quiz_progresso (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      modulo_id INTEGER NOT NULL,
      acertos INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      data_finalizacao TEXT,
      UNIQUE(usuario_id, modulo_id)
    )`);

    console.log("Tabelas verificadas/criadas com sucesso.");
  });
}

// Configuração do multer
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, '');
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});
const upload = multer({ storage });
const uploadMemory = multer();

// --- Endpoints ---

// Listar todas as OS
app.get('/os', (req, res) => {
  const sql = `
    SELECT gf_os.*, 
           u1.nome AS usuario_nome, 
           u1.foto AS usuario_foto, 
           u2.nome AS responsavel_nome,
           u2.foto AS responsavel_foto
    FROM gf_os
    LEFT JOIN gf_usuarios u1 ON gf_os.usuario_id = u1.id
    LEFT JOIN gf_usuarios u2 ON gf_os.usuario_responsavel_id = u2.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar nova OS
app.post('/os', (req, res) => {
  const {
    titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id,
    cnpj, empresa_solicitante, telefone_solicitante,
    sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria,
    analise_desenvolvimento, solucao_proposta
  } = req.body;

  const sql = `
    INSERT INTO gf_os (titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria, analise_desenvolvimento, solucao_proposta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    titulo, descricao, tipo, status, 
    data_criacao ? new Date(data_criacao).toISOString() : new Date().toISOString(), 
    usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, 
    sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria, analise_desenvolvimento, solucao_proposta
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Atualizar OS
app.put('/os/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante } = req.body;
  
  const sql = `
    UPDATE gf_os SET 
      titulo = ?, descricao = ?, tipo = ?, status = ?, data_criacao = ?, 
      usuario_id = ?, usuario_responsavel_id = ?, cnpj = ?, 
      empresa_solicitante = ?, telefone_solicitante = ?
    WHERE id = ?
  `;
  
  const params = [
    titulo, descricao, tipo, status, 
    data_criacao ? new Date(data_criacao).toISOString() : null, 
    usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, id
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Deletar OS
app.delete('/os/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM gf_os WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Cadastro de usuário
app.post('/usuarios', uploadMemory.single('foto'), async (req, res) => {
  const { nome, email, senha, telefone, admin = 0 } = req.body;
  let fotoBase64 = null;
  if (req.file) {
    fotoBase64 = req.file.buffer.toString('base64');
  }
  
  try {
    const hash = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO gf_usuarios (nome, email, senha, telefone, foto, admin) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [nome, email, hash, telefone, fotoBase64, admin], function(err) {
      if (err) return res.status(400).json({ error: 'Erro ao cadastrar usuário. E-mail pode já existir.' });
      res.json({ id: this.lastID, nome, email, telefone, foto: fotoBase64, admin });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM gf_usuarios WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.json({ error: 'Usuário não encontrado.' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.json({ error: 'Senha incorreta.' });

    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      foto: user.foto || null,
      admin: user.admin
    });
  });
});

// Editar usuário
app.put('/usuarios/:id', uploadMemory.single('foto'), (req, res) => {
  const { nome, email, telefone } = req.body;
  let fotoBase64 = req.file ? req.file.buffer.toString('base64') : null;
  const { id } = req.params;

  let sql = 'UPDATE gf_usuarios SET nome=?, email=?, telefone=?';
  let params = [nome, email, telefone];

  if (fotoBase64) {
    sql += ', foto=?';
    params.push(fotoBase64);
  }
  sql += ' WHERE id=?';
  params.push(id);

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    
    db.get('SELECT id, nome, email, telefone, foto, admin FROM gf_usuarios WHERE id=?', [id], (err, row) => {
      res.json(row);
    });
  });
});

// Patch Status OS
app.patch('/os/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run('UPDATE gf_os SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Patch Descrição OS
app.patch('/os/:id/descricao', (req, res) => {
  const { id } = req.params;
  const { descricao, usuario_responsavel_id, analise_desenvolvimento, solucao_proposta } = req.body;
  
  const sql = 'UPDATE gf_os SET descricao = ?, usuario_responsavel_id = ?, analise_desenvolvimento = ?, solucao_proposta = ? WHERE id = ?';
  const params = [descricao, usuario_responsavel_id, analise_desenvolvimento, solucao_proposta, id];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Listar usuários
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM gf_usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Listar módulos
app.get('/sistema_modulo', (req, res) => {
  db.all('SELECT * FROM gf_sistema_modulo', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar módulo
app.post('/sistema_modulo', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  
  db.run('INSERT INTO gf_sistema_modulo (nome) VALUES (?)', [nome], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nome });
  });
});

// Listar funcionalidades
app.get('/tela_funcionalidade', (req, res) => {
  db.all('SELECT * FROM gf_tela_funcionalidade', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cadastrar funcionalidade
app.post('/tela_funcionalidade', (req, res) => {
  const { nome, sistema_modulo_id } = req.body;
  if (!nome || !sistema_modulo_id) return res.status(400).json({ error: 'Nome e módulo são obrigatórios' });
  
  db.run('INSERT INTO gf_tela_funcionalidade (nome, sistema_modulo_id) VALUES (?, ?)', [nome, sistema_modulo_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nome, sistema_modulo_id });
  });
});

// Upload Evidências
app.post('/os/:id/evidencias', upload.single('arquivo'), (req, res) => {
  const os_id = req.params.id;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

  const tipo = file.mimetype.startsWith('image/') ? 'imagem'
              : file.mimetype.startsWith('video/') ? 'video'
              : 'outro';

  const sql = 'INSERT INTO gf_os_evidencias (os_id, tipo, nome_arquivo, caminho_arquivo) VALUES (?, ?, ?, ?)';
  const params = [os_id, tipo, file.originalname, file.filename];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, tipo, nome_arquivo: file.originalname, caminho_arquivo: file.filename });
  });
});

// Listar Evidências
app.get('/os/:id/evidencias', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM gf_os_evidencias WHERE os_id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Deletar Evidência
app.delete('/os/evidencias/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT caminho_arquivo FROM gf_os_evidencias WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Evidência não encontrada' });
    
    const filePath = path.join(uploadDir, row.caminho_arquivo);
    
    fs.unlink(filePath, (err) => {
      db.run('DELETE FROM gf_os_evidencias WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    });
  });
});

// Salvar progresso quiz
app.post('/quiz/progresso', (req, res) => {
  const { usuario_id, modulo_id, acertos, total } = req.body;
  if (!usuario_id || !modulo_id) return res.status(400).json({ error: 'Dados obrigatórios.' });
  
  const data_finalizacao = new Date().toISOString();

  // Upsert logic for SQLite
  const sql = `
    INSERT INTO gf_quiz_progresso (usuario_id, modulo_id, acertos, total, data_finalizacao)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(usuario_id, modulo_id) DO UPDATE SET
      acertos = excluded.acertos,
      total = excluded.total,
      data_finalizacao = excluded.data_finalizacao
  `;

  db.run(sql, [usuario_id, modulo_id, acertos, total, data_finalizacao], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true });
  });
});

// Buscar progresso quiz
app.get('/quiz/progresso', (req, res) => {
  const { usuario_id } = req.query;
  if (!usuario_id) return res.status(400).json({ error: 'usuario_id obrigatório.' });
  
  db.all('SELECT modulo_id, acertos, total, data_finalizacao FROM gf_quiz_progresso WHERE usuario_id = ?', [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Dashboard do Gestor - Dados consolidados
app.get('/dashboard/dados', (req, res) => {
  db.all('SELECT id, nome, email, foto, admin FROM gf_usuarios', [], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all('SELECT * FROM gf_quiz_progresso', [], (err, progress) => {
      if (err) return res.status(500).json({ error: err.message });

      const dashboardData = users.map(user => {
        const userProgress = progress.filter(p => p.usuario_id === user.id);
        
        const totalModulos = 6;
        const modulosConcluidos = userProgress.length;
        const progressoGeral = Math.min(Math.round((modulosConcluidos / totalModulos) * 100), 100);
        
        let totalAcertos = 0;
        let totalQuestoes = 0;
        
        userProgress.forEach(p => {
          totalAcertos += p.acertos;
          totalQuestoes += p.total;
        });

        const mediaNotas = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

        return {
          ...user,
          progresso: progressoGeral,
          media: mediaNotas,
          modulos_concluidos: modulosConcluidos,
          detalhes_modulos: userProgress
        };
      });

      res.json(dashboardData);
    });
  });
});

// Alterar permissão de admin
app.patch('/usuarios/:id/admin', (req, res) => {
  const { id } = req.params;
  const { admin, senhaMestra } = req.body;

  const SENHA_MESTRA_SISTEMA = 'admin123'; 

  if (senhaMestra !== SENHA_MESTRA_SISTEMA) {
    return res.status(403).json({ error: 'Senha mestra incorreta.' });
  }

  db.run('UPDATE gf_usuarios SET admin = ? WHERE id = ?', [admin, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.use('/uploads', express.static(uploadDir));

cron.schedule('35 14 * * 1-5', () => {
  console.log('Executando rotina diária às 14:35');
});

app.listen(3002, '0.0.0.0', () => console.log('API SQLite rodando em http://0.0.0.0:3002'));
