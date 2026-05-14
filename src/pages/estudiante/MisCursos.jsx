import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MisCursos() {
  const { user } = useAuth();
  const [matriculas, setMatriculas] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/matriculas/curso/${user.id}`)
        .then(r => setMatriculas(r.data))
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis Cursos</h1>
        <p className="text-gray-500 mt-1">Cursos en los que estás matriculado</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {matriculas.map((m) => (
          <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-xl">📚</div>
              <div>
                <h3 className="font-semibold text-gray-800">Curso ID: {m.cursoId}</h3>
                <p className="text-xs text-gray-500">Matrícula #{m.id}</p>
              </div>
            </div>
          </div>
        ))}
        {matriculas.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">No tienes cursos asignados</p>
        )}
      </div>
    </div>
  );
}
