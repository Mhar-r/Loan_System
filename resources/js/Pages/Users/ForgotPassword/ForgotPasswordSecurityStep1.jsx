import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function ForgotPasswordSecurityStep1() {
  const { errors } = usePage().props;
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Inertia.post(route("user.security.check"), { email });
  };

  return (
    <AuthenticatedLayout>
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1]">
      
      

      {/* ===================== CONTENIDO ===================== */}
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow border border-[#ddd]">

          

          <h2 className="text-2xl font-bold mb-4 text-center text-[#441b69]">
            Recuperar contraseña
          </h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-medium text-[#441b69]">
                Email:
              </label>

              <input
                type="email"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#6b36a7]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <button className="w-full bg-[#441B69] text-white py-2 rounded-lg shadow hover:bg-[#6A32A8] transition">
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
    </AuthenticatedLayout>
  );
}
