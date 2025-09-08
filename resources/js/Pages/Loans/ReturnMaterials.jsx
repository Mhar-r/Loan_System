import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function ReturnMaterials() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [matricula, setMatricula] = useState('');
  const [loans, setLoans] = useState([]);
  const [condition, setCondition] = useState('');
  const [selectedDetailId, setSelectedDetailId] = useState(null);

  const { errors } = usePage().props;

  useEffect(() => {
    fetch("/api/loans")
      .then((res) => res.json())
      .then((data) => setLoans(data))
      .catch((err) => console.error("Error fetching loans:", err));
  }, []);

  // Mostrar alerta si hay error desde backend
  useEffect(() => {
    if (errors?.material_unavailable) {
      Swal.fire({
        icon: "error",
        title: "Material no disponible",
        text: errors.material_unavailable,
        confirmButtonColor: "#d33",
      });
    }
  }, [errors]);

  useEffect(() => {
    axios.get('/api/labs')
      .then(res => setLabs(res.data))
      .catch(() => setLabs([]));
  }, []);

  useEffect(() => {
    if (selectedLab) {
      fetchLoans();
    } else {
      setLoans([]);
    }
    setMatricula('');
    setSelectedDetailId(null);
    setCondition('');
  }, [selectedLab]);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`/api/loans/active`, {
        params: { lab_id: selectedLab, matricula }
      });
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los préstamos.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const returnLoan = async (detailId) => {
    if (!condition.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor escribe la condición al devolver el material.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      const res = await fetch(`/api/loans/return/${detailId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_condition: condition })
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Devolución exitosa",
          text: "El préstamo se ha devuelto correctamente.",
          confirmButtonColor: "#16a34a",
        });

        // quitar solo el detalle devuelto
        setLoans(loans.map(loan => ({
          ...loan,
          loan_details: loan.loan_details.filter(d => d.id !== detailId)
        })));
        setSelectedDetailId(null);
        setCondition('');
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Error al devolver préstamo.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Hubo un problema al devolver el préstamo.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleClearSearch = () => {
    setMatricula('');
    fetchLoans();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Devolución de Materiales</h1>

      <div className="flex gap-4 mb-4">
        <select
          value={selectedLab}
          onChange={e => setSelectedLab(e.target.value)}
          className="border p-2"
        >
          <option value="">Selecciona laboratorio</option>
          {labs.map(lab => (
            <option key={lab.id} value={lab.id}>{lab.name}</option>
          ))}
        </select>

        <input
          type="text"
          value={matricula}
          onChange={e => setMatricula(e.target.value)}
          placeholder="Buscar por matrícula"
          className="border p-2"
          disabled={!selectedLab}
        />

        <button
          onClick={fetchLoans}
          disabled={!selectedLab}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Buscar
        </button>

        <button
          onClick={handleClearSearch}
          disabled={!selectedLab || matricula.trim() === ''}
          className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {loans.length > 0 ? (
        <table className="w-full border mt-6 text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Alumno</th>
              <th className="p-2 border">Matrícula</th>
              <th className="p-2 border">Número Inventario</th>
              <th className="p-2 border">Condición (préstamo)</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan =>
              loan.loan_details.map(detail =>
                detail.status === 'on_loan' && (
                  <tr key={detail.id} className="border-t">
                    <td className="p-2 border">{loan.student.name} {loan.student.last_name}</td>
                    <td className="p-2 border">{loan.student.student_id}</td>
                    <td className="p-2 border">{detail.material.inventory_number}</td>
                    <td className="p-2 border">{detail.material.condition}</td>
                    <td className="p-2 border">
                      {selectedDetailId === detail.id ? (
                        <div>
                          <textarea
                            value={condition}
                            onChange={e => setCondition(e.target.value)}
                            placeholder="Condición al devolver"
                            className="border p-1 text-xs w-full"
                          />
                          <button
                            onClick={() => returnLoan(detail.id)}
                            className="mt-1 bg-green-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Confirmar devolución
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDetailId(detail.id);
                            setCondition('');
                          }}
                          className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                        >
                          Devolver material
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      ) : (
        selectedLab && <p className="text-gray-500 mt-4">No hay préstamos activos para este laboratorio.</p>
      )}
    </div>
  );
}
