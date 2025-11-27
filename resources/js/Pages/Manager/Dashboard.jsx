import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ManagerDashboard({ user }) {
    return (
        <AuthenticatedLayout>
            <>
                <Head title="Panel del Encargado" />

                <div className="min-h-screen bg-[#F7F5FB] p-8 text-gray-800">
                    <div className="max-w-7xl mx-auto">

                        {/* Encabezado */}
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#441B69] mb-3">
                                Bienvenido, {user.name}
                            </h1>
                            <p className="text-gray-600 font-medium text-lg">
                                Rol: Encargado
                            </p>
                            <div className="mt-4 w-24 h-1 bg-[#6A32A8] mx-auto rounded-full"></div>
                        </div>

                        {/* Grid de tarjetas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                { 
                                    href: route("loans.create"), 
                                    text: "Registro de Préstamos",
                                    description: "Genera un nuevo préstamo de material."
                                },
                                { 
                                    href: route("admin.requests"), 
                                    text: "Solicitudes de Préstamos",
                                    description: "Gestiona solicitudes pendientes enviadas por alumnos."
                                },
                                { 
                                    href: route("loans.return-materials"), 
                                    text: "Devolución de Préstamos",
                                    description: "Registra el retorno de materiales prestados."
                                },
                                { 
                                    href: route("loans.myHistory"), 
                                    text: "Mi Historial de Préstamos",
                                    description: "Consulta todos los préstamos realizados por ti."
                                },
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="group relative p-8 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
                                >
                                    <span className="text-lg font-semibold text-[#441B69] group-hover:text-[#6A32A8] transition-colors duration-200">
                                        {item.text}
                                    </span>

                                    <p className="text-sm text-gray-600 mt-2">
                                        {item.description}
                                    </p>

                                    {/* Decoración inferior */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#441B69]/0 group-hover:bg-[#6A32A8]/90 transition-all duration-300 rounded-b-2xl"></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        </AuthenticatedLayout>
    );
}
