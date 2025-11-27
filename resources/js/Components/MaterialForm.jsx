import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Swal from "sweetalert2";
import React, { useEffect } from "react";

export default function MaterialForm({ materialTypes, laboratories, onSuccess, editingMaterial = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        material_type_id: editingMaterial?.material_type_id || "",
        brand: editingMaterial?.brand || "",
        inventory_number: editingMaterial?.inventory_number || "",
        serial_number: editingMaterial?.serial_number || "",
        condition: editingMaterial?.condition || "Good",
        status: editingMaterial?.status || "Available",
        laboratory_id: editingMaterial?.laboratory_id || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const request = editingMaterial
            ? put(route("material.update", editingMaterial.id), {
                  onSuccess: () => handleSuccess("Material actualizado correctamente"),
                  onError: handleError,
              })
            : post(route("material.store"), {
                  onSuccess: () => handleSuccess("Material registrado correctamente"),
                  onError: handleError,
              });
    };

    const handleSuccess = (msg) => {
        Swal.fire({
            title: "Éxito",
            text: msg,
            icon: "success",
            confirmButtonColor: "#441B69",
        });
        reset();
        if (onSuccess) onSuccess();
    };

    const handleError = (errors) => {
        const errorMessages = Object.values(errors).flat().join("\n");
        Swal.fire({
            title: "Error",
            text: errorMessages,
            icon: "error",
            confirmButtonText: "Reintentar",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo */}
            <div>
                <InputLabel htmlFor="material_type_id" value="Tipo de Material" />
                <select
                    id="material_type_id"
                    value={data.material_type_id}
                    onChange={(e) => setData("material_type_id", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                    required
                >
                    <option value="">Selecciona un tipo</option>
                    {materialTypes.map((mt) => (
                        <option key={mt.id} value={mt.id}>
                            {mt.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.material_type_id} className="mt-2" />
            </div>

            {/* Marca */}
            <div>
                <InputLabel htmlFor="brand" value="Marca" />
                <TextInput
                    id="brand"
                    value={data.brand}
                    onChange={(e) => setData("brand", e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.brand} className="mt-2" />
            </div>

            {/* Inventario */}
            <div>
                <InputLabel htmlFor="inventory_number" value="Número de Inventario" />
                <TextInput
                    id="inventory_number"
                    value={data.inventory_number}
                    onChange={(e) => setData("inventory_number", e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.inventory_number} className="mt-2" />
            </div>

            {/* Serie */}
            <div>
                <InputLabel htmlFor="serial_number" value="Número de Serie" />
                <TextInput
                    id="serial_number"
                    value={data.serial_number}
                    onChange={(e) => setData("serial_number", e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.serial_number} className="mt-2" />
            </div>

            {/* Condición */}
            <div>
                <InputLabel htmlFor="condition" value="Condición" />
                <select
                    id="condition"
                    value={data.condition}
                    onChange={(e) => setData("condition", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                >
                    <option value="Good">Buena</option>
                    <option value="Fair">Regular</option>
                    <option value="Poor">Mala</option>
                </select>
                <InputError message={errors.condition} className="mt-2" />
            </div>

            {/* Estado */}
            <div>
                <InputLabel htmlFor="status" value="Estado" />
                <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                >
                    <option value="Available">Disponible</option>
                    <option value="Loaned">Prestado</option>
                    <option value="Under Repair">En reparación</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            {/* Laboratorio */}
            <div>
                <InputLabel htmlFor="laboratory_id" value="Laboratorio" />
                <select
                    id="laboratory_id"
                    value={data.laboratory_id}
                    onChange={(e) => setData("laboratory_id", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300"
                >
                    <option value="">Selecciona un laboratorio</option>
                    {laboratories.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                            {lab.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.laboratory_id} className="mt-2" />
            </div>

            <PrimaryButton disabled={processing}>
                {editingMaterial ? "Actualizar" : "Guardar"}
            </PrimaryButton>
        </form>
    );
}
