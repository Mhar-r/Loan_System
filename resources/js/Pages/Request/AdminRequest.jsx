import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from "sweetalert2";
import { usePage } from '@inertiajs/react';

const AdminRequests = () => {
  const [showApprovalFields, setShowApprovalFields] = useState(true);
  const [requests, setRequests] = useState([]);
  const [materialsInputs, setMaterialsInputs] = useState({});
  const [materialsOptions, setMaterialsOptions] = useState({});

  // Filtros
  const [searchLab, setSearchLab] = useState("");
  const [searchStudent, setSearchStudent] = useState("");

  const { auth } = usePage().props;
  const currentUser = auth.user;

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.withCredentials = true;
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/requests/pending");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error al obtener solicitudes:", err);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const labMatch = searchLab === "" || req.laboratory?.name === searchLab;
    const fullName = `${req.student?.name ?? ""} ${req.student?.first_surname ?? ""} ${req.student?.second_surname ?? ""}`.toLowerCase();
    const studentId = req.student?.student_id?.toLowerCase() ?? "";
    const studentMatch = searchStudent === "" || fullName.includes(searchStudent.toLowerCase()) || studentId.includes(searchStudent.toLowerCase());
    return labMatch && studentMatch;
  });

  const handleApprove = (request) => {
    const materialsArray = Array.isArray(request.materials) ? request.materials : [];
    const initialMaterials = materialsArray.map((mat) => ({
      material_type_id: mat.material_type_id,
      material_id: mat.material_id || null,
      inventory_number: mat.inventory_number || "",
      accessories: mat.accessories || "",
    }));

    setMaterialsInputs((prev) => ({
      ...prev,
      [request.id]: {
        generalAccessories: request.accessories || "",
        materials: initialMaterials,
      },
    }));
  };


  const handleCancel = (id) => {
    Swal.fire({
      title: '¿Cancelar solicitud?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/requests/${id}/cancel`)
          .then(res => {
            Swal.fire('Cancelada', 'La solicitud ha sido cancelada.', 'success');
            fetchRequests(); // Refresca la lista
          })
          .catch(err => {
            Swal.fire('Error', 'No se pudo cancelar la solicitud.', 'error');
          });
      }
    });
  };


  const handleInputChange = (requestId, index, field, value) => {
    setMaterialsInputs((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        materials: prev[requestId].materials.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const searchMaterials = async (typeId, query, requestId, index, labId) => {
    try {
      const res = await axios.get("/api/materials/search-by-type", {
        params: { type_id: typeId, lab_id: labId, query },
      });
      setMaterialsOptions((prev) => ({
        ...prev,
        [`${requestId}-${index}`]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMaterial = (requestId, index, material) => {
    setMaterialsInputs((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        materials: prev[requestId].materials.map((item, i) =>
          i === index
            ? { ...item, material_id: material.id, inventory_number: material.inventory_number }
            : item
        ),
      },
    }));

    setMaterialsOptions((prev) => ({
      ...prev,
      [`${requestId}-${index}`]: [],
    }));
  };

  const handleRegisterLoan = async (request) => {
    const inputsData = materialsInputs[request.id];
    if (!inputsData || inputsData.materials.some((i) => !i.material_id)) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debes seleccionar un material válido para cada item.",
      });
      return;
    }

    const payload = inputsData.materials.map((i) => ({
      material_id: i.material_id,
      accessories: i.accessories || null,
    }));

    try {
      const res = await axios.post(`/api/requests/${request.id}/approve`, {
        materials: payload,
        general_accessories: inputsData.generalAccessories || null,
        manager_id: currentUser.id,
      });

      if (res.data.success) {
        Swal.fire("Préstamo registrado", res.data.message, "success");
        fetchRequests();
        setMaterialsInputs((prev) => ({ ...prev, [request.id]: null }));
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Hubo un error al registrar el préstamo.",
        "error"
      );
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="card-base">
        <h1 className="text-3xl title-primary mb-6">Solicitudes Pendientes</h1>

        {/* Filtros */}
        <div className="mb-4 w-72">
          <select
            value={searchLab}
            onChange={(e) => setSearchLab(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Todos los laboratorios</option>
            {[...new Set(requests.map(r => r.laboratory?.name))].map(
              (lab, i) =>
                lab && <option key={i} value={lab}>{lab}</option>
            )}
          </select>
        </div>

        <div className="mb-4 w-80">
          <input
            type="text"
            placeholder="Buscar alumno por nombre o matrícula..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-gray-700">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Estudiante</th>
                <th className="p-2 border">Materia</th>
                <th className="p-2 border">Laboratorio</th>
                <th className="p-2 border">Accesorios / Materiales</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="text-center">
                    <td className="p-2 border">{req.id}</td>
                    <td className="p-2 border text-left">
                      <b>Nombre:</b> {req.student?.name ?? "—"} {req.student?.first_surname} {req.student?.second_surname}<br/>
                      <b>Matrícula:</b> {req.student?.student_id ?? "—"}<br/>
                      <b>Carrera:</b> {req.student?.major ?? "—"}<br/>
                      <b>Grupo:</b> {req.student?.group_name ?? "—"}
                    </td>
                    <td className="p-2 border">{req.subject ?? "—"}</td>
                    <td className="p-2 border">{req.laboratory?.name ?? "—"}</td>
                    <td className="p-2 border text-left">
                      <b>Accesorios generales:</b> {req.accessories || "—"}<br/>
                      <b>Materiales:</b>
                      <ul className="list-disc list-inside">
                        {req.materials?.length > 0 ? req.materials.map((m, j) => (
                          <li key={j}>
                            {m.material_type?.name ?? "—"} {m.accessories ? ` - Accesorios: ${m.accessories}` : ""}
                          </li>
                        )) : <li>—</li>}
                      </ul>
                    </td>
                    <td className="p-2 border">{req.status}</td>
                    <td className="p-2 border space-y-2">
                      {req.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(req)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Aprobar
                          </button>

                           <button
                              type="button"
                              onClick={() => handleCancel(req.id)}
                              className="bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Cancelar
                            </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 border text-center" colSpan="7">
                    No hay solicitudes en este laboratorio
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Inputs dinámicos para aprobación */}
        {Object.entries(materialsInputs).map(([requestId, inputsData]) =>
          inputsData && (
            <div key={requestId} className="mt-4 p-4 border rounded bg-gray-50">
              <h2 className="font-bold mb-2">
                Registrar préstamo para solicitud #{requestId}
              </h2>

              <div className="mb-4">
                <label className="font-semibold block mb-1">Accesorios generales</label>
                <input
                  type="text"
                  placeholder="Accesorios generales del préstamo"
                  value={inputsData.generalAccessories || ""}
                  className="w-full border p-2"
                  onChange={(e) =>
                    setMaterialsInputs((prev) => ({
                      ...prev,
                      [requestId]: {
                        ...prev[requestId],
                        generalAccessories: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              {inputsData.materials.map((input, index) => {
                const req = requests.find((r) => r.id === parseInt(requestId));
                const materialTypeId = req?.materials?.[index]?.material_type_id;

                return (
                  <div key={index} className="mb-4 border-b pb-2 rounded p-2 bg-white shadow-sm">
                    <p className="font-semibold mb-2">
                      Material solicitado: {req?.materials?.[index]?.material_type?.name ?? "—"}
                    </p>

                    <input
                      type="text"
                      placeholder="Buscar número de inventario"
                      value={input.inventory_number}
                      className="w-full border p-2 mb-2"
                      onChange={(e) => {
                        handleInputChange(requestId, index, "inventory_number", e.target.value);
                        searchMaterials(materialTypeId, e.target.value, requestId, index, req?.laboratory?.id);
                      }}
                    />

                    {materialsOptions[`${requestId}-${index}`]?.length > 0 && (
                      <ul className="border p-2 max-h-40 overflow-y-auto bg-white">
                        {materialsOptions[`${requestId}-${index}`].map((mat) => (
                          <li
                            key={mat.id}
                            className="cursor-pointer hover:bg-gray-200 p-1"
                            onClick={() => handleSelectMaterial(requestId, index, mat)}
                          >
                            {mat.inventory_number} - {mat.serial_number} ({mat.condition ?? "N/A"})
                          </li>
                        ))}
                      </ul>
                    )}

                    <input
                      type="text"
                      placeholder="Accesorios individuales del material"
                      value={input.accessories || ""}
                      className="w-full border p-2 mt-2"
                      onChange={(e) =>
                        handleInputChange(requestId, index, "accessories", e.target.value)
                      }
                    />
                  </div>
                );
              })}

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleRegisterLoan(requests.find((r) => r.id === parseInt(requestId)))
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Registrar Préstamo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMaterialsInputs((prev) => ({ ...prev, [requestId]: null }))
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                >
                  Ocultar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default AdminRequests;
