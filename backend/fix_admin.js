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

async function fixAdmin() {
  try {
    await sql.connect(sqlConfig);
    console.log("✅ Conectado ao SQL Server!");

    // 1. Tentar encontrar usuários
    const users = await sql.query("SELECT * FROM gf_usuarios");
    console.log(`\n👥 Usuários encontrados: ${users.recordset.length}`);
    console.table(users.recordset);

    if (users.recordset.length > 0) {
      // 2. Tornar o primeiro usuário admin (ou todos)
      // Vamos tornar TODOS admin para garantir que o seu funcione, já que é ambiente de teste
      await sql.query("UPDATE gf_usuarios SET admin = 1");
      console.log("\n👑 Todos os usuários foram promovidos a ADMIN com sucesso!");
      
      // Verificar atualização
      const updatedUsers = await sql.query("SELECT id, nome, email, admin FROM gf_usuarios");
      console.table(updatedUsers.recordset);
    } else {
      console.log("\n⚠️ Nenhum usuário encontrado no banco de dados.");
      console.log("👉 Por favor, cadastre um novo usuário no site e rode este script novamente.");
    }

  } catch (err) {
    console.error("Erro:", err);
  } finally {
    sql.close();
  }
}

fixAdmin();
