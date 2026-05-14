import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MisNotas() {
  const { user } = useAuth();
  const [calificaciones, setCalificaciones] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/calificaciones/estudiante/${user.id}`)
        .then(r => setCalificaciones(r.data))
        .catch(() => {});
    }
  }, [user]);

  const promedio = calificaciones.length > 0
    ? (calificaciones.reduce((sum, c) => sum + c.nota, 0) / calificaciones.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis Notas</h1>
        <p className="text-gray-500 mt-1">Tus calificaciones registradas</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 inline-block">
        <p className="text-sm text-gray-500">Promedio General</p>
        <p className="text-3xl font-bold text-primary-800">{promedio}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Asignatura</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Nota</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{c.asignaturaId}</td>
                  <td className="py-3 px-4 font-semibold">{c.nota}</td>
                  <td className="py-3 px-4 text-gray-600">{c.descripcion || '-'}</td>
                </tr>
              ))}
              {calificaciones.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-gray-400">No tienes calificaciones registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
