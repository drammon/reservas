'use client';

import { useEffect, useState } from 'react';
import { reservationsService } from '@/services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      const response = await reservationsService.listar();
      const lista = Array.isArray(response) ? response : response?.data ?? [];
      setReservations(lista);
    } catch (error) {
      toast.error('Erro ao carregar reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (id) => {
    const confirmar = confirm('Deseja realmente cancelar esta reserva?');
    if (!confirmar) return;

    try {
      await reservationsService.cancelar(id);

      toast.success('Reserva cancelada com sucesso');

      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'CANCELADA' } : r
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        'Não foi possível cancelar a reserva'
      );
      console.error(error);
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Carregando reservas...</p>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservas</h1>
      </div>

      {reservations.length === 0 ? (
        <p>Nenhuma reserva cadastrada</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Cliente</th>
              <th className="p-2 border">Mesa</th>
              <th className="p-2 border">Data / Hora</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td className="p-2 border">
                  {reservation.customer_name || reservation.customer?.name}
                </td>
                <td className="p-2 border">
                  Mesa {reservation.table_number || reservation.table?.number}
                </td>
                <td className="p-2 border">
                  {new Date(reservation.reservation_datetime).toLocaleString()}
                </td>
                <td className="p-2 border">
                  {reservation.status}
                </td>
                <td className="p-2 border text-center">
                  {reservation.status !== 'CANCELADA' && (
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => cancelarReserva(reservation.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link
        href="/reservations/new"
        className="mt-6 inline-block bg-pink-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        + Nova Reserva
      </Link>
    </div>
  );
}
