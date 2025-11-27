import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from "axios";
import { useEffect } from "react";


export default function LoanHistory() {

    const { loans, labs, types, filters } = usePage().props;

    

    const uniqueInitial = Array.from(
      new Map(types.map(t => [t.id, t])).values()
    );

    const [filteredTypes, setFilteredTypes] = useState(uniqueInitial);


  const [selectedLab, setSelectedLab] = useState(filters.laboratory_id || '');
  const [selectedType, setSelectedType] = useState(filters.material_type_id || '');

  const applyFilters = () => {
    router.get('/loans/history', {
      laboratory_id: selectedLab,
      material_type_id: selectedType,
    });
  };

  const clearFilters = () => {
    setSelectedLab('');
    setSelectedType('');
    router.get('/loans/history');
  };

  useEffect(() => {
    axios.get("/api/material-types/filter", {
      params: {
        lab_id: selectedLab,
        type_id: selectedType,
      }
    }).then(res => {
      // Eliminar duplicados por ID
      const unique = Array.from(
        new Map(res.data.map(type => [type.id, type])).values()
      );

      setFilteredTypes(unique);

    });
}, [selectedLab, selectedType]);


  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Historial de Préstamos (Admin)</h1>

        {/* 🔹 Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 mb-6">
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="border p-2"
          >
            <option value="">Todos los laboratorios</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2"
            disabled={!selectedLab} // ⬅ DESACTIVADO si no hay laboratorio
          >
            <option value="">
              {selectedLab ? "Todos los tipos de material" : "Selecciona un laboratorio"}
            </option>

            {selectedLab &&
              filteredTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </select>

          <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-[#441B69] hover:bg-[#6A32A8] text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Aplicar
          </button>

          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Limpiar
          </button>
          </div>
        </div>

        {/* 🔹 Tabla */}
        {loans.data.length === 0 ? (
          <p>No hay préstamos registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full text-center text-gray-700">
              <thead className="bg-[#441B69]/10 text-[#441B69] uppercase text-sm font-semibold">
                <tr className="bg-gray-200">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Estudiante</th>
                  <th className="border p-2">Matrícula</th>
                  <th className="border p-2">Laboratorio</th>
                  <th className="border p-2">Materia</th>
                  <th className="border p-2">Prestador</th>
                  <th className="border p-2">Accesorios préstamo</th>
                  <th className="border p-2">Fecha Préstamo</th>
                  <th className="border p-2">Fecha Devolución</th>
                  <th className="border p-2">Estatus</th>
                  <th className="border p-2">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {loans.data.map((loan) => (
                  <tr key={loan.id}>
                    <td className="border p-2">{loan.id}</td>
                     <td className="border p-2">{loan.student ? `${loan.student.name} ${loan.student.first_surname} ${loan.student.second_surname}` : 'N/A'}</td>
                    <td className="border p-2">{loan.student?.student_id}</td>
                    <td className="border p-2">{loan.laboratory?.name || 'N/A'}</td>
                    <td className="border p-2">{loan.subject || 'N/A'}</td>
                    <td className="border p-2">{loan.manager ? `${loan.manager.name} ${loan.manager.first_surname} ${loan.manager.second_surname}` : 'N/A'}</td>
                    <td className="border p-2">{loan.accessories || 'N/A'}</td>
                    <td className="border p-2">{loan.loan_date}</td>
                    <td className="border p-2">{loan.return_date || 'Pendiente'}</td>
                    <td className="border p-2">{loan.status}</td>
                    <td className="border p-2">
                      <details>
                        <summary className="cursor-pointer">Ver materiales</summary>
                        <table className="w-full mt-2 border text-xs">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-1">Material</th>
                              <th className="border p-1">Inventario</th>
                              <th className="border p-1">Accesorios</th>
                              <th className="border p-1">Estado</th>
                              <th className="border p-1">Condición devolución</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loan.loan_details.map((detail) => (
                              <tr key={detail.id}>
                                <td className="border p-1">
                                  {detail.material?.type?.name || 'N/A'}
                                </td>
                                <td className="border p-1">
                                  {detail.material?.inventory_number || 'N/A'}
                                </td>
                                <td className="border p-1">
                                  {detail.accessories || 'N/A'}
                                </td>
                                <td className="border p-1">{detail.status}</td>
                                <td className="border p-1">
                                  {detail.return_condition || 'Pendiente'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔹 Paginación */}
        {loans.links && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {loans.links.map((link, i) => (
              <Link
                key={i}
                href={link.url || "#"}
                className={`px-3 py-1 border rounded-xl text-sm transition-all duration-200 
                  ${link.active ? "bg-[#441B69] text-white" : "bg-white hover:bg-gray-100"}
                  ${!link.url ? "opacity-50 cursor-not-allowed" : ""}
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
