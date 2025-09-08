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
                          <Link href={route('materialtype.create')} className="p-6 bg-green-100 rounded shadow hover:bg-green-200 transition">Agregar Tipo de Material</Link>
                          <Link href={route('material.create')} className="p-6 bg-yellow-100 rounded shadow hover:bg-yellow-200 transition">Registrar Material</Link>
                          <Link href={route('students.create')} className="p-6 bg-red-100 rounded shadow hover:bg-red-200 transition">Registrar Estudiantes</Link>
                          <Link href={route('loans.create')} className="p-6 bg-purple-100 rounded shadow hover:bg-purple-200 transition">Registro de Prestamos</Link>
                          <Link href={route('admin.requests')} className="p-6 bg-purple-100 rounded shadow hover:bg-purple-200 transition">Solicitudes de Prestamos</Link>
                          <Link href={route('loans.return-materials')} className="p-6 bg-pink-100 rounded shadow hover:bg-pink-200 transition">Devolucion de Prestamos</Link>
                          <Link  className="p-6 bg-pink-100 rounded shadow hover:bg-pink-200 transition">Historial de Prestamos</Link>
                          <Link  className="p-6 bg-pink-100 rounded shadow hover:bg-pink-200 transition">Inventario de Material</Link>

                      </div>
                  </div>
                </div>
            </div>
        </>
    </AuthenticatedLayout>
  );
}
