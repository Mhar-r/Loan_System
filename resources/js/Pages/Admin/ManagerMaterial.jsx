import { useEffect, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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

    // 🧩 useForm con validaciones de Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        material_type_id: "",
        brand: "",
        inventory_number: "",
        serial_number: "",
        condition: "",
        status: "Available",
        laboratory_id: "",
    });

    // 🔹 Cargar materiales, tipos y laboratorios
    const fetchMaterials = () => {
        axios.get("/api/materials").then((res) => setMaterials(res.data));
    };

    const fetchOptions = () => {
        axios.get("/api/material-types").then((res) => setMaterialTypes(res.data));
        axios.get("/api/labs").then((res) => setLaboratories(res.data));
    };

    useEffect(() => {
        fetchMaterials();
        fetchOptions();
        return () => reset();
    }, []);

    // 🔹 Guardar / Actualizar Material
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingMaterial) {
            // 🔸 Actualizar (usando axios directo)
            axios
                .post(`/api/materials/update/${editingMaterial.id}`, data)
                .then(() => {
                    Swal.fire("Éxito", "Material actualizado correctamente.", "success");
                    fetchMaterials();
                    reset();
                    setEditingMaterial(null);
                    setShowForm(false);
                })
                .catch((err) => {
                    const message =
                        err.response?.data?.message || "No se pudo actualizar el material.";
                    Swal.fire("Error", message, "error");
                });
        } else {
            // 🟢 Registrar (con validación de Laravel vía Inertia)
            post(route("material.store"), {
                onSuccess: () => {
                    Swal.fire("Éxito", "Material registrado correctamente.", "success");
                    fetchMaterials();
                    reset();
                    setShowForm(false);
                },
                onError: (errors) => {
                    const errorMessages = Object.values(errors).flat().join("\n");
                    Swal.fire("Error", errorMessages, "error");
                },
            });
        }
    };

    // 🔹 Editar material
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

    // 🔹 Eliminar material
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar material?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/materials/delete/${id}`).then(() => {
                    Swal.fire("Eliminado", "Material eliminado correctamente.", "success");
                    fetchMaterials();
                }).catch(() => {
                    Swal.fire("Error", "No se pudo eliminar el material", "error");
                });
            }
        });
    };


    // 🔹 Filtrar búsqueda
    const filteredMaterials = materials.filter((m) =>
        `${m.brand} ${m.inventory_number} ${m.serial_number}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <>
                <Head title="Gestión de Materiales" />

                <div className="min-h-screen bg-[#F5F3FA] py-12 px-6 text-gray-800">
                    <h1 className="text-4xl font-bold mb-8 text-center text-[#441B69]">
                        Inventario de Materiales
                    </h1>

                    {/* 🔍 Buscador + Botón */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Buscar material..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-[#441B69] focus:outline-none"
                            />
                            <FaSearch className="absolute right-10 top-3 text-gray-500" />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-2"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            )}
                        </div>

                        {/* ✅ Botón para abrir modal */}
                        <button
                            onClick={() => {
                                reset();
                                setEditingMaterial(null);
                                setShowForm(true);
                            }}
                            className="btn-secondary bg-[#441B69] text-white py-2 px-6 rounded-xl hover:bg-[#5a2589] transition"
                        >
                            + Agregar Material
                        </button>
                    </div>

                    {/* 📋 Tabla */}
                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                        <table className="min-w-full text-center text-gray-700">
                            <thead className="bg-[#441B69]/10 text-[#441B69] uppercase text-sm font-semibold">
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
                                            } hover:bg-[#F3E8FF]/40 transition`}
                                        >
                                            <td className="px-6 py-3">
                                                {materialTypes.find(
                                                    (mt) => mt.id === m.material_type_id
                                                )?.name || m.material_type_id}
                                            </td>
                                            <td className="px-6 py-3">{m.brand}</td>
                                            <td className="px-6 py-3">{m.inventory_number}</td>
                                            <td className="px-6 py-3">{m.serial_number}</td>
                                            <td className="px-6 py-3">{m.condition}</td>
                                            <td className="px-6 py-3">{m.status}</td>
                                            <td className="px-6 py-3">
                                                {laboratories.find(
                                                    (lab) => lab.id === m.laboratory_id
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
                                                    onClick={() => handleDelete(m.id)}
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
                                {editingMaterial ? "Editar Material" : "Registrar Material"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Tipo */}
                                    <div>
                                        <InputLabel htmlFor="material_type_id" value="Tipo" />
                                        <select
                                            id="material_type_id"
                                            value={data.material_type_id}
                                            onChange={(e) =>
                                                setData("material_type_id", e.target.value)
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                            required
                                        >
                                            <option value="">-- Selecciona Tipo --</option>
                                            {materialTypes.map((mt) => (
                                                <option key={mt.id} value={mt.id}>
                                                    {mt.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.material_type_id} />
                                    </div>

                                    {/* Marca */}
                                    <div>
                                        <InputLabel htmlFor="brand" value="Marca" />
                                        <TextInput
                                            id="brand"
                                            value={data.brand}
                                            onChange={(e) => setData("brand", e.target.value)}
                                        />
                                        <InputError message={errors.brand} />
                                    </div>

                                    {/* Inventario */}
                                    <div>
                                        <InputLabel htmlFor="inventory_number" value="Inventario" />
                                        <TextInput
                                            id="inventory_number"
                                            value={data.inventory_number}
                                            onChange={(e) =>
                                                setData("inventory_number", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError message={errors.inventory_number} />
                                    </div>

                                    {/* Serie */}
                                    <div>
                                        <InputLabel htmlFor="serial_number" value="Serie" />
                                        <TextInput
                                            id="serial_number"
                                            value={data.serial_number}
                                            onChange={(e) =>
                                                setData("serial_number", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.serial_number} />
                                    </div>

                                    {/* Condición */}
                                    <div>
                                        <InputLabel htmlFor="condition" value="Condición" />
                                        <select
                                            id="condition"
                                            value={data.condition}
                                            onChange={(e) => setData("condition", e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                        >
                                            <option value="">Selecciona</option>
                                            <option value="Good">Buena</option>
                                            <option value="Fair">Regular</option>
                                            <option value="Poor">Mala</option>
                                        </select>
                                        <InputError message={errors.condition} />
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Estado" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData("status", e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                        >
                                            <option value="Available">Disponible</option>
                                            <option value="Loaned">Prestado</option>
                                            <option value="Under Repair">En reparación</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* Laboratorio */}
                                    <div>
                                        <InputLabel htmlFor="laboratory_id" value="Laboratorio" />
                                        <select
                                            id="laboratory_id"
                                            value={data.laboratory_id}
                                            onChange={(e) =>
                                                setData("laboratory_id", e.target.value)
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                            required
                                        >
                                            <option value="">-- Selecciona Laboratorio --</option>
                                            {laboratories.map((lab) => (
                                                <option key={lab.id} value={lab.id}>
                                                    {lab.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.laboratory_id} />
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <PrimaryButton
                                        type="button"
                                        className="bg-red-400 hover:bg-red-500 text-white"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancelar
                                    </PrimaryButton>
                                    <PrimaryButton
                                        disabled={processing}
                                        className="bg-blue-400 hover:bg-blue-500 text-white"
                                    >
                                        {editingMaterial ? "Actualizar" : "Registrar"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>
        </AuthenticatedLayout>
    );
}
