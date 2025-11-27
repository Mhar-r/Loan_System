import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SecurityQuestionFormUser() {
  const { flash, auth } = usePage().props;

  const [showPassword, setShowPassword] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const [values, setValues] = useState({
    question: '',
    answer: '',
    current_password: '',
  });

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post('/user/security-question/store', values);
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        
        <h2 className="text-xl font-bold mb-4">Pregunta de Seguridad</h2>

        {flash?.success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            {flash.success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* CONTRASEÑA ACTUAL */}
          <label className="block font-medium">Contraseña actual:</label>
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="current_password"
              className="w-full border rounded p-2"
              value={values.current_password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
            </span>
          </div>

          {/* PREGUNTA */}
          <label className="block font-medium">Pregunta:</label>
          <input
            type="text"
            name="question"
            className="w-full border rounded p-2 mb-3"
            value={values.question}
            onChange={handleChange}
          />

          {/* RESPUESTA */}
          <label className="block font-medium">Respuesta:</label>
          <div className="relative mb-3">
            <input
              type={showAnswer ? "text" : "password"}
              name="answer"
              className="w-full border rounded p-2"
              value={values.answer}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-600"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
            </span>
          </div>

          <button className="w-full bg-purple-700 text-white p-2 rounded">
            Guardar
          </button>
        </form>

      </div>
    </AuthenticatedLayout>
  );
}
