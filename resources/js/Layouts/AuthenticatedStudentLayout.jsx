import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import Dropdown from "@/Components/Dropdown";



export default function AuthenticatedStudentLayout({ header, children, student }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const { flash } = usePage().props;

    if (!student) {
        return <div className="p-4 text-center text-gray-600">Cargando usuario...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F7F5FB]">

            {/* NAVBAR */}
            <nav className="bg-gradient-to-r from-[#441B69] to-[#6A32A8] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img src="/images/logoUpp.png" alt="Logo" className="h-10 w-auto mr-3" />
                                <span className="text-white font-bold text-xl tracking-wide">
                                    Panel Estudiante
                                </span>
                            </Link>
                        </div>

                        {/* USER */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">

                            <div className="text-right mr-4">
                                <div className="font-semibold text-white">{student.name}</div>
                                <div className="text-sm text-gray-200">{student.student_id}</div>
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-white hover:text-gray-100 focus:outline-none">
                                        <span className="mr-1">Opciones</span>
                                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('student.password.edit')}>
                                        Cambiar contraseña
                                    </Dropdown.Link>

                                    <Dropdown.Link href={route('student.security-question.create')}>
                                        Pregunta de seguridad
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("student.logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Cerrar sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#6A32A8]/40 transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden bg-[#441B69]/95 text-white border-t border-white/20">
                        <div className="pt-4 pb-1 border-t border-gray-500/40">

                            <div className="px-4">
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-300">{student.student_id}</div>
                            </div>

                            <div className="mt-3 space-y-1">

                                <Link
                                    href={route("student.password.edit")}
                                    className="block px-4 py-2 text-white hover:bg-[#6A32A8]/60"
                                >
                                    Cambiar contraseña
                                </Link>

                                <Link
                                    href={route("student.security-question.create")}
                                    className="block px-4 py-2 text-white hover:bg-[#6A32A8]/60"
                                >
                                    Pregunta de seguridad
                                </Link>

                                <Link
                                    href={route("student.logout")}
                                    method="post"
                                    as="button"
                                    className="block px-4 py-2 w-full text-left text-white hover:bg-[#6A32A8]/60"
                                >
                                    Cerrar sesión
                                </Link>

                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-[#441B69] font-bold text-xl">
                        {header}
                    </div>
                </header>
            )}

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* ALERTA FLASH */}
                {flash?.warning && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                        {flash.warning}
                    </div>
                )}

                {children}
            </main>

        </div>
    );
}
