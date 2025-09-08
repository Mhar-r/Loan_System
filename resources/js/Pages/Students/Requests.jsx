import { useState, useEffect } from "react";
import axios from "axios";

export default function NewRequest() {
  const [labs, setLabs] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [accessories, setAccessories] = useState("");

  useEffect(() => {
    axios.get("/api/labs")
      .then(res => setLabs(res.data))
      .catch(() => setLabs([]));
  }, []);

  // Cuando se selecciona un laboratorio, cargamos sus tipos de material
  useEffect(() => {
    if (selectedLab) {
      axios.get(`/api/material-types/by-lab/${selectedLab}`)
        .then(res => setMaterialTypes(res.data))
        .catch(() => setMaterialTypes([]));
    } else {
      setMaterialTypes([]);
    }
    setSelectedType("");
  }, [selectedLab]);

  const submitRequest = async (e) => {
    e.preventDefault();

    if (!selectedLab || !selectedType) {
      alert("Selecciona un laboratorio y un tipo de material.");
      return;
    }

    try {
      await axios.post("/api/requests", {
        student_id: 1, // 👈 aquí va el alumno logueado
        laboratory_id: selectedLab,
        material_type_id: selectedType,
        accessories,
      });
      alert("Solicitud enviada correctamente");
      setSelectedLab("");
      setSelectedType("");
      setAccessories("");
    } catch (error) {
      console.error(error);
      alert("Error al enviar solicitud");
    }
  };

  return (
    <form onSubmit={submitRequest} className="p-6 bg-white shadow rounded max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Material</h2>

      {/* Selección de laboratorio */}
      <select
        value={selectedLab}
        onChange={(e) => setSelectedLab(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="">Selecciona un laboratorio</option>
        {labs.map(lab => (
          <option key={lab.id} value={lab.id}>{lab.name}</option>
        ))}
      </select>

      {/* Selección de tipo de material */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="border p-2 mb-4 w-full"
        disabled={!selectedLab}
      >
        <option value="">Selecciona un tipo de material</option>
        {materialTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      {/* Accesorios opcionales */}
      <input
        type="text"
        placeholder="Accesorios (opcional)"
        value={accessories}
        onChange={(e) => setAccessories(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Enviar Solicitud
      </button>
    </form>
  );
}
