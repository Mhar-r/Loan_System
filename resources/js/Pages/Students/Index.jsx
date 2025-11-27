import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function Index({ students, filters }) {
    const majors = ['Software', 'Biomedica', 'Biotecnologia', 'RedesTeleco', 'Mecatronica', 'TIID', 'Other'];
    
    return (
        <AuthenticatedLayout>
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Listado de Estudiantes</h1>

            {/* 🔹 Contenedor de filtros con buena alineación */}
            <form method="get" className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <select
                    name="major"
                    defaultValue={filters.major || ""}
                    className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#441B69] focus:outline-none"
                >
                    <option value="">-- Carrera --</option>
                    {majors.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                <input
                    type="text"
                    name="group_name"
                    placeholder="Grupo"
                    defaultValue={filters.group_name || ""}
                    className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#441B69] focus:outline-none"
                />

                <input
                    type="text"
                    name="search"
                    placeholder="Buscar (nombre o matrícula)"
                    defaultValue={filters.search || ""}
                    className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#441B69] focus:outline-none flex-1 min-w-[200px]"
                />

                {/* Botones bien alineados */}
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                        type="submit"
                        className="bg-[#441B69] text-white px-4 py-2 rounded-lg hover:bg-[#5b2a91] transition-all"
                    >
                        Filtrar
                    </button>

                    <a
                        href={route("students.index")} // 👈 reemplaza con tu ruta correcta
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                    >
                        Limpiar
                    </a>
                </div>
            </form>


            {/* Tabla */}
            <div className="overflow-x-auto">
            <table className="min-w-full text-center text-gray-700">
                <thead className="bg-[#441B69]/10 text-[#441B69] uppercase text-sm font-semibold">
                    <tr className="bg-gray-200">
                        <th className="border px-2">Matrícula</th>
                        <th className="border px-2">Nombre</th>
                        <th className="border px-2">Carrera</th>
                        <th className="border px-2">Grupo</th>
                        <th className="border px-2">Email</th>
                        <th className="border px-2">Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {students.data.map((s) => (
                        <tr key={s.id} className="border">
                            <td className="border px-2">{s.student_id}</td>
                            <td className="border px-2">{`${s.name} ${s.first_surname} ${s.second_surname}`}</td>
                            <td className="border px-2">{s.major}</td>
                            <td className="border px-2">{s.group_name || "-"}</td>
                            <td className="border px-2">{s.email}</td>
                            <td className="border px-2">{s.phone || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {/* Paginación */}
            <div className="mt-4 flex gap-2">
                {students.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || "#"}
                        className={`px-3 py-1 border rounded ${link.active ? "btn-secondary" : ""}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
