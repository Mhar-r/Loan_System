import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from "sweetalert2";

export default function ReturnMaterials() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [matricula, setMatricula] = useState('');
  const [loans, setLoans] = useState([]);
  const [loanConditions, setLoanConditions] = useState({}); // { loanId: { detailId: condition } }

  // Cargar laboratorios
  useEffect(() => {
    axios.get('/api/labs')
      .then(res => setLabs(res.data))
      .catch(() => setLabs([]));
  }, []);

  // Fetch préstamos activos
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

  useEffect(() => {
    if (selectedLab) {
      fetchLoans();
    } else {
      setLoans([]);
    }
    setMatricula('');
    setLoanConditions({});
  }, [selectedLab]);

  const handleClearSearch = () => {
    setMatricula('');
    fetchLoans();
  };

  const handleConditionChange = (loanId, detailId, value) => {
    setLoanConditions(prev => ({
      ...prev,
      [loanId]: { ...prev[loanId], [detailId]: value }
    }));
  };

  const returnFullLoan = async (loan) => {
    const materials = loan.loan_details.map(detail => ({
      id: detail.id,
      item_condition: loanConditions[loan.id]?.[detail.id] || ''
    }));

    // Validar que todos los campos tengan valor
    if (materials.some(m => m.item_condition.trim() === '')) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor llena la condición de todos los materiales antes de devolver.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      const res = await axios.post(`/api/loans/return/${loan.id}`, { materials });

      Swal.fire({
        icon: "success",
        title: "Devolución exitosa",
        text: "El préstamo se ha devuelto correctamente.",
        confirmButtonColor: "#16a34a",
      });

      // Quitar préstamo devuelto
      setLoans(prev => prev.filter(l => l.id !== loan.id));
      setLoanConditions(prev => {
        const copy = { ...prev };
        delete copy[loan.id];
        return copy;
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al devolver préstamo.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <AuthenticatedLayout>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Devolución de Materiales</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 mb-6">
        <select
          value={selectedLab}
          onChange={e => setSelectedLab(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto"
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
          className="border p-2 rounded-md w-full sm:w-auto"
          disabled={!selectedLab}
        />

        <div className="flex gap-2">
          <button
            onClick={fetchLoans}
            disabled={!selectedLab}
            className="bg-[#441B69] text-white px-4 py-2 rounded-md hover:bg-[#5b2c8a] transition"
          >
            Buscar
          </button>

          <button
            onClick={handleClearSearch}
            disabled={!selectedLab || matricula.trim() === ''}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Limpiar
          </button>
        </div>
      </div>


      {/* Tabla de préstamos */}
      {loans.length > 0 ? (
        <div className="overflow-x-auto">
        <table className="w-full border mt-6 text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Alumno</th>
              <th className="p-2 border">Matrícula</th>
              <th className="p-2 border">Préstamo Detalles</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id} className="border-t">
                <td className="p-2 border">{loan.student.name} {loan.student.last_name}</td>
                <td className="p-2 border">{loan.student.student_id}</td>
                <td className="p-2 border">
                  <table className="w-full border text-sm mb-2">
                    <thead>
                      <tr>
                        <th className="border p-1">Material</th>
                        <th className="border p-1">Número Inventario</th>
                        <th className="border p-1">Condición préstamo</th>
                        <th className="border p-1">Accesorios</th>
                        <th className="border p-1">Condición devolución</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loan.loan_details.map(detail => (
                        <tr key={detail.id}>
                          <td className="border p-1">{detail.material?.type?.name || 'N/A'}</td>
                          <td className="border p-1">{detail.material.inventory_number}</td>
                          <td className="border p-1">{detail.material.condition}</td>
                          <td className="border p-1">{detail.accessories || 'N/A'}</td>
                          <td className="border p-1">
                            <input
                              type="text"
                              value={loanConditions[loan.id]?.[detail.id] || ''}
                              onChange={e => handleConditionChange(loan.id, detail.id, e.target.value)}
                              className="border p-1 w-full text-xs"
                            />
                          </td>
                        </tr>
                      ))}

                      {loan.accessories && (
                        <tr key={`acc-${loan.id}`}>
                          <td colSpan={5} className="p-2 border">
                            <strong>Accesorios del préstamo:</strong> {loan.accessories}
                          </td>
                        </tr>
                      )}

                      <tr key={`return-${loan.id}`}>
                        <td colSpan={5} className="p-2 text-right">
                          <button
                            onClick={() => returnFullLoan(loan)}
                            className="btn-confirmation"
                          >
                            Devolver préstamo
                          </button>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        selectedLab && <p className="text-gray-500 mt-4">No hay préstamos activos para este laboratorio.</p>
      )}
    </div>
    </AuthenticatedLayout>
  );
}
