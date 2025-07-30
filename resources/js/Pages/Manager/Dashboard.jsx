// resources/js/Pages/Manager/Dashboard.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManagerDashboard() {
  return (
    <AuthenticatedLayout>
      <h1 className="text-2xl font-bold">Panel del Encargado</h1>
      <p>Bienvenido al dashboard del encargado.</p>
    </AuthenticatedLayout>
  );
}
