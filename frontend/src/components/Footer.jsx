export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            🪑 Sistema de Reservas © {anoAtual}
          </p>

          <p className="text-xs mt-1 text-gray-500">
            CRUD Fullstack com React, React Router, Express.js e MySQL
          </p>
        </div>
      </div>
    </footer>
  );
}
