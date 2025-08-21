import { useEffect, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPen, FaTrash, FaTimes, FaSearch } from "react-icons/fa";

export default function UsersManager() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState("");

    const { data, setData, reset, errors } = useForm({
        name: "",
        first_surname: "",
        second_surname: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role_id: "",
    });

    const fetchData = () => {
        axios.get("/api/roles").then((res) => setRoles(res.data));
        axios.get("/api/users").then((res) => setUsers(res.data));
    };

    useEffect(() => {
        fetchData();
        return () => reset("password", "password_confirmation");
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            axios
                .put(`/api/users/${editingUser.id}`, data)
                .then((res) => {
                    Swal.fire("Éxito", res.data.message, "success");
                    fetchData();
                    reset();
                    setEditingUser(null);
                    setShowForm(false);
                })
                .catch((err) =>
                    Swal.fire(
                        "Error",
                        err.response?.data?.message || "Error",
                        "error"
                    )
                );
        } else {
            axios
                .post("/api/users", data)
                .then((res) => {
                    Swal.fire("Éxito", res.data.message, "success");
                    fetchData();
                    reset();
                    setShowForm(false);
                })
                .catch((err) =>
                    Swal.fire(
                        "Error",
                        err.response?.data?.message || "Error",
                        "error"
                    )
                );
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            first_surname: user.first_surname,
            second_surname: user.second_surname,
            email: user.email,
            phone: user.phone,
            password: "",
            password_confirmation: "",
            role_id: user.role_id,
        });
        setShowForm(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Eliminar usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/users/${id}`).then(() => {
                    Swal.fire("Eliminado", "Usuario eliminado", "success");
                    fetchData();
                });
            }
        });
    };

    const filteredUsers = users.filter((user) =>
        `${user.name} ${user.first_surname} ${user.second_surname}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Gestión de Usuarios" />

            {/* Contenedor central */}
            <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Gestión de Usuarios
                </h1>

                {/* Buscador + Botón */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-2 w-full md:w-1/2 relative">
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
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
                            setEditingUser(null);
                            setShowForm(true);
                        }}
                        className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        + Agregar Usuario
                    </PrimaryButton>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg shadow-sm">
                    <table className="min-w-full text-center border-collapse">
                        <thead className="bg-purple-100 text-gray-700 uppercase text-sm font-semibold">
                            <tr>
                                <th className="px-6 py-3">Nombre completo</th>
                                <th className="px-6 py-3">Correo</th>
                                <th className="px-6 py-3">Teléfono</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, idx) => (
                                    <tr
                                        key={user.id}
                                        className={`${
                                            idx % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        } hover:bg-yellow-50 transition-colors`}
                                    >
                                        <td className="px-6 py-3">{`${user.name} ${user.first_surname} ${user.second_surname}`}</td>
                                        <td className="px-6 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-3">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-3">
                                            {roles.find(
                                                (r) => r.id === user.role_id
                                            )?.name || "-"}
                                        </td>
                                        <td className="px-6 py-3 flex justify-center gap-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleEdit(user)}
                                                title="Editar"
                                            >
                                                <FaPen />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    handleDelete(user.id)
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
                                        colSpan="5"
                                        className="py-6 text-gray-500 font-medium"
                                    >
                                        No hay usuarios
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Formulario Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative shadow-lg animate-slide-down">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {editingUser
                                ? "Editar Usuario"
                                : "Registrar Usuario"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nombre(s)"
                                    />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="first_surname"
                                        value="Apellido Paterno"
                                    />
                                    <TextInput
                                        id="first_surname"
                                        value={data.first_surname}
                                        onChange={(e) =>
                                            setData(
                                                "first_surname",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.first_surname}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="second_surname"
                                        value="Apellido Materno"
                                    />
                                    <TextInput
                                        id="second_surname"
                                        value={data.second_surname}
                                        onChange={(e) =>
                                            setData(
                                                "second_surname",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.second_surname}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Correo Electrónico"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="phone"
                                        value="Teléfono"
                                    />
                                    <TextInput
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="role_id"
                                        value="Rol de Usuario"
                                    />
                                    <select
                                        id="role_id"
                                        value={data.role_id}
                                        onChange={(e) =>
                                            setData("role_id", e.target.value)
                                        }
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 transition"
                                    >
                                        <option value="">
                                            Selecciona un rol
                                        </option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.role_id} />
                                </div>
                                {!editingUser && (
                                    <>
                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Contraseña"
                                            />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirmar Contraseña"
                                            />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>
                                    </>
                                )}
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
                                    {editingUser ? "Actualizar" : "Registrar"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
