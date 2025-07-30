import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { useState } from 'react';

export default function Authenticated({ header, children }) {
    const { props } = usePage();
    const user = props.auth?.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    if (!user) {
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
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="mr-4 text-right">
                                <div className="font-medium text-base text-gray-800">{user?.name}</div>
                                <div className="font-medium text-sm text-gray-500">{user?.email}</div>
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition">
                                        <div>{user?.name}</div>
                                        <div className="ml-1">
                                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                    <Dropdown.Link method="post" href={route('logout')} as="button">
                                        Cerrar sesión
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
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
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800">{user?.name}</div>
                                <div className="font-medium text-sm text-gray-500">{user?.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Cerrar sesión
                                </ResponsiveNavLink>
                            </div>
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
