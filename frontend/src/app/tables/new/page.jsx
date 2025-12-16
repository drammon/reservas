'use client';

import { useState } from 'react';
import { tablesService } from '@/services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewTable() {
  const router = useRouter();

  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('ATIVA');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tableNumber || !capacity) {
      toast.error('Número da mesa e capacidade são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      await tablesService.criar({
        table_number: Number(tableNumber),
        capacity: Number(capacity),
        status,
      });

      toast.success('Mesa criada com sucesso');
      router.push('/tables');
    } catch (error) {
      const mensagem =
        error.response?.data?.message ||
        'Erro ao criar mesa';

      toast.error(mensagem);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Mesa</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Número da mesa */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Número da mesa
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            min={1}
            required
          />
        </div>

        {/* Capacidade */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Capacidade
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min={1}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ATIVA">ATIVA</option>
            <option value="INATIVA">INATIVA</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>

          <Link
            href="/tables"
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
