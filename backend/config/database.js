// Importa o módulo mysql2 com suporte a Promises
const mysql = require('mysql2/promise');

// Importa o dotenv para ler variáveis do arquivo .env
require('dotenv').config();

// Cria um pool de conexões com o MySQL
// Pool = várias conexões reutilizáveis (mais eficiente)
const pool = mysql.createPool({
    host: process.env.DB_HOST,           // localhost
    user: process.env.DB_USER,           // root
    password: process.env.DB_PASSWORD,   // sua senha
    database: process.env.DB_NAME,       // sistema_receitas
    port: process.env.DB_PORT,           // 3306
    waitForConnections: true,
    connectionLimit: 10,                 // Máximo de 10 conexões simultâneas
    queueLimit: 0
});

// Função para testar a conexão
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL com sucesso!');
        connection.release(); // Libera a conexão de volta para o pool
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:', error.message);
        process.exit(1); // Encerra o aplicativo se não conseguir conectar
    }
}

// Exporta o pool para ser usado em outros arquivos
module.exports = { pool, testConnection };