import React from 'react';
import { Link } from '@inertiajs/react';

export default function Panel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Panel del Estudiante</h1>

      <div className="space-y-4">
        <Link
          href={route('students.create')}
          className="block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrarse
        </Link>

        <Link
          href={route('solicitudes.index')}
          className="block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Hacer Solicitud
        </Link>
      </div>
    </div>
  );
}
