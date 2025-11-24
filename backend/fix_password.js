const sql = require('mssql');
const bcrypt = require('bcryptjs');

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

async function fixPassword() {
  try {
    await sql.connect(sqlConfig);
    console.log("✅ Conectado ao SQL Server!");

    const email = 'jo474888@gmail.com';
    const novaSenha = 'joaopedr1@';
    
    console.log(`🔒 Criptografando senha para: ${email}`);
    const hash = await bcrypt.hash(novaSenha, 10);
    console.log(`🔑 Novo Hash gerado: ${hash}`);

    await sql.query(`UPDATE gf_usuarios SET senha = '${hash}' WHERE email = '${email}'`);
    
    console.log("✅ Senha atualizada com sucesso!");

  } catch (err) {
    console.error("Erro:", err);
  } finally {
    sql.close();
  }
}

fixPassword();
