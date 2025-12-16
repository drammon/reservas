'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-white font-bold text-xl"
          >
            <span className="text-2xl">🪑</span>
            <span>Sistema de Reservas</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/customers" className={linkClass('/customers')}>
              Clientes
            </Link>

            <Link href="/tables" className={linkClass('/tables')}>
              Mesas
            </Link>

            <Link href="/reservations" className={linkClass('/reservations')}>
              Reservas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
