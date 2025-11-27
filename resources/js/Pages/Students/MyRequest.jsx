import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedStudentLayout from "@/Layouts/AuthenticatedStudentLayout";


export default function MyRequest({ requests, student  }) {
    return (
        <AuthenticatedStudentLayout student={student}>
        <div className="min-h-screen bg-[#F7F5FB] p-8 text-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Botón Volver al Inicio */}
                <div className="mb-6">
                    <Link
                        href={route("students.dashboard")}
                        className="inline-block bg-[#441B69] text-white px-4 py-2 rounded-lg shadow hover:bg-[#6A32A8] transition"
                    >
                        ← Volver al inicio
                    </Link>
                </div>


                {/* Encabezado */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-[#441B69]">
                        Mis Solicitudes
                    </h1>
                    <div className="mt-3 w-24 h-1 bg-[#6A32A8] mx-auto rounded-full"></div>
                </div>

                {/* Contenedor de tabla */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#441B69] text-white text-left">
                                <th className="px-3 py-2 rounded-l-lg">#</th>
                                <th className="px-3 py-2">Laboratorio</th>
                                <th className="px-3 py-2">Materia</th>
                                <th className="px-3 py-2">Accesorios</th>
                                <th className="px-3 py-2">Estado</th>
                                <th className="px-3 py-2 rounded-r-lg">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.data.length > 0 ? (
                                requests.data.map((req, i) => (
                                    <tr key={req.id} className="hover:bg-[#F3ECFF] transition">
                                        <td className="px-3 py-2 border-b text-center">{i + 1}</td>
                                        <td className="px-3 py-2 border-b">{req.laboratory?.name || "Sin laboratorio"}</td>
                                        <td className="px-3 py-2 border-b">{req.subject}</td>
                                        <td className="px-3 py-2 border-b">{req.accessories || "-"}</td>
                                        <td
                                            className={`px-3 py-2 border-b font-semibold ${
                                                req.status === "Approved"
                                                    ? "text-green-600"
                                                    : req.status === "Rejected"
                                                    ? "text-red-600"
                                                    : "text-yellow-600"
                                            }`}
                                        >
                                            {req.status}
                                        </td>
                                        <td className="px-3 py-2 border-b">
                                            {new Date(req.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No tienes solicitudes registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="mt-6 flex gap-2 flex-wrap justify-center">
                    {requests.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || "#"}
                            className={`px-3 py-1 text-sm border rounded-xl shadow-sm transition ${
                                link.active
                                    ? "bg-[#6A32A8] text-white border-[#6A32A8]"
                                    : "bg-white hover:bg-[#E9DDFC] text-[#441B69]"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </div>
        </AuthenticatedStudentLayout>
    );
}
