// ============================================
// ROTAS DE CLIENTES (CUSTOMERS)
// Sistema de Reservas de Mesas
// ============================================

const express = require('express');
const router = express.Router();

// Importa o controller
const customersController = require('../controllers/customersController');

// ============================================
// ROTAS
// ============================================

// Listar todos os clientes
router.get('/', customersController.listarTodos);

// Buscar cliente por ID
router.get('/:id', customersController.buscarPorId);

// Cadastrar novo cliente
router.post('/', customersController.criar);

// Atualizar cliente
router.put('/:id', customersController.atualizar);

// Deletar cliente
router.delete('/:id', customersController.deletar);

module.exports = router;
