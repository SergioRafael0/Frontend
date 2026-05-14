import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MisAsignaturas() {
  const { user } = useAuth();
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/asignaturas/docente/${user.id}`)
        .then(r => setAsignaturas(r.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis Asignaturas</h1>
        <p className="text-gray-500 mt-1">Asignaturas que impartes</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {asignaturas.map((a) => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xl">📖</div>
              <div>
                <h3 className="font-semibold text-gray-800">{a.nombre}</h3>
                <p className="text-xs text-gray-500">Curso ID: {a.cursoId}</p>
              </div>
            </div>
          </div>
        ))}
        {asignaturas.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">No tienes asignaturas asignadas</p>
        )}
      </div>
    </div>
  );
}
