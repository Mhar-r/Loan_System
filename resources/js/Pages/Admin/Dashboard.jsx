// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminDashboard({ user }) {
  return (
    <AuthenticatedLayout>
      <>
            <Head title="Panel de Administrador" />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido, {user.name}</h1>
                    <p className="text-gray-600 mb-8">Rol: Administrador</p>

                     <div className="p-8">
                      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          
                          <Link href="/admin/users" className="p-6 bg-blue-100 rounded shadow hover:bg-blue-200 transition">Gestión de Usuarios</Link>
                          <Link href="/admin/item_models" className="p-6 bg-green-100 rounded shadow hover:bg-green-200 transition">Gestión de Equipos (Modelos)</Link>
                          <Link href="/admin/loan_reports" className="p-6 bg-yellow-100 rounded shadow hover:bg-yellow-200 transition">Reportes de Préstamos</Link>
                          <Link href="/admin/history" className="p-6 bg-red-100 rounded shadow hover:bg-red-200 transition">Historial de Prestampa</Link>
                          <Link href="/admin/inventory_reports" className="p-6 bg-purple-100 rounded shadow hover:bg-purple-200 transition">Reporte de Inventario</Link>
                          <Link href="/admin/loans" className="p-6 bg-pink-100 rounded shadow hover:bg-pink-200 transition">Gestión de Prestamos</Link>

                      </div>
                  </div>
                </div>
            </div>
        </>
    </AuthenticatedLayout>
  );
}
