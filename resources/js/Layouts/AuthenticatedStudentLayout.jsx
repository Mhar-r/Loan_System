import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedStudentLayout({ header, children, student }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Evita que la página se quede en cache cuando se usa "atrás" del navegador
    useEffect(() => {
        window.history.replaceState(null, document.title, window.location.href);
    }, []);

    // Redirige al login si no hay estudiante
    useEffect(() => {
        if (!student) {
            window.location.href = '/login/student';
        }
    }, [student]);

    if (!student) {
        return <div className="p-4 text-center text-gray-600">Cargando usuario...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <span className="text-xl font-bold text-gray-800">MiApp</span>
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('students.dashboard')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="mr-4 text-right">
                                <div className="font-medium text-base text-gray-800">{student.name}</div>
                                <div className="font-medium text-sm text-gray-500">{student.student_id}</div>
                            </div>
                            <Link
                                href={route('student.logout')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => window.location.reload()} // fuerza recarga después de logout
                            >
                                Cerrar sesión
                            </Link>

                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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

                {showingNavigationDropdown && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <Link href={route('students.dashboard')} className="block px-4 py-2 text-gray-700">Dashboard</Link>
                            <Link href={route('student.logout')} method="post" as="button" className="block px-4 py-2 text-gray-700">Cerrar sesión</Link>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
