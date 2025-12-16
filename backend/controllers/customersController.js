// ============================================
// CONTROLLER DE CLIENTES (CUSTOMERS)
// Sistema de Reservas de Mesas
// ============================================

const { pool } = require('../config/database');

// ============================================
// 1. LISTAR TODOS OS CLIENTES
// ============================================

exports.listarTodos = async (req, res) => {
    try {
        // Busca todos os clientes cadastrados
        const [customers] = await pool.query(
            'SELECT * FROM customers ORDER BY name'
        );

        res.json({
            success: true,
            total: customers.length,
            data: customers
        });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar clientes',
            error: error.message
        });
    }
};

// ============================================
// 2. BUSCAR CLIENTE POR ID
// ============================================

exports.buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca cliente pelo ID
        const [customers] = await pool.query(
            'SELECT * FROM customers WHERE id = ?',
            [id]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        res.json({
            success: true,
            data: customers[0]
        });
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cliente',
            error: error.message
        });
    }
};

// ============================================
// 3. CADASTRAR NOVO CLIENTE
// ============================================

exports.criar = async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Validação básica
        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Nome e telefone são obrigatórios'
            });
        }

        // Verifica se já existe cliente com o mesmo nome
        const [existente] = await pool.query(
            'SELECT id FROM customers WHERE name = ?',
            [name]
        );

        if (existente.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Já existe um cliente com este nome'
            });
        }

        // Insere o novo cliente
        const [resultado] = await pool.query(
            'INSERT INTO customers (name, phone) VALUES (?, ?)',
            [name, phone]
        );

        // Busca o cliente recém-criado
        const [novoCliente] = await pool.query(
            'SELECT * FROM customers WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Cliente cadastrado com sucesso',
            data: novoCliente[0]
        });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao cadastrar cliente',
            error: error.message
        });
    }
};

// ============================================
// 4. ATUALIZAR DADOS DO CLIENTE
// ============================================

exports.atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Nome e telefone são obrigatórios'
            });
        }

        // Verifica se o cliente existe
        const [clienteExistente] = await pool.query(
            'SELECT id FROM customers WHERE id = ?',
            [id]
        );

        if (clienteExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cliente não encontrado'
            });
        }

        // Verifica se outro cliente já usa o mesmo nome
        const [nomeEmUso] = await pool.query(
            'SELECT id FROM customers WHERE name = ? AND id != ?',
            [name, id]
        );

        if (nomeEmUso.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Já existe outro cliente com este nome'
            });
        }

        // Atualiza os dados do cliente
        await pool.query(
            'UPDATE customers SET name = ?, phone = ? WHERE id = ?',
            [name, phone, id]
        );

        const [clienteAtualizado] = await pool.query(
            'SELECT * FROM customers WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Cliente atualizado com sucesso',
            data: clienteAtualizado[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar cliente',
            error: error.message
        });
    }
};

// ============================================
// 5. DELETAR CLIENTE
// Regra: cliente não pode ter reservas ativas
// ============================================

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const [customers] = await pool.query(
      'SELECT id FROM customers WHERE id = ?',
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }

    // 🔥 Ignora QUALQUER variação de CANCELADA
    // Verifica se o cliente possui reservas ATIVAS
    const [reservas] = await pool.query(
    `
    SELECT COUNT(*) AS total 
    FROM reservations 
    WHERE customer_id = ?
        AND status != 'CANCELADA'
    `,
    [id]
    );

    if (reservas[0].total > 0) {
    return res.status(400).json({
        success: false,
        message: `Cliente possui ${reservas[0].total} reserva(s) ativa(s) e não pode ser removido`
    });
    }


    await pool.query(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar cliente'
    });
  }
};
