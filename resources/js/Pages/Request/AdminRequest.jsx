import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminRequests() {
  const [labs, setLabs] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal de aprobación
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [accessories, setAccessories] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Cargar laboratorios
  useEffect(() => {
    axios.get("/api/labs")
      .then(res => setLabs(res.data))
      .catch(() => setLabs([]));
  }, []);

  // Cargar tipos de material según laboratorio
  useEffect(() => {
    if (selectedLab) {
      axios.get(`/api/material-types/by-lab/${selectedLab}`)
        .then(res => setMaterialTypes(res.data))
        .catch(() => setMaterialTypes([]));
    } else {
      setMaterialTypes([]);
      setSelectedType("");
    }
  }, [selectedLab]);

  // Cargar solicitudes pendientes
  useEffect(() => {
    fetchRequests();
  }, [selectedLab, selectedType]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/requests/pending", {
        params: {
          lab_id: selectedLab || undefined,
          material_type_id: selectedType || undefined
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de aprobación
  const handleApproveClick = (request) => {
    setCurrentRequest(request);
    setSelectedMaterial("");
    setAccessories(request.accessories || "");
    setReturnDate("");
  };

  // Aprobar solicitud
  const handleApproveRequest = async () => {
    if (!selectedMaterial || !returnDate) {
      Swal.fire("Error", "Debes seleccionar material y fecha de devolución", "warning");
      return;
    }

    try {
      await axios.post(`/api/requests/${currentRequest.id}/approve`, {
        material_id: selectedMaterial,
        accessories,
        return_date: returnDate,
      });

      Swal.fire("Éxito", "Solicitud aprobada y préstamo creado", "success");
      setCurrentRequest(null);
      fetchRequests(); // refrescar lista
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo aprobar la solicitud", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Solicitudes - Admin</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedLab}
          onChange={e => setSelectedLab(e.target.value)}
          className="border p-2"
        >
          <option value="">Todos los laboratorios</option>
          {labs.map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="border p-2"
          disabled={!selectedLab}
        >
          <option value="">Todos los tipos de material</option>
          {materialTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
        </select>
      </div>

      {/* Lista de solicitudes */}
      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : requests.length === 0 ? (
        <p>No hay solicitudes pendientes</p>
      ) : (
        <table className="w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Alumno</th>
              <th className="p-2 border">Matrícula</th>
              <th className="p-2 border">Laboratorio</th>
              <th className="p-2 border">Tipo Material</th>
              <th className="p-2 border">Accesorios</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-t">
                <td className="p-2 border">{req.student.name}</td>
                <td className="p-2 border">{req.student.student_id}</td>
                <td className="p-2 border">{req.laboratory.name}</td>
                <td className="p-2 border">{req.materialType.name}</td>
                <td className="p-2 border">{req.accessories || 'Ninguno'}</td>
                <td className="p-2 border">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleApproveClick(req)}
                  >
                    Aprobar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de aprobación */}
      {currentRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-bold mb-4">Aprobar Solicitud</h2>

            <p className="mb-2"><strong>Alumno:</strong> {currentRequest.student.name}</p>
            <p className="mb-2"><strong>Laboratorio:</strong> {currentRequest.laboratory.name}</p>
            <p className="mb-2"><strong>Tipo Material:</strong> {currentRequest.materialType.name}</p>

            <div className="mb-2">
              <label>Selecciona material</label>
              <select
                className="w-full border p-2"
                onChange={e => setSelectedMaterial(e.target.value)}
                value={selectedMaterial}
              >
                <option value="">Selecciona un material disponible</option>
                {currentRequest.materialType.materials.map(mat => (
                  <option key={mat.id} value={mat.id}>
                    {mat.inventory_number} ({mat.condition})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label>Accesorios</label>
              <input
                type="text"
                className="w-full border p-2"
                value={accessories}
                onChange={e => setAccessories(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label>Fecha de devolución</label>
              <input
                type="date"
                className="w-full border p-2"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setCurrentRequest(null)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleApproveRequest}
              >
                Aprobar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
