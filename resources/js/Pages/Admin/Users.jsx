import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Register() {
    const [roles, setRoles] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        first_surname: '',
        second_surname: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role_id: '',
    });

    useEffect(() => {
        axios.get('/api/roles')
            .then((response) => setRoles(response.data))
            .catch((error) => console.error('Error cargando roles', error));

        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
                <div>
                    <InputLabel htmlFor="name" value="Nombre(s)" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.first_name}
                        className="mt-1 block w-full"
                        autoComplete="given-name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="first_surname" value="Apellido Paterno" />
                    <TextInput
                        id="first_surname"
                        name="first_surname"
                        value={data.first_surname}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('first_surname', e.target.value)}
                        required
                    />
                    <InputError message={errors.first_surname} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="second_surname" value="Apellido Materno" />
                    <TextInput
                        id="second_surname"
                        name="second_surname"
                        value={data.second_surname}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('second_surname', e.target.value)}
                        required
                    />
                    <InputError message={errors.second_surname} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Teléfono" />
                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role_id" value="Rol de Usuario" />
                    <select
                        id="role_id"
                        name="role_id"
                        value={data.role_id}
                        onChange={(e) => setData('role_id', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.role_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        ¿Ya tienes una cuenta?
                    </Link>

                    <PrimaryButton className="ml-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
