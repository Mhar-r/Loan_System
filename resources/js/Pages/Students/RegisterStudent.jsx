import React from "react";
// resources/js/Pages/Auth/RegisterStudent.jsx

import { useForm } from "@inertiajs/react";

export default function RegisterStudent() {
    const { data, setData, post, processing, errors } = useForm({
        student_id: "",
        name: "",
        first_surname: "",
        second_surname: "",
        major: "",
        group_name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("students.store"));
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Registro de Estudiantes</h2>

            <form onSubmit={submit} className="space-y-4">
                <input
                    type="text"
                    value={data.student_id}
                    onChange={(e) => setData("student_id", e.target.value)}
                    placeholder="Matrícula"
                    className="w-full p-2 border rounded"
                />
                {errors.student_id && (
                    <div className="text-red-500">{errors.student_id}</div>
                )}

                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Nombre(s)"
                    className="w-full p-2 border rounded"
                />
                {errors.name && (
                    <div className="text-red-500">{errors.name}</div>
                )}

                <input
                    type="text"
                    value={data.first_surname}
                    onChange={(e) => setData("first_surname", e.target.value)}
                    placeholder="Primer Apellido"
                    className="w-full p-2 border rounded"
                />
                {errors.first_surname && (
                    <div className="text-red-500">{errors.first_surname}</div>
                )}

                <input
                    type="text"
                    value={data.second_surname}
                    onChange={(e) => setData("second_surname", e.target.value)}
                    placeholder="Segundo Apellido"
                    className="w-full p-2 border rounded"
                />
                {errors.second_surname && (
                    <div className="text-red-500">{errors.second_surname}</div>
                )}

                <select
                    value={data.major}
                    onChange={(e) => setData("major", e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Selecciona tu carrera</option>
                    <option value="Systems">Software</option>
                    <option value="Electronics">Electrónica</option>
                    <option value="Mechatronics">Mecatrónica</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Other">Otra</option>
                </select>
                {errors.major && (
                    <div className="text-red-500">{errors.major}</div>
                )}

                <input
                    type="text"
                    value={data.group_name}
                    onChange={(e) => setData("group_name", e.target.value)}
                    placeholder="Grupo (opcional)"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="Teléfono (opcional)"
                    className="w-full p-2 border rounded"
                />

                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="Correo electrónico"
                    className="w-full p-2 border rounded"
                />
                {errors.email && (
                    <div className="text-red-500">{errors.email}</div>
                )}

                

                <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Contraseña"
                    className="w-full p-2 border rounded"
                />
                {errors.password && (
                    <div className="text-red-500">{errors.password}</div>
                )}

                <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="w-full p-2 border rounded"
                />


                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}
