'use client';
import { useState } from 'react';
import { customersService } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function NewCustomer() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    await customersService.criar({ name, phone });
    router.push('/customers');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Nome"
          className="w-full border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          placeholder="Telefone"
          className="w-full border p-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

        <button className="bg-purple-600 text-white px-4 py-2 rounded w-full">
          Salvar
        </button>
      </form>
    </div>
  );
}
