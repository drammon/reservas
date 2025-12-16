'use client';

import { useEffect, useState } from 'react';
import { customersService } from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Home() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testarConexao();
  }, []);

  const testarConexao = async () => {
    try {
      const response = await customersService.listar();

      const lista = Array.isArray(response?.data)
        ? response.data
        : [];

      setClientes(lista);

      toast.success(
        `✅ API conectada! ${lista.length} clientes encontrados.`
      );
    } catch (error) {
      toast.error('❌ Erro ao conectar com a API');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🪑 Sistema de Reservas
          </h1>
          <p className="text-xl text-gray-600">
            Gerencie clientes, mesas e reservas de forma simples e organizada
          </p>
        </div>

        {/* Status da API */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              ✅ Sistema conectado
            </h2>
            <p className="text-green-700">
              {clientes.length} clientes cadastrados no banco de dados
            </p>
          </div>
        )}

        {/* Cards de navegação */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Clientes */}
          <Link href="/customers" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-purple-500">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Clientes
              </h3>
              <p className="text-sm text-gray-600">
                Cadastrar, editar e listar clientes
              </p>
            </div>
          </Link>

          {/* Mesas */}
          <Link href="/tables" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-pink-500">
              <div className="text-4xl mb-3">🪑</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Mesas
              </h3>
              <p className="text-sm text-gray-600">
                Gerenciar mesas e capacidade
              </p>
            </div>
          </Link>

          {/* Reservas (Bônus) */}
          <Link href="/reservations" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow border-2 border-transparent group-hover:border-purple-500">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Reservas
              </h3>
              <p className="text-sm text-gray-600">
                Criar e visualizar reservas
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
