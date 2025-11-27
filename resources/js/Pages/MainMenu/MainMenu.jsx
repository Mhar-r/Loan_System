import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function MainMenu() {
  const goToLogin = (role) => {
    if (role === 'student') {
      Inertia.get('/login/student');
    } else if (role === 'admin') {
      Inertia.get('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5fa] text-[#1e1e2e]">

      {/* Barra superior con logos */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#2e124a] shadow-md">
        <img
          src="/images/logoUpp.png"
          alt="Logo Universidad"
          className="h-12 w-auto"
        />
        <h1 className="text-xl font-semibold text-white tracking-wide">
          Sistema de Préstamos de Materiales de Laboratorio
        </h1>
        <img
          src="/images/logoSoft.png"
          alt="Logo Sistema"
          className="h-12 w-auto"
        />
      </header>

      {/* Contenido principal */}
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold text-[#441b69] mb-4">Bienvenido</h2>
        <p className="text-[#55546b] text-lg mb-10 max-w-xl">
          Selecciona tu tipo de acceso para continuar con la gestión de préstamos de materiales.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => goToLogin('student')}
            className="bg-[#441b69] text-white px-8 py-3 rounded-2xl shadow hover:bg-[#6b36a7] transition-all duration-300"
          >
            Acceder como Alumno
          </button>

          <button
            onClick={() => goToLogin('admin')}
            className="bg-[#3670b7] text-white px-8 py-3 rounded-2xl shadow hover:bg-[#5fa3e1] transition-all duration-300"
          >
            Acceder como Administrador
          </button>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
  );
}
