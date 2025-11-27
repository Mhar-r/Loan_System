import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import AuthenticatedStudentLayout from "@/Layouts/AuthenticatedStudentLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SecurityQuestionForm() {
    const { flash, errors, student } = usePage().props;

    const [values, setValues] = useState({
        question: "",
        answer: "",
        current_password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleChange = (e) =>
        setValues({ ...values, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post("/security-question/store", values);
    };

    return (
        <AuthenticatedStudentLayout student={student}>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Pregunta de Seguridad</h2>

                {/* ALERTA DE ÉXITO */}
                {flash?.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                        {flash.success}
                    </div>
                )}

                {/* ALERTA GLOBAL DE ERROR */}
                {errors?.current_password && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                        {errors.current_password}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Contraseña actual */}
                    <label className="block font-medium">Contraseña actual:</label>
                    <div className="relative mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="current_password"
                            className="w-full border rounded p-2 pr-10"
                            value={values.current_password}
                            onChange={handleChange}
                        />

                        <span
                            className="absolute right-3 top-3 cursor-pointer text-xl"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>

                    {errors?.current_password && (
                        <p className="text-red-600 text-sm -mt-2 mb-2">{errors.current_password}</p>
                    )}

                    {/* Pregunta */}
                    <label className="block font-medium">Pregunta:</label>
                    <input
                        type="text"
                        name="question"
                        className="w-full border rounded p-2 mb-1"
                        value={values.question}
                        onChange={handleChange}
                    />

                    {errors?.question && (
                        <p className="text-red-600 text-sm mb-2">{errors.question}</p>
                    )}

                    {/* Respuesta */}
                    <label className="block font-medium">Respuesta:</label>
                    <div className="relative mb-3">
                        <input
                            type={showAnswer ? "text" : "password"}
                            name="answer"
                            className="w-full border rounded p-2 pr-10"
                            value={values.answer}
                            onChange={handleChange}
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer text-xl"
                            onClick={() => setShowAnswer(!showAnswer)}
                        >
                            {showAnswer ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>

                    {errors?.answer && (
                        <p className="text-red-600 text-sm -mt-2 mb-4">{errors.answer}</p>
                    )}

                    <button className="w-full bg-purple-700 text-white p-2 rounded">
                        Guardar
                    </button>
                </form>
            </div>
        </AuthenticatedStudentLayout>
    );
}
