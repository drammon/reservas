// ============================================
// IMPORTAÇÕES
// ============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa a configuração do banco de dados
const { testConnection } = require('./config/database');

// ============================================
// CONFIGURAÇÃO DO EXPRESS
// ============================================

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARES
// ============================================

// CORS: Permite que o frontend (React) acesse o backend
app.use(cors());

// Permite que o Express entenda JSON no body das requisições
app.use(express.json());

// Permite que o Express entenda dados de formulários
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROTAS
// ============================================

// Rota de teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.json({
        message: 'API do Sistema de Reservas está rodando! 🍳',
        version: '1.0.0',
        endpoints: {
            customers: '/api/customers',
            reservations: '/api/reservations',
            tables: '/api/tables'

        }
    });
});

// Rota para testar a conexão com o banco de dados
app.get('/api/test-db', async (req, res) => {
    try {
        const { pool } = require('./config/database');
        const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
        res.json({
            message: 'Conexão com o banco de dados OK!',
            resultado: rows[0].resultado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erro ao conectar com o banco de dados',
            error: error.message
        });
    }
});

// ============================================
// AQUI VIRÃO AS ROTAS DE INGREDIENTES E RECEITAS
// (serão adicionadas nos próximos módulos)
// ============================================


// Importação das rotas
const customersRoutes = require('./routes/customers');

// Registro das rotas
app.use('/api/customers', customersRoutes);

// app.use('/api/ingredientes', ingredientesRoutes);
// app.use('/api/receitas', receitasRoutes);


const tablesRoutes = require('./routes/tables');

app.use('/api/tables', tablesRoutes);
// ============================================
// TRATAMENTO DE ERROS
// ============================================

// Rota 404 - Não encontrado
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.url} não existe`
    });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: err.message
    });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

async function startServer() {
    try {
        // Testa a conexão com o banco antes de iniciar
        await testConnection();
        
        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📡 Acesse: http://localhost:${PORT}`);
            console.log(`📊 Teste o banco: http://localhost:${PORT}/api/test-db\n`);
        });
    } catch (error) {
        console.error('❌ Falha ao iniciar o servidor:', error.message);
        process.exit(1);
    }
}

// Inicia o servidor
startServer();