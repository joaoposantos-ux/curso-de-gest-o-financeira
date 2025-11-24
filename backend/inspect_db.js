const sql = require('mssql');

const config = {
  user: 'DB_A25210_firstservico_admin',
  password: '123mudar!@#',
  server: 'sql5046.site4now.net',
  database: 'DB_A25210_firstservico',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

async function inspect() {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'usuarios'");
    console.log(result.recordset);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

inspect();
