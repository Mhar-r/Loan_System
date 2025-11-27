import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function ForgotPasswordSecurityStep3({ user, email }) {
  const { errors } = usePage().props;

  const [values, setValues] = useState({
    password: "",
    password_confirmation: "",
    new_question: "",
    new_answer: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const change = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    Inertia.post(route("user.security.reset", user.id), values);
  };

  return (
    <AuthenticatedLayout>
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1]">
      

      {/* ===================== CONTENIDO PRINCIPAL ===================== */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow border border-[#ddd]">

          <h2 className="text-2xl font-bold mb-4 text-center text-[#441b69]">
            Nueva contraseña
          </h2>

          <p className="mb-4 text-[#333]">
            <strong>Correo:</strong> {email}
          </p>

          <form onSubmit={submit} className="space-y-4">

            {/* NUEVA CONTRASEÑA */}
            <div>
              <label className="block font-medium text-[#441b69]">Nueva contraseña:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                  onChange={change}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label className="block font-medium text-[#441b69]">Confirmar contraseña:</label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  name="password_confirmation"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                  onChange={change}
                />
                <span
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  {showPasswordConfirm ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
            </div>

            {/* NUEVA PREGUNTA */}
            <div>
              <label className="block font-medium text-[#441b69]">Nueva pregunta secreta:</label>
              <input
                type="text"
                name="new_question"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                onChange={change}
              />
            </div>

            {/* NUEVA RESPUESTA */}
            <div>
              <label className="block font-medium text-[#441b69]">Nueva respuesta secreta:</label>
              <div className="relative">
                <input
                  type={showAnswer ? "text" : "password"}
                  name="new_answer"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                  onChange={change}
                />
                <span
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                >
                  {showAnswer ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            </div>

            <button className="w-full bg-[#441B69] text-white py-2 rounded-lg shadow hover:bg-[#6A32A8] transition">
              Guardar cambios
            </button>

            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="text-[#3670b7] hover:underline"
              >
                Volver
              </button>
            </p>


          </form>
        </div>
      </main>

      {/* ===================== FOOTER (MISMO QUE STEP2) ===================== */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
    </AuthenticatedLayout>
  );
}
