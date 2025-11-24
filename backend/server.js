const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do SQL Server
const sqlConfig = {
  user: 'DB_A25210_firstservico_admin', 
  password: '123mudar!@#', 
  server: 'sql5046.site4now.net', 
  database: 'DB_A25210_firstservico', 
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Conectar ao banco e criar tabelas
sql.connect(sqlConfig).then(pool => {
  if (pool.connected) console.log("Conectado ao SQL Server");

  const createTables = async () => {
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_usuarios' and xtype='U')
        CREATE TABLE gf_usuarios (
          id INT IDENTITY(1,1) PRIMARY KEY,
          nome NVARCHAR(100),
          email NVARCHAR(100) UNIQUE,
          senha NVARCHAR(255),
          telefone NVARCHAR(20),
          foto NVARCHAR(MAX),
          admin BIT DEFAULT 0
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_sistema_modulo' and xtype='U')
        CREATE TABLE gf_sistema_modulo (
          id INT IDENTITY(1,1) PRIMARY KEY,
          nome NVARCHAR(100) NOT NULL
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_tela_funcionalidade' and xtype='U')
        CREATE TABLE gf_tela_funcionalidade (
          id INT IDENTITY(1,1) PRIMARY KEY,
          nome NVARCHAR(100) NOT NULL,
          sistema_modulo_id INT,
          FOREIGN KEY (sistema_modulo_id) REFERENCES gf_sistema_modulo(id)
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_os' and xtype='U')
        CREATE TABLE gf_os (
          id INT IDENTITY(1,1) PRIMARY KEY,
          titulo NVARCHAR(255),
          descricao NVARCHAR(MAX),
          tipo NVARCHAR(50),
          status NVARCHAR(50),
          usuario_id INT,
          data_criacao DATETIME,
          cnpj NVARCHAR(20),
          empresa_solicitante NVARCHAR(100),
          telefone_solicitante NVARCHAR(20),
          usuario_responsavel_id INT,
          sistema_modulo_id INT,
          tela_funcionalidade_id INT,
          solucao_provisoria NVARCHAR(MAX),
          analise_desenvolvimento NVARCHAR(MAX),
          solucao_proposta NVARCHAR(MAX),
          FOREIGN KEY (usuario_id) REFERENCES gf_usuarios(id),
          FOREIGN KEY (usuario_responsavel_id) REFERENCES gf_usuarios(id),
          FOREIGN KEY (sistema_modulo_id) REFERENCES gf_sistema_modulo(id),
          FOREIGN KEY (tela_funcionalidade_id) REFERENCES gf_tela_funcionalidade(id)
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_os_evidencias' and xtype='U')
        CREATE TABLE gf_os_evidencias (
          id INT IDENTITY(1,1) PRIMARY KEY,
          os_id INT NOT NULL,
          tipo NVARCHAR(50) NOT NULL,
          nome_arquivo NVARCHAR(255),
          caminho_arquivo NVARCHAR(255),
          data_upload DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (os_id) REFERENCES gf_os(id)
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='gf_quiz_progresso' and xtype='U')
        CREATE TABLE gf_quiz_progresso (
          id INT IDENTITY(1,1) PRIMARY KEY,
          usuario_id INT NOT NULL,
          modulo_id INT NOT NULL,
          acertos INT DEFAULT 0,
          total INT DEFAULT 0,
          data_finalizacao DATETIME,
          CONSTRAINT UQ_Quiz_Progresso UNIQUE(usuario_id, modulo_id)
        );
      `);
      
      console.log("Tabelas verificadas/criadas com sucesso.");
    } catch (err) {
      console.error("Erro ao criar tabelas:", err);
    }
  };

  createTables();
}).catch(err => console.error('Erro na conexão SQL Server:', err));

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
app.get('/os', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(`
      SELECT gf_os.*, 
             u1.nome AS usuario_nome, 
             u1.foto AS usuario_foto, 
             u2.nome AS responsavel_nome,
             u2.foto AS responsavel_foto
      FROM gf_os
      LEFT JOIN gf_usuarios u1 ON gf_os.usuario_id = u1.id
      LEFT JOIN gf_usuarios u2 ON gf_os.usuario_responsavel_id = u2.id
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar nova OS
app.post('/os', async (req, res) => {
  const {
    titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id,
    cnpj, empresa_solicitante, telefone_solicitante,
    sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria,
    analise_desenvolvimento, solucao_proposta
  } = req.body;

  try {
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('titulo', sql.NVarChar, titulo);
    request.input('descricao', sql.NVarChar, descricao);
    request.input('tipo', sql.NVarChar, tipo);
    request.input('status', sql.NVarChar, status);
    request.input('data_criacao', sql.DateTime, data_criacao ? new Date(data_criacao) : new Date());
    request.input('usuario_id', sql.Int, usuario_id);
    request.input('usuario_responsavel_id', sql.Int, usuario_responsavel_id);
    request.input('cnpj', sql.NVarChar, cnpj);
    request.input('empresa_solicitante', sql.NVarChar, empresa_solicitante);
    request.input('telefone_solicitante', sql.NVarChar, telefone_solicitante);
    request.input('sistema_modulo_id', sql.Int, sistema_modulo_id);
    request.input('tela_funcionalidade_id', sql.Int, tela_funcionalidade_id);
    request.input('solucao_provisoria', sql.NVarChar, solucao_provisoria);
    request.input('analise_desenvolvimento', sql.NVarChar, analise_desenvolvimento);
    request.input('solucao_proposta', sql.NVarChar, solucao_proposta);

    const result = await request.query(`
      INSERT INTO gf_os (titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante, sistema_modulo_id, tela_funcionalidade_id, solucao_provisoria, analise_desenvolvimento, solucao_proposta)
      OUTPUT INSERTED.id
      VALUES (@titulo, @descricao, @tipo, @status, @data_criacao, @usuario_id, @usuario_responsavel_id, @cnpj, @empresa_solicitante, @telefone_solicitante, @sistema_modulo_id, @tela_funcionalidade_id, @solucao_provisoria, @analise_desenvolvimento, @solucao_proposta)
    `);
    
    res.json({ id: result.recordset[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar OS
app.put('/os/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, status, data_criacao, usuario_id, usuario_responsavel_id, cnpj, empresa_solicitante, telefone_solicitante } = req.body;
  
  try {
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('titulo', sql.NVarChar, titulo);
    request.input('descricao', sql.NVarChar, descricao);
    request.input('tipo', sql.NVarChar, tipo);
    request.input('status', sql.NVarChar, status);
    request.input('data_criacao', sql.DateTime, data_criacao ? new Date(data_criacao) : null);
    request.input('usuario_id', sql.Int, usuario_id);
    request.input('usuario_responsavel_id', sql.Int, usuario_responsavel_id);
    request.input('cnpj', sql.NVarChar, cnpj);
    request.input('empresa_solicitante', sql.NVarChar, empresa_solicitante);
    request.input('telefone_solicitante', sql.NVarChar, telefone_solicitante);

    await request.query(`
      UPDATE gf_os SET 
        titulo = @titulo, 
        descricao = @descricao, 
        tipo = @tipo, 
        status = @status, 
        data_criacao = @data_criacao, 
        usuario_id = @usuario_id, 
        usuario_responsavel_id = @usuario_responsavel_id, 
        cnpj = @cnpj, 
        empresa_solicitante = @empresa_solicitante, 
        telefone_solicitante = @telefone_solicitante
      WHERE id = @id
    `);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar OS
app.delete('/os/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request().input('id', sql.Int, id).query('DELETE FROM gf_os WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('nome', sql.NVarChar, nome);
    request.input('email', sql.NVarChar, email);
    request.input('senha', sql.NVarChar, hash);
    request.input('telefone', sql.NVarChar, telefone);
    request.input('foto', sql.NVarChar, fotoBase64);
    request.input('admin', sql.Bit, admin);

    const result = await request.query(`
      INSERT INTO gf_usuarios (nome, email, senha, telefone, foto, admin) 
      OUTPUT INSERTED.id
      VALUES (@nome, @email, @senha, @telefone, @foto, @admin)
    `);
    
    res.json({ id: result.recordset[0].id, nome, email, telefone, foto: fotoBase64, admin });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao cadastrar usuário. E-mail pode já existir.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM gf_usuarios WHERE email = @email');
    
    const user = result.recordset[0];
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar usuário
app.put('/usuarios/:id', uploadMemory.single('foto'), async (req, res) => {
  const { nome, email, telefone } = req.body;
  let fotoBase64 = req.file ? req.file.buffer.toString('base64') : null;
  const { id } = req.params;

  try {
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('nome', sql.NVarChar, nome);
    request.input('email', sql.NVarChar, email);
    request.input('telefone', sql.NVarChar, telefone);

    let sqlQuery = 'UPDATE gf_usuarios SET nome=@nome, email=@email, telefone=@telefone';
    if (fotoBase64) {
      request.input('foto', sql.NVarChar, fotoBase64);
      sqlQuery += ', foto=@foto';
    }
    sqlQuery += ' WHERE id=@id';

    await request.query(sqlQuery);

    const userResult = await pool.request().input('id', sql.Int, id).query('SELECT id, nome, email, telefone, foto, admin FROM gf_usuarios WHERE id=@id');
    res.json(userResult.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

// Patch Status OS
app.patch('/os/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, status)
      .query('UPDATE gf_os SET status = @status WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patch Descrição OS
app.patch('/os/:id/descricao', async (req, res) => {
  const { id } = req.params;
  const { descricao, usuario_responsavel_id, analise_desenvolvimento, solucao_proposta } = req.body;
  try {
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('descricao', sql.NVarChar, descricao);
    request.input('usuario_responsavel_id', sql.Int, usuario_responsavel_id);
    request.input('analise_desenvolvimento', sql.NVarChar, analise_desenvolvimento);
    request.input('solucao_proposta', sql.NVarChar, solucao_proposta);

    await request.query('UPDATE gf_os SET descricao = @descricao, usuario_responsavel_id = @usuario_responsavel_id, analise_desenvolvimento = @analise_desenvolvimento, solucao_proposta = @solucao_proposta WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query('SELECT * FROM gf_usuarios');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar módulos
app.get('/sistema_modulo', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query('SELECT * FROM gf_sistema_modulo');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastrar módulo
app.post('/sistema_modulo', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .query('INSERT INTO gf_sistema_modulo (nome) OUTPUT INSERTED.id VALUES (@nome)');
    res.json({ id: result.recordset[0].id, nome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar funcionalidades
app.get('/tela_funcionalidade', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query('SELECT * FROM gf_tela_funcionalidade');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastrar funcionalidade
app.post('/tela_funcionalidade', async (req, res) => {
  const { nome, sistema_modulo_id } = req.body;
  if (!nome || !sistema_modulo_id) return res.status(400).json({ error: 'Nome e módulo são obrigatórios' });
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .input('sistema_modulo_id', sql.Int, sistema_modulo_id)
      .query('INSERT INTO gf_tela_funcionalidade (nome, sistema_modulo_id) OUTPUT INSERTED.id VALUES (@nome, @sistema_modulo_id)');
    res.json({ id: result.recordset[0].id, nome, sistema_modulo_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Evidências
app.post('/os/:id/evidencias', upload.single('arquivo'), async (req, res) => {
  const os_id = req.params.id;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Arquivo não enviado' });

  const tipo = file.mimetype.startsWith('image/') ? 'imagem'
              : file.mimetype.startsWith('video/') ? 'video'
              : 'outro';

  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('os_id', sql.Int, os_id)
      .input('tipo', sql.NVarChar, tipo)
      .input('nome_arquivo', sql.NVarChar, file.originalname)
      .input('caminho_arquivo', sql.NVarChar, file.filename)
      .query('INSERT INTO gf_os_evidencias (os_id, tipo, nome_arquivo, caminho_arquivo) OUTPUT INSERTED.id VALUES (@os_id, @tipo, @nome_arquivo, @caminho_arquivo)');
    
    res.json({ id: result.recordset[0].id, tipo, nome_arquivo: file.originalname, caminho_arquivo: file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar Evidências
app.get('/os/:id/evidencias', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('os_id', sql.Int, id)
      .query('SELECT * FROM gf_os_evidencias WHERE os_id = @os_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar Evidência
app.delete('/os/evidencias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().input('id', sql.Int, id).query('SELECT caminho_arquivo FROM gf_os_evidencias WHERE id = @id');
    
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Evidência não encontrada' });
    
    const filePath = path.join(uploadDir, result.recordset[0].caminho_arquivo);
    
    // Tenta deletar arquivo físico
    fs.unlink(filePath, async (err) => {
      // Mesmo se der erro no arquivo (ex: não existe), deleta do banco
      await pool.request().input('id', sql.Int, id).query('DELETE FROM gf_os_evidencias WHERE id = @id');
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salvar progresso quiz
app.post('/quiz/progresso', async (req, res) => {
  const { usuario_id, modulo_id, acertos, total } = req.body;
  if (!usuario_id || !modulo_id) return res.status(400).json({ error: 'Dados obrigatórios.' });
  
  try {
    const pool = await sql.connect(sqlConfig);
    const request = pool.request();
    request.input('usuario_id', sql.Int, usuario_id);
    request.input('modulo_id', sql.Int, modulo_id);
    request.input('acertos', sql.Int, acertos);
    request.input('total', sql.Int, total);
    request.input('data_finalizacao', sql.DateTime, new Date());

    // Merge (Upsert) logic for SQL Server
    await request.query(`
      MERGE gf_quiz_progresso AS target
      USING (SELECT @usuario_id AS usuario_id, @modulo_id AS modulo_id) AS source
      ON (target.usuario_id = source.usuario_id AND target.modulo_id = source.modulo_id)
      WHEN MATCHED THEN
        UPDATE SET acertos = @acertos, total = @total, data_finalizacao = @data_finalizacao
      WHEN NOT MATCHED THEN
        INSERT (usuario_id, modulo_id, acertos, total, data_finalizacao)
        VALUES (@usuario_id, @modulo_id, @acertos, @total, @data_finalizacao);
    `);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar progresso quiz
app.get('/quiz/progresso', async (req, res) => {
  const { usuario_id } = req.query;
  if (!usuario_id) return res.status(400).json({ error: 'usuario_id obrigatório.' });
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input('usuario_id', sql.Int, usuario_id)
      .query('SELECT modulo_id, acertos, total, data_finalizacao FROM gf_quiz_progresso WHERE usuario_id = @usuario_id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard do Gestor - Dados consolidados
app.get('/dashboard/dados', async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    
    // Buscar todos os usuários (exceto admins se quiser filtrar, mas vamos trazer todos)
    const usersResult = await pool.request().query('SELECT id, nome, email, foto, admin FROM gf_usuarios');
    const users = usersResult.recordset;

    // Buscar todo o progresso
    const progressResult = await pool.request().query('SELECT * FROM gf_quiz_progresso');
    const progress = progressResult.recordset;

    // Processar dados
    const dashboardData = users.map(user => {
      const userProgress = progress.filter(p => p.usuario_id === user.id);
      
      const totalModulos = 6; // Assumindo 6 módulos fixos do curso
      const modulosConcluidos = userProgress.length;
      // Limitar a 100%
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alterar permissão de admin (Requer senha mestra)
app.patch('/usuarios/:id/admin', async (req, res) => {
  const { id } = req.params;
  const { admin, senhaMestra } = req.body;

  // Senha mestra fixa para segurança simples
  const SENHA_MESTRA_SISTEMA = 'admin123'; 

  if (senhaMestra !== SENHA_MESTRA_SISTEMA) {
    return res.status(403).json({ error: 'Senha mestra incorreta.' });
  }

  try {
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('admin', sql.Bit, admin)
      .query('UPDATE gf_usuarios SET admin = @admin WHERE id = @id');
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/uploads', express.static(uploadDir));

cron.schedule('35 14 * * 1-5', () => {
  console.log('Executando rotina diária às 14:35');
});

app.listen(3002, '0.0.0.0', () => console.log('API SQL Server rodando em http://0.0.0.0:3002'));
