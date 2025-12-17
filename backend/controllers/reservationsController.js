// ============================================
// CONTROLLER DE RESERVAS DE MESAS
// ============================================

const { pool } = require('../config/database');

// ============================================
// 1. LISTAR TODAS AS RESERVAS
// ============================================
exports.listarTodas = async (req, res) => {
    try {
        const [reservas] = await pool.query(`
        SELECT 
        r.id,
        r.reservation_datetime,
        r.status,
        c.name AS customer_name,
        t.table_number AS table_number
      FROM reservations r
      JOIN customers c ON c.id = r.customer_id
      JOIN tables t ON t.id = r.table_id
      ORDER BY r.reservation_datetime DESC
    `);

        res.json({
            success: true,
            total: reservas.length,
            data: reservas
        });
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar reservas',
            error: error.message
        });
    }
};

// ============================================
// 2. CRIAR NOVA RESERVA
// ============================================
exports.criar = async (req, res) => {
    try {
        const { customer_id, table_id, reservation_datetime } = req.body;

        // Validação
        if (!customer_id || !table_id || !reservation_datetime) {
            return res.status(400).json({
                success: false,
                message: 'customer_id, table_id e reservation_datetime são obrigatórios'
            });
        }

        // Verifica cliente
        const [cliente] = await pool.query(
            'SELECT id FROM customers WHERE id = ?',
            [customer_id]
        );

        if (cliente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        // Verifica mesa
        const [mesa] = await pool.query(
            'SELECT id FROM tables WHERE id = ?',
            [table_id]
        );

        if (mesa.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Mesa não encontrada'
            });
        }

        // 🔥 Regra de conflito
        const [conflito] = await pool.query(
            `
            SELECT id FROM reservations
            WHERE table_id = ?
              AND reservation_datetime = ?
              AND status != 'CANCELADA'
            `,
            [table_id, reservation_datetime]
        );

        if (conflito.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Esta mesa já está reservada para este horário'
            });
        }

        // Cria reserva
        const [result] = await pool.query(
            `
            INSERT INTO reservations (customer_id, table_id, reservation_datetime)
            VALUES (?, ?, ?)
            `,
            [customer_id, table_id, reservation_datetime]
        );

        const [novaReserva] = await pool.query(
            'SELECT * FROM reservations WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Reserva criada com sucesso',
            data: novaReserva[0]
        });
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar reserva',
            error: error.message
        });
    }
};

// ============================================
// 3. ATUALIZAR STATUS DA RESERVA
// ============================================
exports.atualizarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = ['PENDENTE', 'CONFIRMADA', 'CANCELADA'];

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }

        const [reserva] = await pool.query(
            'SELECT id FROM reservations WHERE id = ?',
            [id]
        );

        if (reserva.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reserva não encontrada'
            });
        }

        await pool.query(
            'UPDATE reservations SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({
            success: true,
            message: 'Status da reserva atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar status',
            error: error.message
        });
    }
};

// ============================================
// CONFIRMAR RESERVA
// ============================================
exports.confirmar = async (req, res) => {
  try {
    const { id } = req.params;

    const [reserva] = await pool.query(
      'SELECT * FROM reservations WHERE id = ?',
      [id]
    );

    if (reserva.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    if (reserva[0].status === 'CANCELADA') {
      return res.status(400).json({
        success: false,
        message: 'Reserva cancelada não pode ser confirmada'
      });
    }

    await pool.query(
      'UPDATE reservations SET status = "CONFIRMADA" WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Reserva confirmada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao confirmar reserva',
      error: error.message
    });
  }
};


// ============================================
// 4. CANCELAR (DELETAR) RESERVA
// ============================================
exports.deletar = async (req, res) => {
    try {
        const { id } = req.params;

        const [reserva] = await pool.query(
            'SELECT id FROM reservations WHERE id = ?',
            [id]
        );

        if (reserva.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reserva não encontrada'
            });
        }

        // Cancelamento lógico
        await pool.query(
            'UPDATE reservations SET status = "CANCELADA" WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Reserva cancelada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao cancelar reserva',
            error: error.message
        });
    }
};

exports.limparTodas = async (req, res) => {
  try {
    await pool.query('DELETE FROM reservations');

    res.json({
      success: true,
      message: 'Todas as reservas foram removidas'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erro ao limpar reservas'
    });
  }
};
