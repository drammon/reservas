// ============================================
// CONTROLLER DE MESAS (TABLES)
// Sistema de Reservas de Mesas
// ============================================

const { pool } = require('../config/database');

// ============================================
// 1. LISTAR TODAS AS MESAS
// ============================================
exports.listarTodas = async (req, res) => {
    try {
        const [tables] = await pool.query(
            'SELECT * FROM tables ORDER BY table_number'
        );

        res.json({
            success: true,
            total: tables.length,
            data: tables
        });
    } catch (error) {
        console.error('Erro ao listar mesas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar mesas',
            error: error.message
        });
    }
};

// ============================================
// 2. BUSCAR MESA POR ID
// ============================================
exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [tables] = await pool.query(
            'SELECT * FROM tables WHERE id = ?',
            [id]
        );

        if (tables.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Mesa não encontrada'
            });
        }

        res.json({
            success: true,
            data: tables[0]
        });
    } catch (error) {
        console.error('Erro ao buscar mesa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar mesa',
            error: error.message
        });
    }
};

// ============================================
// 3. CRIAR NOVA MESA
// ============================================
exports.criar = async (req, res) => {
    try {
        const { table_number, capacity } = req.body;

        if (!table_number || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Número da mesa e capacidade são obrigatórios'
            });
        }

        const [existente] = await pool.query(
            'SELECT id FROM tables WHERE table_number = ?',
            [table_number]
        );

        if (existente.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Já existe uma mesa com esse número'
            });
        }

        const [result] = await pool.query(
            'INSERT INTO tables (table_number, capacity) VALUES (?, ?)',
            [table_number, capacity]
        );

        const [novaMesa] = await pool.query(
            'SELECT * FROM tables WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Mesa cadastrada com sucesso',
            data: novaMesa[0]
        });
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar mesa',
            error: error.message
        });
    }
};


// ============================================
// 4. ATUALIZAR MESA
// ============================================
exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { table_number, capacity } = req.body;

        if (!table_number || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'Número da mesa e capacidade são obrigatórios'
            });
        }

        await pool.query(
            'UPDATE tables SET table_number = ?, capacity = ? WHERE id = ?',
            [table_number, capacity, id]
        );

        const [mesaAtualizada] = await pool.query(
            'SELECT * FROM tables WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Mesa atualizada com sucesso',
            data: mesaAtualizada[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar mesa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar mesa',
            error: error.message
        });
    }
};


// ============================================
// 5. DELETAR MESA
// ============================================
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a mesa existe
    const [tables] = await pool.query(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );

    if (tables.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mesa não encontrada'
      });
    }

    // 🔥 Verifica APENAS reservas ATIVAS
    const [reservas] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM reservations
       WHERE table_id = ?
       AND status != 'CANCELADA'`,
      [id]
    );

    if (reservas[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: `Mesa possui ${reservas[0].total} reserva(s) ativa(s) e não pode ser removida`
      });
    }

    // 🧹 Remove reservas CANCELADAS (obrigatório por causa da FK)
    await pool.query(
      'DELETE FROM reservations WHERE table_id = ?',
      [id]
    );

    // Remove a mesa
    await pool.query(
      'DELETE FROM tables WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Mesa removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar mesa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar mesa',
      error: error.message
    });
  }
};
