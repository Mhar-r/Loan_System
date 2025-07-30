// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard() {
  return (
    <AuthenticatedLayout>
      <h1 className="text-2xl font-bold">Panel de Administrador</h1>
      <p>Bienvenido al dashboard del administrador.</p>
    </AuthenticatedLayout>
  );
}
