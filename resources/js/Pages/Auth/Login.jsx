import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = React.useState(false);


  const { props } = usePage();
  const user = props.auth?.user;

  // Limpiar password al desmontar
  useEffect(() => {
    return () => reset('password');
  }, []);

  // Redirección por rol
  useEffect(() => {
    if (user) {
      if (user.role_id === 1) {
        router.replace(route('admin.dashboard'));
      } else if (user.role_id === 2) {
        router.replace(route('manager.dashboard'));
      } else {
        router.replace(route('dashboard'));
      }
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  // Si ya está autenticado, no mostrar el formulario
  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f5fa] to-[#e9e7f1] text-[#1e1e2e]">
      
      {/* Encabezado */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#2e124a] shadow-md">
        {/* Logo de la Universidad clickeable */}
        <Link href="/" className="cursor-pointer">
          <img
            src="/images/logoUpp.png"
            alt="Logo Universidad"
            className="h-12 w-auto hover:opacity-80 transition"
          />
        </Link>

        {/* Título clickeable */}
        <Link
          href="/"
          className="text-xl font-semibold text-white tracking-wide hover:underline cursor-pointer"
        >
          Sistema de Préstamos de Materiales de Laboratorio
        </Link>
        <img src="/images/logoSoft.png" alt="Logo Sistema" className="h-12 w-auto" />
      </header>

      

      {/* Contenido principal */}
      <main className="flex flex-col flex-1 items-center justify-center px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#ddd]">
          <Head title="Iniciar Sesión" />

          <h2 className="text-3xl font-bold text-center text-[#441b69] mb-6">
            Acceso al Sistema
          </h2>

          {status && (
            <div className="mb-4 text-sm text-green-600 font-medium text-center">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="mb-5">
              <InputLabel htmlFor="email" value="Correo Electrónico" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full border border-[#ccc] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6b36a7]"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-5">
              <InputLabel htmlFor="password" value="Contraseña" />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="mt-1 block w-full border border-[#ccc] rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6b36a7]"
                  autoComplete="current-password"
                  required
                />

                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
                </span>
              </div>

              <InputError message={errors.password} className="mt-2" />
            </div>

            

            {/* Botón de login y enlace de recuperación */}
            <div className="flex items-center justify-between mt-4">

              <PrimaryButton
                className="bg-[#441b69] hover:bg-[#6b36a7] text-white rounded-lg px-6 py-2 transition-all duration-300"
                disabled={processing}
              >
                Iniciar Sesión
              </PrimaryButton>
            </div>
          </form>

          
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-4 text-sm text-[#55546b] border-t border-[#ddd]">
        © {new Date().getFullYear()} Universidad Politécnica – Sistema de Préstamos
      </footer>
    </div>
  );
}
