import { useEffect, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPen, FaTrash, FaTimes, FaSearch } from "react-icons/fa";

export default function ManagerMaterial() {
    const [materials, setMaterials] = useState([]);
    const [materialTypes, setMaterialTypes] = useState([]);
    const [laboratories, setLaboratories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [search, setSearch] = useState("");

    const { data, setData, reset, errors } = useForm({
        material_type_id: "",
        brand: "",
        inventory_number: "",
        serial_number: "",
        condition: "Good",
        status: "Available",
        laboratory_id: "",
    });

    // 🔹 Traer materiales
    const fetchMaterials = () => {
        axios.get("/api/materials").then((res) => setMaterials(res.data));
    };

    // 🔹 Traer tipos y laboratorios
    const fetchOptions = () => {
        axios
            .get("/api/material-types")
            .then((res) => setMaterialTypes(res.data));
        axios.get("/api/labs").then((res) => setLaboratories(res.data));
    };

    useEffect(() => {
        fetchMaterials();
        fetchOptions();
        return () => reset();
    }, []);

    // 🔹 Guardar/Actualizar
    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !data.material_type_id ||
            !data.inventory_number ||
            !data.laboratory_id
        ) {
            return Swal.fire(
                "Error",
                "Completa todos los campos obligatorios",
                "error"
            );
        }

        if (editingMaterial) {
            axios
                .put(`/api/materials/${editingMaterial.id}`, data)
                .then(() => {
                    Swal.fire("Éxito", "Material actualizado", "success");
                    fetchMaterials();
                    reset();
                    setEditingMaterial(null);
                    setShowForm(false);
                })
                .catch(() =>
                    Swal.fire("Error", "No se pudo actualizar", "error")
                );
        } else {
            axios
                .post("/api/materials", data)
                .then(() => {
                    Swal.fire("Éxito", "Material registrado", "success");
                    fetchMaterials();
                    reset();
                    setShowForm(false);
                })
                .catch(() =>
                    Swal.fire("Error", "No se pudo registrar", "error")
                );
        }
    };

    // 🔹 Editar
    const handleEdit = (material) => {
        setEditingMaterial(material);
        setData({
            material_type_id: material.material_type_id,
            brand: material.brand,
            inventory_number: material.inventory_number,
            serial_number: material.serial_number || "",
            condition: material.condition,
            status: material.status,
            laboratory_id: material.laboratory_id,
        });
        setShowForm(true);
    };

    // 🔹 Eliminar
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar material?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/materials/${id}`).then(() => {
                    Swal.fire("Eliminado", "Material eliminado", "success");
                    fetchMaterials();
                });
            }
        });
    };

    // 🔹 Filtro búsqueda
    const filteredMaterials = materials.filter((m) =>
        `${m.brand} ${m.inventory_number} ${m.serial_number}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Gestión de Materiales" />

            <div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Gestión de Materiales
                </h1>

                {/* 🔍 Buscador + Botón */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-2 w-full md:w-1/2 relative">
                        <input
                            type="text"
                            placeholder="Buscar material..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full transition"
                        />
                        <FaSearch className="absolute right-10 text-gray-400" />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2"
                            >
                                <FaTimes className="text-gray-400" />
                            </button>
                        )}
                    </div>
                    <PrimaryButton
                        onClick={() => {
                            reset();
                            setEditingMaterial(null);
                            setShowForm(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        + Agregar Material
                    </PrimaryButton>
                </div>

                {/* 📋 Tabla */}
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full text-center border-collapse">
                        <thead className="bg-blue-100 text-gray-700 uppercase text-sm font-semibold">
                            <tr>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Marca</th>
                                <th className="px-6 py-3">Inventario</th>
                                <th className="px-6 py-3">Serie</th>
                                <th className="px-6 py-3">Condición</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Laboratorio</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((m, idx) => (
                                    <tr
                                        key={m.id}
                                        className={`${
                                            idx % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-yellow-50 transition-colors`}
                                    >
                                        <td className="px-6 py-3">
                                            {materialTypes.find(
                                                (mt) =>
                                                    mt.id === m.material_type_id
                                            )?.name || m.material_type_id}
                                        </td>
                                        <td className="px-6 py-3">{m.brand}</td>
                                        <td className="px-6 py-3">
                                            {m.inventory_number}
                                        </td>
                                        <td className="px-6 py-3">
                                            {m.serial_number}
                                        </td>
                                        <td className="px-6 py-3">
                                            {m.condition}
                                        </td>
                                        <td className="px-6 py-3">
                                            {m.status}
                                        </td>
                                        <td className="px-6 py-3">
                                            {laboratories.find(
                                                (lab) =>
                                                    lab.id === m.laboratory_id
                                            )?.name || m.laboratory_id}
                                        </td>
                                        <td className="px-6 py-3 flex justify-center gap-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleEdit(m)}
                                                title="Editar"
                                            >
                                                <FaPen />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    handleDelete(m.id)
                                                }
                                                title="Eliminar"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="py-6 text-gray-500 font-medium"
                                    >
                                        No hay materiales
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 📌 Modal Formulario */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-lg animate-slide-down">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {editingMaterial
                                ? "Editar Material"
                                : "Registrar Material"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tipo */}
                                <div>
                                    <InputLabel
                                        htmlFor="material_type_id"
                                        value="Tipo"
                                    />
                                    <select
                                        id="material_type_id"
                                        value={data.material_type_id}
                                        onChange={(e) =>
                                            setData(
                                                "material_type_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                        required
                                    >
                                        <option value="">
                                            -- Selecciona Tipo --
                                        </option>
                                        {materialTypes.map((mt) => (
                                            <option key={mt.id} value={mt.id}>
                                                {mt.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.material_type_id}
                                    />
                                </div>
                                {/* Marca */}
                                <div>
                                    <InputLabel htmlFor="brand" value="Marca" />
                                    <TextInput
                                        id="brand"
                                        value={data.brand}
                                        onChange={(e) =>
                                            setData("brand", e.target.value)
                                        }
                                    />
                                    <InputError message={errors.brand} />
                                </div>
                                {/* Inventario */}
                                <div>
                                    <InputLabel
                                        htmlFor="inventory_number"
                                        value="Inventario"
                                    />
                                    <TextInput
                                        id="inventory_number"
                                        value={data.inventory_number}
                                        onChange={(e) =>
                                            setData(
                                                "inventory_number",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.inventory_number}
                                    />
                                </div>
                                {/* Serie */}
                                <div>
                                    <InputLabel
                                        htmlFor="serial_number"
                                        value="Serie"
                                    />
                                    <TextInput
                                        id="serial_number"
                                        value={data.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                "serial_number",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.serial_number}
                                    />
                                </div>
                                {/* Condición */}
                                <div>
                                    <InputLabel
                                        htmlFor="condition"
                                        value="Condición"
                                    />
                                    <select
                                        id="condition"
                                        value={data.condition}
                                        onChange={(e) =>
                                            setData("condition", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                    <InputError message={errors.condition} />
                                </div>
                                {/* Estado */}
                                <div>
                                    <InputLabel
                                        htmlFor="status"
                                        value="Estado"
                                    />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="Available">
                                            Available
                                        </option>
                                        <option value="Loaned">Loaned</option>
                                        <option value="Under Repair">
                                            Under Repair
                                        </option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                                {/* Laboratorio */}
                                <div>
                                    <InputLabel
                                        htmlFor="laboratory_id"
                                        value="Laboratorio"
                                    />
                                    <select
                                        id="laboratory_id"
                                        value={data.laboratory_id}
                                        onChange={(e) =>
                                            setData(
                                                "laboratory_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                        required
                                    >
                                        <option value="">
                                            -- Selecciona Laboratorio --
                                        </option>
                                        {laboratories.map((lab) => (
                                            <option key={lab.id} value={lab.id}>
                                                {lab.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.laboratory_id}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <PrimaryButton
                                    type="button"
                                    className="bg-red-400 hover:bg-red-500 text-white"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </PrimaryButton>
                                <PrimaryButton className="bg-blue-400 hover:bg-blue-500 text-white">
                                    {editingMaterial
                                        ? "Actualizar"
                                        : "Registrar"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
