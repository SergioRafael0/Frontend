import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CalificacionesModal from './CalificacionesModal';

export default function MisAsignaturas() {
  const { user } = useAuth();
  const [asignaturas, setAsignaturas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedAsig, setSelectedAsig] = useState(null);

  useEffect(() => {
    if (user?.id) {
      api.get(`/asignaturas/docente/${user.id}`).then(r => setAsignaturas(r.data)).catch(() => {});
    }
    api.get('/cursos').then(r => setCursos(r.data)).catch(() => {});
    api.get('/usuarios').then(r => setUsuarios(r.data)).catch(() => {});
  }, [user]);

  const getCurso = (cursoId) => cursos.find(c => c.id === cursoId);
  const getCursoNombre = (cursoId) => {
    const c = getCurso(cursoId);
    return c ? `${c.nivel} ${c.letra}` : `ID: ${cursoId}`;
  };
  const getDocenteNombre = (docenteId) => {
    const d = usuarios.find(u => u.id === docenteId);
    return d ? `${d.nombres} ${d.apellidos}` : `ID: ${docenteId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis Asignaturas</h1>
        <p className="text-gray-500 mt-1">Asignaturas que impartes</p>
      </div>
      <div className="space-y-3">
        {asignaturas.map((a) => (
          <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xl">📖</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{a.nombre}</h3>
                  <p className="text-sm text-gray-500">
                    Curso: {getCursoNombre(a.cursoId)} — Docente: {getDocenteNombre(a.docenteId)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsig(a)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
              >
                <span>👥📊</span>
                <span className="hidden sm:inline">Ver Estudiantes y Calificaciones</span>
                <span className="sm:hidden">Ver</span>
              </button>
            </div>
          </div>
        ))}
        {asignaturas.length === 0 && (
          <p className="text-center text-gray-400 py-8">No tienes asignaturas asignadas</p>
        )}
      </div>
      {selectedAsig && (
        <CalificacionesModal
          asignatura={selectedAsig}
          cursoNombre={getCursoNombre(selectedAsig.cursoId)}
          onClose={() => setSelectedAsig(null)}
        />
      )}
    </div>
  );
}
