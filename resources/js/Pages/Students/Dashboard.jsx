import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedStudentLayout from "@/Layouts/AuthenticatedStudentLayout";

export default function StudentDashboard({ student }) {
    return (
        <AuthenticatedStudentLayout student={student}>
            <>
                <Head title="Panel del Estudiante" />

                <div className="min-h-screen bg-[#F7F5FB] p-8 text-gray-800">
                    <div className="max-w-7xl mx-auto">

                        {/* Encabezado */}
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#441B69] mb-3">
                                Bienvenido, {student.name} {student.first_surname}
                            </h1>
                            <p className="text-gray-600 font-medium text-lg">
                                Rol: Estudiante
                            </p>
                            <div className="mt-4 w-24 h-1 bg-[#6A32A8] mx-auto rounded-full"></div>
                        </div>

                        {/* Panel de Solicitudes */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-[#441B69] mb-6">
                                Panel de Solicitudes
                            </h2>
                        </div>

                        {/* Opciones del estudiante */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                {
                                    href: route("solicitudes.index"),
                                    text: "Hacer Solicitud",
                                    description: "Envía una nueva solicitud de préstamo de material."
                                },
                                {
                                    href: route("student.requests"),
                                    text: "Ver Solicitudes",
                                    description: "Consulta el estado de todas tus solicitudes enviadas."
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

                                    {/* Línea decorativa inferior */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#441B69]/0 group-hover:bg-[#6A32A8]/90 transition-all duration-300 rounded-b-2xl"></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        </AuthenticatedStudentLayout>
    );
}
