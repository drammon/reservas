import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/* ===============================
   CLIENTES
================================ */

export const customersService = {
  listar: async () => {
    const res = await api.get('/customers');
    return res.data;
  },

  buscarPorId: async (id) => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  criar: async (data) => {
    const res = await api.post('/customers', data);
    return res.data;
  },

  atualizar: async (id, data) => {
    const res = await api.put(`/customers/${id}`, data);
    return res.data;
  },

  deletar: async (id) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  },
};

/* ===============================
   MESAS
================================ */

export const tablesService = {
  listar: async () => {
    const res = await api.get('/tables');
    return res.data;
  },

  buscarPorId: async (id) => {
    const res = await api.get(`/tables/${id}`);
    return res.data;
  },

  criar: async (data) => {
    const res = await api.post('/tables', data);
    return res.data;
  },

  atualizar: async (id, data) => {
    const res = await api.put(`/tables/${id}`, data);
    return res.data;
  },

  deletar: async (id) => {
    const res = await api.delete(`/tables/${id}`);
    return res.data;
  },
};

/* ===============================
   RESERVAS (BÔNUS)
================================ */

export const reservationsService = {
  listar: async () => {
    const res = await api.get('/reservations');
    return res.data;
  },

  criar: async (data) => {
    const res = await api.post('/reservations', data);
    return res.data;
  },
  cancelar: async (id) => {
    const res = await api.delete(`/reservations/${id}`);
    return res.data;
  },
  confirmar: async (id) => {
    const res = await api.put(`/reservations/${id}/confirm`);
    return res.data;
  },
  limpar: async () => {
    const res = await api.delete('/reservations');
    return res.data;
  },
};


/* ===============================
   INTERCEPTOR DE ERRO
================================ */

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(
        'Erro da API:',
        error.response.status,
        error.response.data?.message || error.response.data
      );
    } else if (error.request) {
      console.error('Erro de rede ou servidor offline');
    } else {
      console.error('Erro:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
