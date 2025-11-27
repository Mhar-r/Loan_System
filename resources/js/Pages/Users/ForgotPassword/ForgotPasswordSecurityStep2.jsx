import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function ForgotPasswordSecurityStep2({ user, question, email }) {
  const { errors } = usePage().props;
  const [answer, setAnswer] = useState("");

  const submit = (e) => {
    e.preventDefault();

    Inertia.post(route("user.security.reset", user.id), {
      step: 2,
      answer,
    });
  };

  return (
    <AuthenticatedLayout>
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1]">

      {/* ===================== CONTENIDO ===================== */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow border border-[#ddd]">
          
          <h2 className="text-2xl font-bold mb-4 text-center text-[#441b69]">
            Verificar identidad
          </h2>

          <p className="mb-2 text-[#333]">
            <strong>Correo:</strong> {email}
          </p>

          <p className="mb-4 text-[#333]">
            <strong>Pregunta de seguridad:</strong> {question}
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-medium text-[#441b69]">
                Tu respuesta:
              </label>

              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              {errors.answer && (
                <p className="text-red-500 text-sm mt-1">{errors.answer}</p>
              )}
            </div>

            <button className="w-full bg-[#441B69] text-white py-2 rounded-lg shadow hover:bg-[#6A32A8] transition">
              Continuar
            </button>
          </form>

          <p className="text-center mt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-[#3670b7] hover:underline"
            >
              Volver
            </button>
          </p>


        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
    </AuthenticatedLayout>
  );
}
