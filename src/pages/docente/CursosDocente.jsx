import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CursosDocente() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [asignaturasDelDocente, setAsignaturasDelDocente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get('/cursos').then(r => setCursos(r.data)).catch(() => {});
    if (user?.id) {
      api.get(`/asignaturas/docente/${user.id}`).then(r => setAsignaturasDelDocente(r.data)).catch(() => {});
    }
    api.get('/usuarios').then(r => setUsuarios(r.data)).catch(() => {});
  }, [user]);

  const getAsignaturasDeCurso = (cursoId) =>
    asignaturasDelDocente.filter(a => a.cursoId === cursoId);

  const getDocente = (docenteId) =>
    usuarios.find(u => u.id === docenteId);

  const toggleCurso = (cursoId) =>
    setExpanded(prev => ({ ...prev, [cursoId]: !prev[cursoId] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cursos</h1>
        <p className="text-gray-500 mt-1">Todos los cursos del colegio con sus asignaturas</p>
      </div>
      <div className="space-y-3">
        {cursos.map((curso) => {
          const asigs = getAsignaturasDeCurso(curso.id);
          const open = expanded[curso.id];
          return (
            <div key={curso.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleCurso(curso.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-800 rounded-lg flex items-center justify-center text-lg font-bold">
                    {curso.nivel?.charAt(0)}{curso.letra}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{curso.nivel} {curso.letra}</h3>
                    <p className="text-xs text-gray-500">{asigs.length} asignatura{asigs.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-lg">{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="border-t border-gray-100">
                  {asigs.map((asig) => {
                    const docente = getDocente(asig.docenteId);
                    return (
                      <div key={asig.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📖</span>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{asig.nombre}</p>
                            <p className="text-xs text-gray-500">
                              {docente ? `${docente.nombres} ${docente.apellidos}` : `Docente ID: ${asig.docenteId}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {asigs.length === 0 && (
                    <p className="px-5 py-4 text-sm text-gray-400">Sin asignaturas asignadas</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {cursos.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay cursos registrados</p>
        )}
      </div>
    </div>
  );
}
