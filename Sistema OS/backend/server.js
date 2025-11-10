const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const http = require('http');
const { Server } = require('socket.io');
const sql = require('mssql'); // Adicione este import no topo do arquivo

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

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
    async function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // Atualize a lista de OS e envie para todos via socket.io, se usar
      const novaListaOS = await buscarTodasOS();
      emitirAtualizacaoOS(novaListaOS);
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

// Configuração de conexão com SQL Server  
//data source=sql5046.site4now.net;initial catalog=DB_A25210_firstservico;user id=DB_A25210_firstservico_admin;password=123mudar!@#;
const sqlServerConfig = {
  user: 'DB_A25210_firstservico_admin',
  password: '123mudar!@#',
  server: 'sql5046.site4now.net', // ex: 'localhost' ou '192.168.0.10'
  database: 'DB_A25210_firstservico',
  options: {
    encrypt: false, // true para Azure, false para local
    trustServerCertificate: true // true para conexões locais
  }
};

// Função para consultar dados no SQL Server
async function consultarSqlServer(query, params = []) {
  try {
    // Conecta ao SQL Server
    let pool = await sql.connect(sqlServerConfig);
    let request = pool.request();
    // Adiciona parâmetros, se houver
    params.forEach((p, i) => request.input(`param${i}`, p));
    // Executa a consulta
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Erro ao consultar SQL Server:', err);
    throw err;
  }
}


// 🔥 Socket e tarefas agendadas
cron.schedule('35 14 * * 1-5', () => {
  console.log('Executando rotina diária às 14:35');
});


function buscarTodasOS() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT os.*, 
              u1.nome AS usuario_nome, 
              u2.nome AS responsavel_nome
       FROM os
       LEFT JOIN usuarios u1 ON os.usuario_id = u1.id
       LEFT JOIN usuarios u2 ON os.usuario_responsavel_id = u2.id`,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

// Se ainda não existir, adicione também a função emitirAtualizacaoOS:
function emitirAtualizacaoOS(lista) {
  io.emit('osAtualizada', lista);
}

app.get('/clientes/cnpj/:cnpj', async (req, res) => {
  const cnpj = req.params.cnpj;
  try {
    // Use parâmetro para evitar SQL Injection
    const query = `
      SELECT 
          c.RazaoSocial, 
          c.NomeFantasia, 
          c.Responsavel, 
          c.Cidade,
          ca.DtVencimento,
          ca.Valor
      FROM 
          Clientes c
      LEFT JOIN (
          SELECT TOP 1 
              cr.id_clientes,
              cr.DtVencimento, 
              cr.Valor
          FROM 
              ContasAReceber cr
          INNER JOIN Clientes cli ON cli.id = cr.id_clientes
          WHERE 
              cli.CNPJ = @param0 AND
              cr.Status = 'A' AND 
              cr.DtVencimento < SYSDATETIME()
          ORDER BY 
              cr.DtVencimento ASC
      ) ca ON c.id = ca.id_clientes
      WHERE 
          c.CNPJ = @param0
    `;
    const result = await consultarSqlServer(query, [cnpj]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar clientes no SQL Server' });
  }
});

app.post('/clientes/AttCelular', async (req, res) => {
  const { cnpj, celular } = req.body;
  if (!cnpj || !celular) {
    return res.status(400).json({ error: 'CNPJ e celular são obrigatórios.' });
  }
  try {
    // Use parâmetros para evitar SQL Injection
    const query = `
      UPDATE Clientes 
      SET Celular = @param1 
      WHERE CNPJ = @param0 AND (Celular = '' OR Celular IS NULL)
    `;
    const result = await consultarSqlServer(query, [cnpj, celular]);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar celular no SQL Server' });
  }
});

// 🔥 Inicialização do servidor
server.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
