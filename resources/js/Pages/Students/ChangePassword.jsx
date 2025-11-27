import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AuthenticatedStudentLayout from "@/Layouts/AuthenticatedStudentLayout";
import Swal from "sweetalert2";

export default function ChangePassword() {
    const { errors, student, flash } = usePage().props;

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [values, setValues] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        // Mostrar alerta de éxito si viene flash message
        if (flash.success) {
            Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    const change = (e) =>
        setValues({ ...values, [e.target.name]: e.target.value });

    const submit = (e) => {
        e.preventDefault();
        Inertia.post(route("student.password.update"), values);
    };

    return (
        <AuthenticatedStudentLayout student={student}>
            <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4">Cambiar contraseña</h2>

                <form onSubmit={submit} className="space-y-4">
                    {/* Contraseña actual */}
                    <div>
                        <label>Contraseña actual:</label>
                        <div className="relative">
                            <input
                                type={show.current ? "text" : "password"}
                                name="current_password"
                                className="w-full border p-2 pr-10"
                                onChange={change}
                            />
                            <span
                                className="absolute right-2 top-3 cursor-pointer"
                                onClick={() =>
                                    setShow({ ...show, current: !show.current })
                                }
                            >
                                {show.current ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {errors.current_password && (
                            <p className="text-red-600 text-sm">{errors.current_password}</p>
                        )}
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <label>Nueva contraseña:</label>
                        <div className="relative">
                            <input
                                type={show.new ? "text" : "password"}
                                name="password"
                                className="w-full border p-2 pr-10"
                                onChange={change}
                            />
                            <span
                                className="absolute right-2 top-3 cursor-pointer"
                                onClick={() =>
                                    setShow({ ...show, new: !show.new })
                                }
                            >
                                {show.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-sm">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                        <label>Confirmar contraseña:</label>
                        <div className="relative">
                            <input
                                type={show.confirm ? "text" : "password"}
                                name="password_confirmation"
                                className="w-full border p-2 pr-10"
                                onChange={change}
                            />
                            <span
                                className="absolute right-2 top-3 cursor-pointer"
                                onClick={() =>
                                    setShow({ ...show, confirm: !show.confirm })
                                }
                            >
                                {show.confirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>

                    <button className="w-full bg-purple-700 text-white px-4 py-2 rounded">
                        Guardar cambios
                    </button>
                </form>
            </div>
        </AuthenticatedStudentLayout>
    );
}
