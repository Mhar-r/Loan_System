import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, router } from "@inertiajs/react";
import AuthenticatedStudentLayout from "@/Layouts/AuthenticatedStudentLayout";

export default function Requests({ student }) {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const [labs, setLabs] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [subject, setSubject] = useState("");
  const [materials, setMaterials] = useState([{ material_type_id: "", accessories: "" }]);
  const [generalAccessories, setGeneralAccessories] = useState("");

  useEffect(() => {
    axios.get("/api/labs").then(res => setLabs(res.data));
  }, []);

  useEffect(() => {
    if (selectedLab) {
      axios.get(`/api/material-types/by-lab/${selectedLab}`)
        .then(res => setMaterialTypes(res.data));
    } else {
      setMaterialTypes([]);
    }
  }, [selectedLab]);

  const addMaterial = () =>
    setMaterials([...materials, { material_type_id: "", accessories: "" }]);

  const removeMaterial = (index) =>
    setMaterials(materials.filter((_, i) => i !== index));

  const updateMaterial = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  const submitRequest = (e) => {
    e.preventDefault();

    if (!selectedLab || !subject || materials.some(m => !m.material_type_id)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Completa todos los campos obligatorios",
        confirmButtonColor: "#6A32A8",
      });
      return;
    }

    router.post(
      route("student.requests.store"),
      {
        laboratory_id: selectedLab,
        subject,
        accessories: generalAccessories,
        materials,
      },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Solicitud enviada",
            text: "Tu solicitud se envió correctamente",
            confirmButtonColor: "#6A32A8",
          });

          // Limpia el formulario
          setSelectedLab("");
          setSubject("");
          setGeneralAccessories("");
          setMaterials([{ material_type_id: "", accessories: "" }]);
        },
        onError: (errors) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error al enviar la solicitud",
            confirmButtonColor: "#6A32A8",
          });
          console.error(errors);
        }
      }
    );
  };

  return (
      //<AuthenticatedStudentLayout student={student}>
    
      <div className="min-h-screen bg-[#F5F3FA] py-10 px-4">

        <div className="max-w-xl mx-auto mb-6">
          <a
            href={route("students.dashboard")}
            className="inline-block bg-[#441B69] text-white px-4 py-2 rounded-lg shadow hover:bg-[#6A32A8] transition"
          >
            ← Volver al inicio
          </a>
        </div>

        <form
          onSubmit={submitRequest}
          className="bg-white shadow-xl rounded-2xl max-w-xl mx-auto p-8 border border-gray-200"
        >

          <h2 className="text-2xl font-bold mb-6 text-[#441B69] text-center">
            Nueva Solicitud de Material
          </h2>

          <input
            type="text"
            placeholder="Asignatura"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="border border-[#441B69] p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#7646B9]"
            required
          />

          <select
            value={selectedLab}
            onChange={e => setSelectedLab(e.target.value)}
            className="border border-[#441B69] p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#7646B9]"
          >
            <option value="">Selecciona un laboratorio</option>
            {labs.map(lab => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>

          {materials.map((mat, i) => (
            <div
              key={i}
              className="mb-4 border border-gray-300 p-3 rounded bg-gray-50"
            >
              <select
                value={mat.material_type_id}
                onChange={e => updateMaterial(i, "material_type_id", e.target.value)}
                className="border border-[#441B69] p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#7646B9]"
                disabled={!selectedLab}
              >
                <option value="">Selecciona un tipo de material</option>
                {materialTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Accesorios (opcional)"
                value={mat.accessories}
                onChange={e => updateMaterial(i, "accessories", e.target.value)}
                className="border border-[#441B69] p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7646B9]"
              />

              {materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMaterial(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
                >
                  Quitar material
                </button>
              )}
            </div>
          ))}

          <input
            type="text"
            placeholder="Accesorios generales (opcional)"
            value={generalAccessories}
            onChange={e => setGeneralAccessories(e.target.value)}
            className="border border-[#441B69] p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#7646B9]"
          />

          <button
            type="button"
            onClick={addMaterial}
            className="bg-[#7646B9] hover:bg-[#5A2E93] text-white px-4 py-2 rounded mb-4 w-full"
          >
            + Agregar material
          </button>

          <button
            type="submit"
            className="bg-[#441B69] hover:bg-[#2E0F4C] text-white px-4 py-2 rounded w-full font-semibold"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
      //</AuthenticatedStudentLayout>
    
  );
}
