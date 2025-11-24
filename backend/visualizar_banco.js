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

async function visualizar() {
  try {
    await sql.connect(sqlConfig);
    console.log("✅ Conectado ao SQL Server!\n");

    // Listar tabelas do sistema (prefixo gf_)
    const tablesResult = await sql.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME LIKE 'gf_%'
    `);

    const tables = tablesResult.recordset.map(t => t.TABLE_NAME);
    console.log("📋 Tabelas encontradas:", tables.join(", "), "\n");

    for (const table of tables) {
      console.log(`--- Dados da tabela: ${table} ---`);
      const data = await sql.query(`SELECT TOP 5 * FROM ${table}`);
      if (data.recordset.length === 0) {
        console.log("(Vazia)");
      } else {
        console.table(data.recordset);
      }
      console.log("\n");
    }

  } catch (err) {
    console.error("Erro:", err);
  } finally {
    sql.close();
  }
}

visualizar();
