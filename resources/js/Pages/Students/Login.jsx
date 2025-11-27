import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginStudent() {
  const { errors, flash, old } = usePage().props;

  const [values, setValues] = useState({
    student_id: old?.student_id || '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Actualizar valores si Inertia devuelve nuevos old values
  useEffect(() => {
    setValues(prev => ({
      ...prev,
      student_id: old?.student_id || '',
    }));
  }, [old?.student_id]);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post('/login/student', values, {
      preserveScroll: true,
      preserveState: false,
  });

  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1] text-[#1e1e2e]">
      
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#2e124a] shadow-md">
        <img src="/images/logoUpp.png" alt="Logo Universidad" className="h-12 w-auto hover:opacity-80 transition" />
        <Link href="/" className="text-xl font-semibold text-white tracking-wide hover:underline">
          Sistema de Préstamos de Materiales de Laboratorio
        </Link>
        <img src="/images/logoSoft.png" alt="Logo Sistema" className="h-12 w-auto" />
      </header>

      {/* Contenedor principal */}
      <main className="flex flex-col flex-1 items-center justify-center px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#ddd]">
          <h2 className="text-3xl font-bold text-center text-[#441b69] mb-6">
            Acceso Estudiante
          </h2>

          {/* Alertas Flash */}
          {flash?.error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
              {flash.error}
            </div>
          )}

          {flash?.success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg">
              {flash.success}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="student_id" className="block mb-1 font-medium text-[#441b69]">
                Matrícula:
              </label>
              <input
                type="text"
                name="student_id"
                id="student_id"
                value={values.student_id}
                onChange={handleChange}
                className="w-full border border-[#ccc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6b36a7]"
                required
              />
              {errors.student_id && (
                <p className="text-sm text-red-600 mt-1">{errors.student_id}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-1 font-medium text-[#441b69]">
                Contraseña:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full border border-[#ccc] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6b36a7]"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer text-[#6b36a7] text-xl"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#441b69] text-white rounded-lg px-4 py-2 mt-2 shadow hover:bg-[#6b36a7] transition-all duration-300"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            <Link
              href={route("student.security-question.form")}
              className="text-[#3670b7] font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>

          <p className="text-center text-sm mt-5 text-[#55546b]">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register-student"
              className="text-[#3670b7] font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
  );
}
