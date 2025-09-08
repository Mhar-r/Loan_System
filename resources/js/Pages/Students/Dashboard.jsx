// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedStudentLayout from '@/Layouts/AuthenticatedStudentLayout';

export default function StudentDashboard({ student }) {
    return (
        <AuthenticatedStudentLayout student={student}>
            <div className="min-h-screen bg-gray-100 p-6">
                <h1 className="text-3xl font-bold mb-4">
                    Bienvenido, {student.name} {student.first_surname}
                </h1>

                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Panel de Solicitudes</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <Link
                            href={route('solicitudes.index')}
                            className="block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Hacer Solicitud
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedStudentLayout>
    );
}
