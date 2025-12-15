// ============================================
// ROTAS DE MESAS (TABLES)
// Sistema de Reservas de Mesas
// ============================================

const express = require('express');
const router = express.Router();

const tablesController = require('../controllers/tablesController');

// Listar mesas
router.get('/', tablesController.listarTodas);

// Buscar mesa por ID
router.get('/:id', tablesController.buscarPorId);

// Criar mesa
router.post('/', tablesController.criar);

// Atualizar mesa
router.put('/:id', tablesController.atualizar);

// Deletar mesa
router.delete('/:id', tablesController.deletar);

module.exports = router;
