'use client';

import { useEffect, useState } from 'react';
import { tablesService } from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMesas();
  }, []);

  const carregarMesas = async () => {
    try {
      const response = await tablesService.listar();

      const lista = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setTables(lista);
    } catch (error) {
      toast.error('Erro ao carregar mesas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const excluirMesa = async (id) => {
    const confirmar = confirm('Deseja realmente excluir esta mesa?');
    if (!confirmar) return;

    try {
      await tablesService.deletar(id);
      toast.success('Mesa excluída com sucesso');

      setTables(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      toast.error('Não foi possível excluir a mesa');
      console.error(error);
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Carregando mesas...</p>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mesas</h1>

        
      </div>

      {tables.length === 0 ? (
        <p>Nenhuma mesa cadastrada</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Número</th>
              <th className="p-2 border">Capacidade</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tables.map(table => (
                <tr key={table.id}>
                {/* ✅ AQUI ESTÁ A CORREÇÃO */}
                <td className="p-2 border text-center">
                    {table.table_number}
                </td>

                <td className="p-2 border text-center">
                    {table.capacity}
                </td>

                <td className="p-2 border">
                    {table.status === 'ATIVA' ? 'Ativa' : 'Inativa'}
                </td>


                <td className="p-2 border text-center">
                    <button
                        className="text-red-600 hover:underline"
                        onClick={() => excluirMesa(table.id)}
                        >
                        Inativar
                        </button>
                </td>
                </tr>
            ))}
            </tbody>

        </table>
      )}
      <Link
          href="/tables/new"
          className="mt-6 inline-block bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          + Nova Mesa
        </Link>
    </div>
  );
}
