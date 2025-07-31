import React from 'react';
import { Head } from '@inertiajs/react';

export default function SolicitudPrestamo() {
  return (
    <>
      <Head title="Solicitudes de Préstamo" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">¡Bienvenido!</h1>
          <p className="text-gray-700">
            Este es el portal para realizar solicitudes de préstamo de equipo.
            <br />
            Pronto podrás llenar el formulario correspondiente.
          </p>
        </div>
      </div>
    </>
  );
}
