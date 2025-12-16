const express = require('express');
const router = express.Router();

const reservationsController = require('../controllers/reservationsController');

router.get('/', reservationsController.listarTodas);
router.post('/', reservationsController.criar);
router.patch('/:id/status', reservationsController.atualizarStatus);
router.delete('/:id', reservationsController.deletar);

module.exports = router;
