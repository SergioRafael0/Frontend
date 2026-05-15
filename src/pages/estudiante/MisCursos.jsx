import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EVALS = ['Ev1', 'Ev2', 'Ev3', 'EF'];

export default function MisCursos() {
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      try {
        const [matriculasRes, cursosRes, asignaturasRes, calificacionesRes] = await Promise.all([
          api.get('/matriculas'),
          api.get('/cursos'),
          api.get('/asignaturas'),
          api.get(`/calificaciones/estudiante/${user.id}`),
        ]);

        const miMatricula = matriculasRes.data.find(m => m.estudianteId === user.id);
        if (!miMatricula) return;

        const cursoData = cursosRes.data.find(c => c.id === miMatricula.cursoId);
        setCurso(cursoData);

        const asigs = asignaturasRes.data.filter(a => a.cursoId === miMatricula.cursoId);
        const asigsConNotas = asigs.map(a => {
          const notas = {};
          for (const ev of EVALS) {
            const match = calificacionesRes.data.find(
              c => c.asignaturaId === a.id && c.descripcion === ev
            );
            notas[ev] = match ? { id: match.id, nota: match.nota } : null;
          }
          const suma = EVALS.reduce((acc, ev) => acc + (notas[ev]?.nota || 0), 0);
          return { ...a, notas, promedio: (suma / 4).toFixed(1) };
        });
        setAsignaturas(asigsConNotas);
      } catch {}
    };
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mis Asignaturas</h1>
        <p className="text-gray-500 mt-1">
          {curso ? `${curso.nivel} ${curso.letra}` : 'Cargando...'}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Asignatura</th>
                {EVALS.map(ev => (
                  <th key={ev} className="text-center py-3 px-3 text-gray-500 font-medium w-16">{ev}</th>
                ))}
                <th className="text-center py-3 px-3 text-gray-500 font-medium w-16">Prom</th>
              </tr>
            </thead>
            <tbody>
              {asignaturas.map((asig) => (
                <tr key={asig.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{asig.nombre}</td>
                  {EVALS.map(ev => (
                    <td key={ev} className="py-3 px-3 text-center text-gray-700">
                      {asig.notas[ev]?.nota != null ? asig.notas[ev].nota.toFixed(1) : '—'}
                    </td>
                  ))}
                  <td className="py-3 px-3 text-center font-semibold text-primary-800">
                    {asig.promedio}
                  </td>
                </tr>
              ))}
              {asignaturas.length === 0 && curso && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Sin asignaturas en este curso</td></tr>
              )}
              {!curso && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No estás matriculado en ningún curso</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
