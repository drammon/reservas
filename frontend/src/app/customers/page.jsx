'use client';

import { useEffect, useState } from 'react';
import { customersService } from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';


export default function Customers() {
  const [customers, setCustomers] = useState([]); // SEMPRE array
  const [loading, setLoading] = useState(true);
  
  const excluirCliente = async (id) => {
  const confirmar = confirm('Deseja realmente excluir este cliente?');

  if (!confirmar) return;

  try {
    await customersService.deletar(id);
    toast.success('Cliente excluído com sucesso');

    setCustomers(prev => prev.filter(c => c.id !== id));
  } catch (error) {
    const mensagem =
      error.response?.data?.message ||
      error.response?.data ||
      'Não foi possível excluir o cliente';

    toast.error(mensagem);
    console.error(error);
  }
};


  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const response = await customersService.listar();

      // Normalização segura
      const lista = Array.isArray(response)
        ? response
        : response?.data ?? [];

      setCustomers(lista);
    } catch (error) {
      toast.error('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>
      
      

      {customers.length === 0 ? (
        <p>Nenhum cliente cadastrado</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nome</th>
              <th className="p-2 border">Telefone</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td className="p-2 border">{customer.name}</td>
                <td className="p-2 border">{customer.phone}</td>
                <td className="p-2 border text-center">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => excluirCliente(customer.id)}
                    >
                    Excluir
                    </button>

                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
        
      )}
      <Link
        href="/customers/new"
        className="mt-6 inline-block bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        + Novo Cliente
      </Link>
    </div>
  );
}
