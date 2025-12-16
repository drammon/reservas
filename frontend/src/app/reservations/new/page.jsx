'use client';

import { useEffect, useState } from 'react';
import {
  customersService,
  tablesService,
  reservationsService
} from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewReservation() {
  const [customers, setCustomers] = useState([]);
  const [tables, setTables] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [tableId, setTableId] = useState('');
  const [datetime, setDatetime] = useState('');
  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [clientes, mesas] = await Promise.all([
        customersService.listar(),
        tablesService.listar(),
      ]);

      setCustomers(Array.isArray(clientes) ? clientes : clientes?.data ?? []);
      setTables(Array.isArray(mesas) ? mesas : mesas?.data ?? []);
    } catch (error) {
      toast.error('Erro ao carregar dados');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !tableId || !datetime) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      await reservationsService.criar({
        customer_id: customerId,
        table_id: tableId,
        reservation_datetime: datetime,
      });

      toast.success('Reserva criada com sucesso');
      router.push('/reservations');
    } catch (error) {
      toast.error('Erro ao criar reserva');
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Reserva</h1>

      <form onSubmit={handleSubmit}>
        <select
          className="w-full border p-2 rounded mb-4"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Selecione o cliente</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded mb-4"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
        >
          <option value="">Selecione a mesa</option>
          {tables.map(t => (
            <option key={t.id} value={t.id}>
                Mesa {t.table_number} ({t.capacity} pessoas)
            </option>
            ))}
        </select>

        <input
          type="datetime-local"
          className="w-full border p-2 rounded mb-4"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Salvar Reserva
        </button>
      </form>
    </div>
  );
}
