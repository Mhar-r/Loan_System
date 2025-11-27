import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";

export default function ForgotPasswordSecurityStep1() {
  const { errors } = usePage().props;

  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Inertia.post(route("student.security-question.check"), { email });
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

          {/* VOLVER INICIO */}
          <div className="mb-6">
            <Link
              href="/login/student"
              className="inline-block bg-[#441B69] text-white px-4 py-2 rounded-lg shadow hover:bg-[#6A32A8] transition"
            >
              ← Volver al inicio
            </Link>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-center text-[#441b69]">
            Recuperar contraseña
          </h2>

          <form onSubmit={submit}>
            <label className="block font-medium text-[#441b69]">Email:</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-[#6b36a7]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <button className="w-full bg-[#441B69] text-white p-2 rounded-lg shadow hover:bg-[#6A32A8] transition mt-3">
              Continuar
            </button>
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
