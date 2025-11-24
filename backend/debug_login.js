const sql = require('mssql');

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

async function debugUsers() {
  try {
    await sql.connect(sqlConfig);
    console.log("✅ Conectado ao SQL Server!");

    const result = await sql.query("SELECT id, nome, email, senha FROM gf_usuarios");
    
    console.log("\n📋 Usuários e Hashes de Senha:");
    result.recordset.forEach(u => {
      console.log(`ID: ${u.id} | Email: ${u.email}`);
      console.log(`Hash: ${u.senha}`);
      console.log(`Hash parece válido (bcrypt)? ${u.senha.startsWith('$2') ? 'SIM' : 'NÃO'}`);
      console.log('---');
    });

  } catch (err) {
    console.error("Erro:", err);
  } finally {
    sql.close();
  }
}

debugUsers();
