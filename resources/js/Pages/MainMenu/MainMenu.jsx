import React from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function MainMenu() {
  const goToLogin = (role) => {
    if (role === 'student') {
      Inertia.get('/login/student'); // ruta al login de alumno
    } else if (role === 'admin') {
      Inertia.get('/login');   // ruta al login de admin
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Bienvenido</h1>

      <div className="flex gap-4">
        <button
          onClick={() => goToLogin('student')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Acceder como Alumno
        </button>

        <button
  onClick={() => { window.location.href = '/login'; }}
  className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
>
  Acceder como Administrador
</button>

      </div>
    </div>
  );
}

