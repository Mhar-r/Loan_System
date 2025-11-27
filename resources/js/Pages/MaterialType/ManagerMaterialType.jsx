import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { Head } from "@inertiajs/react";
import { FaPen, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManagerMaterialType({ materialTypes: initialTypes, laboratories }) {
    const [materialTypes, setMaterialTypes] = useState(initialTypes || []);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        laboratory_id: "",
    });
    const [errors, setErrors] = useState({});

    // 🔹 Cargar desde API por si cambia algo
    const fetchTypes = () => {
        axios.get("/api/material-types").then((res) => {
            
    setMaterialTypes(Array.isArray(res.data) ? res.data : res.data.materialTypes || []);
});
    }

    useEffect(() => {
        fetchTypes();
    }, []);

    // 🧭 Manejadores de formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ name: "", laboratory_id: "" });
        setEditingType(null);
        setErrors({});
        setShowForm(false);
    };

    // 🟢 Crear o actualizar tipo
const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 🔎 Validar nombre duplicado en el mismo laboratorio
    const duplicate = materialTypes.find(
        (t) =>
            t.name.toLowerCase() === formData.name.trim().toLowerCase() &&
            t.laboratory_id === parseInt(formData.laboratory_id) &&
            t.id !== editingType?.id // si estás editando, no cuenta el mismo registro
    );

    if (duplicate) {
        Swal.fire({
            icon: "warning",
            title: "Nombre duplicado",
            text: "Ya existe un tipo de material con este nombre en el mismo laboratorio.",
        });
        return;
    }

    try {
        if (editingType) {
            if (!editingType?.id) {
                Swal.fire("Error", "No se pudo identificar el tipo a actualizar.", "error");
                return;
            }

            const response = await axios.post(`/api/material-types/update/${editingType.id}`, formData);

            setMaterialTypes((prev) =>
                prev.map((t) => (t.id === editingType.id ? response.data.materialType : t))
            );

            Swal.fire("Actualizado", "Tipo de material actualizado correctamente.", "success");
        }else {
            const res = await axios.post("/api/material-types", formData);
            setMaterialTypes((prev) => [...prev, res.data.materialType]);
            Swal.fire("Registrado", "Tipo de material registrado correctamente.", "success");
        }

        resetForm();
    } catch (err) {
        if (err.response?.status === 422) {
            setErrors(err.response.data.errors);
        } else {
            Swal.fire("Error", "Ocurrió un error al guardar el tipo.", "error");
        }
    }
};


    // 🗑️ Eliminar tipo
    
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar este tipo?",
            text: "No podrás deshacer esta acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axios.post(`/api/material-types/delete/${id}`);

            setMaterialTypes(prev => prev.filter(t => t.id !== id));
            Swal.fire("Eliminado", "Tipo eliminado correctamente.", "success");

        } catch (error) {
            console.log(error);
            Swal.fire("Error", "No se pudo eliminar", "error");
        }
    };



    // ✏️ Editar
    const handleEdit = (type) => {
        setEditingType(type);
        setFormData({
            name: type.name,
            laboratory_id: type.laboratory_id,
        });
        setShowForm(true);
    };

    // 🔍 Filtrar búsqueda
    const filteredTypes = materialTypes.filter((t) =>
        `${t.name} ${t.laboratory?.name || ""}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <>
                <Head title="Gestión de Tipos de Material" />

                <div className="min-h-screen bg-[#F5F3FA] py-12 px-6 text-gray-800">
                    <h1 className="text-4xl font-bold mb-8 text-center text-[#441B69]">
                        Gestión de Tipos de Material
                    </h1>

                    {/* 🔍 Buscador + Botón */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Buscar tipo..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-[#441B69] focus:outline-none"
                            />
                            <FaSearch className="absolute right-10 top-3 text-gray-500" />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-2">
                                    <FaTimes className="text-gray-500" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="bg-[#441B69] text-white py-2 px-6 rounded-xl hover:bg-[#5a2589] transition"
                        >
                            + Nuevo Tipo
                        </button>
                    </div>

                    {/* 📋 Tabla */}
                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                        <table className="min-w-full text-center text-gray-700">
                            <thead className="bg-[#441B69]/10 text-[#441B69] uppercase text-sm font-semibold">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Laboratorio</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTypes.length > 0 ? (
                                    filteredTypes.map((t, idx) => (
                                        <tr
                                            key={t.id}
                                            className={`${
                                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-[#F3E8FF]/40 transition`}
                                        >
                                            <td className="px-6 py-3">{t.id}</td>
                                            <td className="px-6 py-3">{t.name}</td>
                                            <td className="px-6 py-3">
                                                {t.laboratory?.name ||
                                                    laboratories.find((l) => l.id === t.laboratory_id)?.name ||
                                                    "-"}
                                            </td>
                                            <td className="px-6 py-3 flex justify-center gap-3">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => handleEdit(t)}
                                                >
                                                    <FaPen />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-6 text-gray-500 font-medium">
                                            No hay tipos de material
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 📌 Modal emergente */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative shadow-lg animate-slide-down">
                            <h2 className="text-2xl font-bold mb-6 text-center text-[#441B69]">
                                {editingType ? "Editar Tipo" : "Registrar Tipo"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Nombre" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="laboratory_id" value="Laboratorio" />
                                    <select
                                        id="laboratory_id"
                                        name="laboratory_id"
                                        value={formData.laboratory_id}
                                        onChange={handleChange}
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

                                <div className="flex justify-end gap-3 mt-6">
                                    <PrimaryButton
                                        type="button"
                                        className="bg-red-400 hover:bg-red-500 text-white"
                                        onClick={resetForm}
                                    >
                                        Cancelar
                                    </PrimaryButton>
                                    <PrimaryButton
                                        className="bg-[#441B69] hover:bg-[#5a2589] text-white"
                                    >
                                        {editingType ? "Actualizar" : "Registrar"}
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
