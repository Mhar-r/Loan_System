import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";

export default function ForgotPasswordSecurityStep2({ student, question, email }) {
  const { errors, flash } = usePage().props;

  const [answer, setAnswer] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Inertia.post(`/student/reset-password-security/${student.id}`, {
      step: 2,
      answer,
    });

  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1]">

      {/* ===================== HEADER ===================== */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#2e124a] shadow-md">

        <img
          src="/images/logoUpp.png"
          className="h-12 w-auto hover:opacity-80 transition"
        />

        <Link
          href="/"
          className="text-xl font-semibold text-white tracking-wide hover:underline"
        >
          Sistema de Préstamos de Materiales de Laboratorio
        </Link>

        <img src="/images/logoSoft.png" className="h-12 w-auto" />
      </header>

      {/* ===================== CONTENIDO ===================== */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow border border-[#ddd]">


          {/* FLASH MESSAGES */}
          {flash?.error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
              {flash.error}
            </div>
          )}
          {flash?.success && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
              {flash.success}
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-center text-[#441b69]">
            Verificar identidad
          </h2>

          <p><strong>Correo:</strong> {email}</p>
          <p className="mb-4">
            <strong>Pregunta de seguridad:</strong> {question}
          </p>

          <form onSubmit={submit}>
            <label className="block font-medium text-[#441b69]">Tu respuesta:</label>
            <input
              type="text"
              name="answer"
              className="w-full border rounded p-2 mb-3"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            {errors.answer && (
              <p className="text-red-500 text-sm mb-2">{errors.answer}</p>
            )}

            <button className="w-full bg-[#441B69] text-white p-2 rounded-lg shadow hover:bg-[#6A32A8] transition">
              Continuar
            </button>

            <p className="text-center mt-4">
            <Link href="/login/student" className="text-[#3670b7] hover:underline">
              Volver al Login
            </Link>
          </p>
          </form>
        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
  );
}
