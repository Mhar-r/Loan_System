import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Authenticated({ header, children }) {
    
    const { props } = usePage();
     const flash = props.flash;

    const user = props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        const handlePageShow = (event) => {
            if (
                event.persisted ||
                window.performance.getEntriesByType("navigation")[0].type === "back_forward"
            ) {
                if (user) {
                    if (user.role_id === 1) {
                        window.location.href = route("admin.dashboard");
                    } else if (user.role_id === 2) {
                        window.location.href = route("manager.dashboard");
                    }
                }
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, [user]);

    useEffect(() => {
        if (!user) {
            Inertia.visit(route("login"), { replace: true });
        }
    }, [user]);

    if (!user) {
        return (
            <div className="p-4 text-center text-gray-600">
                Cargando usuario...
            </div>
        );
    }

    return (
        
        <div className="min-h-screen bg-[#F7F5FB]">
            {/* NAVBAR */}
            <nav className="bg-gradient-to-r from-[#441B69] to-[#6A32A8] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo y links principales */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="/images/logoUpp.png"
                                    alt="Logo"
                                    className="h-10 w-auto mr-3"
                                />
                                <span className="text-white font-bold text-xl tracking-wide">
                                    Panel UPP
                                </span>
                            </Link>
                            {/* 
                            <div className="hidden sm:flex sm:space-x-8 sm:ml-10">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="text-white hover:text-gray-200 font-medium"
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                            */}
                        </div>

                        {/* Usuario y dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="text-right mr-4">
                                <div className="font-semibold text-white">{user?.name}</div>
                                <div className="text-sm text-gray-200">{user?.email}</div>
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-white hover:text-gray-100 focus:outline-none transition">
                                        <div className="mr-1">Opciones</div>
                                        <svg
                                            className="fill-current h-4 w-4"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Perfil
                                    </Dropdown.Link>

                                    <Dropdown.Link href={route("user.security-question")}>
                                        Pregunta de Seguridad
                                    </Dropdown.Link>

                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Inertia.post(route("logout"), {}, {
                                                onFinish: () => Inertia.visit("/"),
                                            });
                                        }}
                                    >
                                        Cerrar sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Botón móvil */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#6A32A8]/40 transition"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    {showingNavigationDropdown ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden bg-[#441B69]/95 text-white border-t border-white/20">

                        <div className="pt-2 pb-3 space-y-1">
                            {/* 
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="text-white hover:bg-[#6A32A8]/60 block px-4 py-2"
                            >
                                Dashboard
                            </ResponsiveNavLink>
                            */}
                        </div>
                        
                        <div className="pt-4 pb-1 border-t border-gray-500/40">
                            <div className="px-4">
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-sm text-gray-300">{user?.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Perfil
                                </ResponsiveNavLink>

                                <ResponsiveNavLink href={route("user.security-question")}>
                                    Pregunta de Seguridad
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Cerrar sesión
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Header opcional */}
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
