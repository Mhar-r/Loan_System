import { useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Create() {
    const { flash, errors } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        name: '',
    });

    useEffect(() => {
        // Mostrar éxito
        if (flash && flash.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: flash.success,
                timer: 2000,
                showConfirmButton: false
            });
        }

        // Mostrar error de validación del backend (único)
        if (errors.name) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errors.name,
            });
        }
    }, [flash, errors]);

    const submit = (e) => {
        e.preventDefault();
        post(route('materialtype.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-bold mb-4">Registrar Tipo de Material</h1>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Nombre del Tipo de Material" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                    />
                    {/* Puedes dejar esto como respaldo */}
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing}>
                    Guardar
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
