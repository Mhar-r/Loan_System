import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function LoginStudent() {
  const [values, setValues] = useState({
    student_id: '',   // <--- cambiamos email por student_id
    password: '',     // mantenemos contraseña
  });

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post('/login/student', values); // ruta Laravel para login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login Estudiante</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="student_id" className="block mb-1 font-medium">Matrícula:</label>
            <input
              type="text"
              name="student_id"
              id="student_id"
              value={values.student_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
