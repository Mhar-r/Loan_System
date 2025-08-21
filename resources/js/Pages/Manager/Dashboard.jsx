// resources/js/Pages/manager/ManagerDashboard.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManagerDashboard({ user }) {
    return (
        <AuthenticatedLayout>
        
        <>
            <Head title="Panel del Encargado" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Hola, {user.name}</h1>
                    <p className="text-gray-600 mb-8">Rol: Encargado</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Inventario</h2>
                            <p>Revisa y gestiona el inventario</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Préstamos</h2>
                            <p>Gestiona los préstamos realizados</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
         </AuthenticatedLayout>
    );
}
