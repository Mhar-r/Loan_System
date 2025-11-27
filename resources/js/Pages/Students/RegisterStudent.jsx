import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function RegisterStudent() {

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordPattern.test(data.password)) {
      Swal.fire({
          icon: "error",
          title: "Contraseña inválida",
          text: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
          confirmButtonColor: "#441b69",
      });
      return;
  }


    post(route("students.store"));
};





  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1] text-[#1e1e2e]">
      
      {/* Barra superior con logos */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#2e124a] shadow-md">
        {/* Logo de la Universidad clickeable */}
        <Link href="/" className="cursor-pointer">
          <img
            src="/images/logoUpp.png"
            alt="Logo Universidad"
            className="h-12 w-auto hover:opacity-80 transition"
          />
        </Link>
        <Link
          href="/"
          className="text-xl font-semibold text-white tracking-wide hover:underline cursor-pointer"
        >
          Sistema de Préstamos de Materiales de Laboratorio
        </Link>

        <img
          src="/images/logoSoft.png"
          alt="Logo Sistema"
          className="h-12 w-auto"
        />
      </header>

      {/* Contenedor principal */}
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-10">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-[#ddd]">
          <h2 className="text-3xl font-bold text-center text-[#441b69] mb-6">
            Registro de Estudiantes
          </h2>

          <form onSubmit={submit} className="space-y-4">
            {/* Matrícula */}
            <div>
              <input
                type="text"
                value={data.student_id}
                onChange={(e) => setData("student_id", e.target.value)}
                placeholder="Matrícula"
                className="w-full border border-[#ccc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6b36a7]"
              />
              {errors.student_id && (
                <p className="text-red-500 text-sm mt-1">{errors.student_id}</p>
              )}
            </div>

            {/* Nombre y apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Nombre(s)"
                className="border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
              />
              <input
                type="text"
                value={data.first_surname}
                onChange={(e) => setData("first_surname", e.target.value)}
                placeholder="Primer Apellido"
                className="border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
              />
            </div>

            <input
              type="text"
              value={data.second_surname}
              onChange={(e) => setData("second_surname", e.target.value)}
              placeholder="Segundo Apellido"
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
            />

            {/* Carrera */}
            <select
              value={data.major}
              onChange={(e) => setData("major", e.target.value)}
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 text-[#55546b] focus:ring-2 focus:ring-[#6b36a7]"
            >
              <option value="">Selecciona tu carrera</option>
              <option value="Software">Software</option>
              <option value="Biomedica">Biomédica</option>
              <option value="Biotecnologia">Biotecnología</option>
              <option value="RedeTeleco">Redes Y Telecomunicaciones</option>
              <option value="Mecatronica">Mecatrónica</option>
              <option value="TIID">TIID</option>
              <option value="Other">Otra</option>
            </select>

            {/* Grupo */}
            <input
              type="text"
              value={data.group_name}
              onChange={(e) => setData("group_name", e.target.value)}
              placeholder="Grado y Grupo (Ej:01-02)"
              className="w-full border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
            />

            {/* Email y teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="Correo electrónico"
                className="border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
              />
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="Teléfono (opcional)"
                className="border border-[#ccc] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6b36a7]"
              />
            </div>

            {/* Contraseña */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={data.password}
    onChange={(e) => setData("password", e.target.value)}
    placeholder="Contraseña"
    className="border border-[#ccc] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#6b36a7]"
  />
  <span
    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
  </span>
</div>

<div className="relative">
  <input
    type={showConfirmPassword ? "text" : "password"}
    value={data.password_confirmation}
    onChange={(e) => setData("password_confirmation", e.target.value)}
    placeholder="Confirmar contraseña"
    className="border border-[#ccc] rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#6b36a7]"
  />
  <span
    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
  </span>
</div>

            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-[#441b69] text-white font-semibold py-2 rounded-lg shadow hover:bg-[#6b36a7] transition-all duration-300"
            >
              Registrarse
            </button>
          </form>

          {/* Enlace para volver al login */}
          <p className="text-center text-sm mt-5 text-[#55546b]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login/student"
              className="text-[#3670b7] font-medium hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
  );
}
