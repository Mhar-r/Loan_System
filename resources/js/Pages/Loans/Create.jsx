import axios from 'axios';
import debounce from 'lodash.debounce';
import { usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function RegisterLoan() {
  const { auth } = usePage().props;
  const currentUser = auth.user;

  const [accessoriesGlobal, setAccessoriesGlobal] = useState('');
  const [ReturnDate, setReturnDate] = useState('');
  const [subject, setSubject] = useState('');  // <-- nuevo campo subject

  const [matricula, setMatricula] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');

  const [materialTypes, setMaterialTypes] = useState([]);

  // Ahora materialsList es un array de objetos, cada uno representa un "material" a prestar con sus campos
  const [materialsList, setMaterialsList] = useState([
    {
      id: null,               // id del material seleccionado
      inventory_number: '',   // para buscar
      selectedMaterialType: '', 
      searchResults: [],      // resultados para ese material
      accessories: '',        // accesorios específicos para este material
      condition: '',         // condicion breve del material seleccionado
      
    }
  ]);

  // Cargar laboratorios al montar
  useEffect(() => {
    axios.get('/api/labs').then(res => {
      setLabs(res.data);
    });
  }, []);

  // Buscar estudiante por matrícula
  const handleSearchStudent = async () => {
    try {
      const res = await axios.get(`/api/students/search/${matricula}`);
      if (res.data.success) {
        setStudent(res.data.student);
        setError('');
      } else {
        setStudent(null);
        setError('Estudiante no encontrado.');
      }
    } catch {
      setStudent(null);
      setError('Error buscando estudiante.');
    }
  };

  // Cargar tipos de material cuando se seleccione un laboratorio
  useEffect(() => {
    if (selectedLab) {
      axios.get(`/api/material-types/by-lab/${selectedLab}`).then(res => {
        setMaterialTypes(res.data);
        // Reiniciamos materialsList cuando cambia lab
        setMaterialsList([
          {
            id: null,
            inventory_number: '',
            selectedMaterialType: '',
            searchResults: [],
            accessories: '',
            description: '',
          }
        ]);
      });
    }
  }, [selectedLab]);

  // Función para buscar materiales (debounced) por material index en la lista
  const debouncedSearch = debounce(async (query, index) => {
    const type_id = materialsList[index].selectedMaterialType;
    if (!type_id) return;
    try {
      const res = await axios.get('/api/materials/search-by-type', {
        params: { type_id, query }
      });
      updateMaterialField(index, 'searchResults', res.data);
    } catch (e) {
      updateMaterialField(index, 'searchResults', []);
    }
  }, 500);

  // Actualizar un campo dentro de materialsList en posición index
  const updateMaterialField = (index, field, value) => {
    setMaterialsList(oldList => {
      const newList = [...oldList];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  };

  // Cuando cambia el texto de búsqueda del material en un índice dado
  const handleSearchMaterialChange = (index, value) => {
    updateMaterialField(index, 'inventory_number', value);
    if (value.length > 0) {
      debouncedSearch(value, index);
    } else {
      updateMaterialField(index, 'searchResults', []);
    }
  };

  // Al seleccionar un material de la lista de búsqueda
  const handleSelectMaterial = (index, material) => {
    updateMaterialField(index, 'id', material.id);
    updateMaterialField(index, 'inventory_number', material.inventory_number);
    updateMaterialField(index, 'searchResults', []);
    updateMaterialField(index, 'condition', material.condition || ''); // usa descripción o condición
  };

  // Cambiar tipo de material para material en índice
  const handleChangeMaterialType = (index, value) => {
    updateMaterialField(index, 'selectedMaterialType', value);
    updateMaterialField(index, 'inventory_number', '');
    updateMaterialField(index, 'searchResults', []);
    updateMaterialField(index, 'id', null);
    updateMaterialField(index, 'condition', '');
  };

  // Cambiar accesorios específicos para material
  const handleChangeMaterialAccessories = (index, value) => {
    updateMaterialField(index, 'accessories', value);
  };

  // Agregar un nuevo material vacío
  const addNewMaterial = () => {
    setMaterialsList(oldList => [
      ...oldList,
      {
        id: null,
        inventory_number: '',
        selectedMaterialType: '',
        searchResults: [],
        accessories: '',
        description: '',
      }
    ]);
  };

  // Eliminar material por índice
  const removeMaterial = (index) => {
    setMaterialsList(oldList => oldList.filter((_, i) => i !== index));
  };

  // Registrar préstamo
const handleRegisterLoan = async () => {
  if (!student || !selectedLab || materialsList.length === 0 || !subject.trim()) {
    alert("Por favor completa todos los datos antes de guardar, incluyendo el asunto y materiales.");
    return;
  }

  // Validar que cada material tenga id y tipo
  for (const mat of materialsList) {
    if (!mat.id || !mat.selectedMaterialType) {
      alert("Por favor selecciona un tipo y un material válido para todos los materiales.");
      return;
    }
  }

  try {
    const res = await axios.post('/loans', {
      student_id: student.id,
      manager_id: currentUser.id,
      laboratory_id: selectedLab,
      accessories: accessoriesGlobal,
      return_date: ReturnDate || null,
      subject: subject.trim(),
      materials: materialsList.map(m => ({
        id: m.id,
        accessories: m.accessories,
      })),
    });

    // ✅ Éxito
    if (res.data.success) {
      alert(res.data.message);

      // limpiar formulario
      setMatricula('');
      setStudent(null);
      setSelectedLab('');
      setMaterialsList([
        {
          id: null,
          inventory_number: '',
          selectedMaterialType: '',
          searchResults: [],
          accessories: '',
          condition: '',
        }
      ]);
      setAccessoriesGlobal('');
      setReturnDate('');
      setSubject('');
    } else {
      // ⚠️ Error lógico (ej: material ya prestado)
      alert(res.data.message);
    }

  } catch (error) {
    console.error(error);

    if (error.response?.data?.message) {
      alert(error.response.data.message); // mensaje del backend
    } else {
      alert("Error guardando préstamo");
    }
  }
};


  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Préstamo</h1>

      

      {/* Buscar estudiante */}
      <div className="mb-4">
        <label className="block mb-1">Matrícula Estudiante</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            onClick={handleSearchStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Datos estudiante */}
      {student && (
        <div className="border p-4 rounded bg-gray-50 mb-4">
          <h2 className="font-bold mb-2">Información del Estudiante</h2>
          <p><strong>Nombre:</strong> {student.name} {student.last_name} {student.second_last_name}</p>
          <p><strong>Carrera:</strong> {student.major}</p>
          <p><strong>Grupo:</strong> {student.group_name}</p>
          <p><strong>Email:</strong> {student.email}</p>
        </div>
      )}

      {/* Seleccionar laboratorio */}
      <div className="mb-4">
        <label>Laboratorio</label>
        <select
          className="w-full border p-2"
          value={selectedLab}
          onChange={e => setSelectedLab(e.target.value)}
        >
          <option value="">Selecciona un laboratorio</option>
          {labs.map(lab => (
            <option key={lab.id} value={lab.id}>{lab.name}</option>
          ))}
        </select>
      </div>

      {/* Lista dinámica de materiales */}
      {materialsList.map((mat, index) => (
        <div key={index} className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Material {index + 1}</h3>

          {/* Tipo de Material */}
          <div className="mb-2">
            <label>Tipo de Material</label>
            <select
              className="w-full border p-2"
              value={mat.selectedMaterialType}
              onChange={e => handleChangeMaterialType(index, e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {materialTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Buscar material */}
          {mat.selectedMaterialType && (
            <div className="mb-2">
              <label>Buscar material por número de inventario</label>
              <input
                type="text"
                className="w-full border p-2"
                placeholder="Escribe número de inventario"
                value={mat.inventory_number}
                onChange={e => handleSearchMaterialChange(index, e.target.value)}
              />
              {mat.searchResults.length > 0 && (
                <ul className="border rounded mt-2 max-h-40 overflow-y-auto">
                  {mat.searchResults.map(material => (
                    <li
                      key={material.id}
                      className="p-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectMaterial(index, material)}
                    >
                      {material.inventory_number} ({material.condition})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Descripción breve */}
          {mat.description && (
            <p className="mb-2 italic text-gray-600">Descripción: {mat.description}</p>
          )}

          {/* Accesorios para este material */}
          <div className="mb-2">
            <label>Accesorios del material</label>
            <input
              type="text"
              className="w-full border p-2"
              placeholder="Ej: Cable, estuche, etc."
              value={mat.accessories}
              onChange={e => handleChangeMaterialAccessories(index, e.target.value)}
            />
          </div>

          {/* Botón eliminar material (solo si hay más de uno) */}
          {materialsList.length > 1 && (
            <button
              onClick={() => removeMaterial(index)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar este material
            </button>
          )}
        </div>
      ))}

      {/* Botón para agregar material */}
      <button
        onClick={addNewMaterial}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Agregar otro material
      </button>

      {/* Accesorios globales */}
      <div className="mb-4">
        <label>Accesorios generales</label>
        <input
          type="text"
          className="w-full border p-2"
          value={accessoriesGlobal}
          onChange={e => setAccessoriesGlobal(e.target.value)}
          placeholder="Ej: Cable de alimentación"
        />
      </div>

      {/* Fecha esperada de devolución */}
      <div className="mb-4">
        <label>Fecha esperada de devolución</label>
        <input
          type="date"
          className="w-full border p-2"
          value={ReturnDate}
          onChange={e => setReturnDate(e.target.value)}
        />
      </div>

      {/* Campo Subject */}
      <div className="mb-4">
        <label>Materia</label>
        <input
          type="text"
          className="w-full border p-2"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Escribe el asunto o motivo"
        />
      </div>

      {/* Resumen breve de materiales seleccionados */}
{materialsList.length > 0 && (
  <div className="mb-6 p-4 border rounded bg-gray-100">
    <h2 className="font-bold mb-3 text-lg">Resumen de materiales seleccionados</h2>
    <ul className="list-disc list-inside space-y-2 max-h-48 overflow-y-auto">
      {materialsList.map((mat, i) => (
        <li key={i} className="text-sm">
          <strong>Material {i + 1}:</strong>{' '}
          <span>
          Inv.  {mat.inventory_number || 'N/A'} — Condición: {mat.condition || 'N/A'} — Accesorios: {mat.accessories || 'Ninguno'}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}


      {/* Botón registrar */}
      <button
        onClick={handleRegisterLoan}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar Préstamo
      </button>
    </div>
  );
}
