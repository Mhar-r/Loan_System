import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout'; // o el layout que uses
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Swal from 'sweetalert2';


export default function Create() {
    const { materialTypes, laboratories, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: 'Éxito',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#4f46e5'
            });
            reset(); // limpiar formulario
        }
    }, [flash]);


    const { data, setData, post, processing, errors, reset } = useForm({
        material_type_id: '',
        brand: '',
        inventory_number: '',
        serial_number: '',
        condition: '',
        status: 'Available',
        laboratory_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('material.store'), {
            onError: (errors) => {
                // Puedes unir los errores en un solo string
                const errorMessages = Object.values(errors).flat().join('\n');
                Swal.fire({
                    title: 'Error',
                    text: errorMessages,
                    icon: 'error',
                    confirmButtonText: 'Reintentar'
                });
            },
        });
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-bold mb-4">Registrar Material</h1>

            <form onSubmit={submit} className="space-y-4 max-w-lg">
                <div>
                    <InputLabel htmlFor="material_type_id" value="Tipo de Material" />
                    <select
                        id="material_type_id"
                        name="material_type_id"
                        value={data.material_type_id}
                        onChange={e => setData('material_type_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        {materialTypes.map((mt) => (
                            <option key={mt.id} value={mt.id}>{mt.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.material_type_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="brand" value="Marca" />
                    <TextInput
                        id="brand"
                        name="brand"
                        value={data.brand}
                        className="mt-1 block w-full"
                        onChange={e => setData('brand', e.target.value)}
                    />
                    <InputError message={errors.brand} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="inventory_number" value="Número de Inventario" />
                    <TextInput
                        id="inventory_number"
                        name="inventory_number"
                        value={data.inventory_number}
                        className="mt-1 block w-full"
                        onChange={e => setData('inventory_number', e.target.value)}
                        required
                    />
                    <InputError message={errors.inventory_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="serial_number" value="Número de Serie" />
                    <TextInput
                        id="serial_number"
                        name="serial_number"
                        value={data.serial_number}
                        className="mt-1 block w-full"
                        onChange={e => setData('serial_number', e.target.value)}
                        required
                    />
                    <InputError message={errors.serial_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="condition" value="Condición" />
                    <select
                        id="condition"
                        name="condition"
                        value={data.condition}
                        onChange={e => setData('condition', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                    >
                        <option value="">Selecciona condición</option>
                        <option value="Good">Buena</option>
                        <option value="Fair">Regular</option>
                        <option value="Poor">Mala</option>
                    </select>
                    <InputError message={errors.condition} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="status" value="Estado" />
                    <select
                        id="status"
                        name="status"
                        value={data.status}
                        onChange={e => setData('status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                        required
                    >
                        <option value="Available">Disponible</option>
                        <option value="Loaned">Prestado</option>
                        <option value="Under Repair">En reparación</option>
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="laboratory_id" value="Laboratorio" />
                    <select
                        id="laboratory_id"
                        name="laboratory_id"
                        value={data.laboratory_id}
                        onChange={e => setData('laboratory_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300"
                    >
                        <option value="">Selecciona un laboratorio</option>
                        {laboratories.map((lab) => (
                            <option key={lab.id} value={lab.id}>{lab.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.laboratory_id} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
            </form>
        </GuestLayout>
    );
}
