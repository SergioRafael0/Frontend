import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function CalificacionesModal({ asignatura, cursoNombre, onClose }) {
  const [students, setStudents] = useState([]);
  const [originalData, setOriginalData] = useState({});
  const [dirty, setDirty] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const dataRef = useRef({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [matriculasRes, usuariosRes] = await Promise.all([
          api.get(`/matriculas/curso/${asignatura.cursoId}`),
          api.get('/usuarios'),
        ]);
        setUsuarios(usuariosRes.data);

        const notasPromises = matriculasRes.data.map(m =>
          api.get(`/calificaciones/estudiante/${m.estudianteId}`)
            .then(r => ({ estudianteId: m.estudianteId, notas: r.data.filter(n => n.asignaturaId === asignatura.id) }))
            .catch(() => ({ estudianteId: m.estudianteId, notas: [] }))
        );
        const resultados = await Promise.all(notasPromises);

        const allDescripciones = [...new Set(
          resultados.flatMap(r => r.notas.map(n => n.descripcion).filter(Boolean))
        )];
        const evals = allDescripciones.length > 0 ? allDescripciones : ['Nota'];
        setEvaluaciones(evals);

        const data = {};
        const original = {};
        for (const r of resultados) {
          const usr = usuariosRes.data.find(u => u.id === r.estudianteId);
          const notas = {};
          for (const ev of evals) {
            const existing = r.notas.find(n => n.descripcion === ev);
            notas[ev] = existing
              ? { id: existing.id, nota: existing.nota }
              : { id: null, nota: null };
          }
          data[r.estudianteId] = {
            estudianteId: r.estudianteId,
            nombre: usr?.nombres || '—',
            apellido: usr?.apellidos || '—',
            notas: { ...notas },
          };
          original[r.estudianteId] = {
            notas: JSON.parse(JSON.stringify(notas)),
          };
        }
        dataRef.current = data;
        setStudents(Object.values(data));
        setOriginalData(original);
      } catch (err) {
        setError('Error al cargar datos: ' + getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [asignatura]);

  const getNota = (estudianteId, evalName) => {
    const data = dataRef.current[estudianteId];
    return data?.notas[evalName]?.nota;
  };

  const isDirty = (estudianteId, evalName) => {
    return dirty[`${estudianteId}_${evalName}`] || false;
  };

  const handleNotaChange = (estudianteId, evalName, value) => {
    const data = { ...dataRef.current };
    const estudiante = { ...data[estudianteId] };
    const notas = { ...estudiante.notas };
    const parsed = value === '' || value === null ? null : parseFloat(value);
    notas[evalName] = { ...notas[evalName], nota: parsed };
    estudiante.notas = notas;
    data[estudianteId] = estudiante;
    dataRef.current = data;

    const originalNota = originalData[estudianteId]?.notas[evalName]?.nota;
    const isChanged = parsed !== originalNota;
    setDirty(prev => ({ ...prev, [`${estudianteId}_${evalName}`]: isChanged }));
    setStudents(Object.values(data));
  };

  const calcularPromedio = (notas) => {
    const active = evaluaciones.filter(ev => notas[ev]?.nota != null);
    if (active.length === 0) return '0.0';
    const sum = active.reduce((acc, ev) => acc + notas[ev].nota, 0);
    return (sum / active.length).toFixed(1);
  };

  const handleAgregarEvaluacion = () => {
    const name = window.prompt('Nombre de la nueva evaluación:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (evaluaciones.includes(trimmed)) {
      alert('Ya existe una evaluación con ese nombre.');
      return;
    }
    const newEvals = [...evaluaciones, trimmed];
    setEvaluaciones(newEvals);

    const data = { ...dataRef.current };
    for (const sid of Object.keys(data)) {
      data[sid] = {
        ...data[sid],
        notas: { ...data[sid].notas, [trimmed]: { id: null, nota: null } },
      };
    }
    dataRef.current = data;
    setStudents(Object.values(data));
  };

  const handleGuardar = async () => {
    setSaving(true);
    setError('');

    const puts = [];
    const posts = [];
    for (const key of Object.keys(dirty)) {
      if (!dirty[key]) continue;
      const idx = key.indexOf('_');
      const sid = key.substring(0, idx);
      const evalName = key.substring(idx + 1);
      const nota = dataRef.current[sid]?.notas[evalName];
      if (!nota || nota.nota == null) continue;

      const body = {
        estudianteId: parseInt(sid),
        asignaturaId: asignatura.id,
        nota: nota.nota,
        descripcion: evalName,
      };

      if (nota.id) {
        puts.push(api.put(`/calificaciones/${nota.id}`, body));
      } else {
        posts.push(api.post('/calificaciones', body));
      }
    }

    try {
      await Promise.all([...puts, ...posts]);
      setDirty({});
      alert('Calificaciones guardadas exitosamente');
      onClose();
    } catch (err) {
      setError('Error al guardar: ' + getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Calificaciones</h2>
            <p className="text-sm text-gray-500">{asignatura.nombre} — {cursoNombre}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 text-xl">&times;</button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando estudiantes...</div>
          ) : error && !students.length ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-gray-500 font-medium min-w-[160px]">Estudiante</th>
                    {evaluaciones.map(ev => (
                      <th key={ev} className="text-center py-3 px-3 text-gray-500 font-medium w-20">{ev}</th>
                    ))}
                    <th className="text-center py-3 px-3 text-gray-500 font-medium w-16">
                      <button
                        onClick={handleAgregarEvaluacion}
                        className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded hover:bg-primary-200"
                        title="Agregar evaluación"
                      >
                        + Eval
                      </button>
                    </th>
                    <th className="text-center py-3 px-3 text-gray-500 font-medium w-20">Prom</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.estudianteId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium text-gray-800">
                        {s.nombre} {s.apellido}
                      </td>
                      {evaluaciones.map(ev => (
                        <td key={ev} className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="7"
                            value={getNota(s.estudianteId, ev) ?? ''}
                            onChange={(e) => handleNotaChange(s.estudianteId, ev, e.target.value)}
                            className={`w-16 text-center py-1.5 rounded-lg border outline-none transition-colors focus:ring-2 focus:ring-primary-500 ${
                              isDirty(s.estudianteId, ev)
                                ? 'border-accent-400 bg-accent-50'
                                : 'border-gray-200 bg-white'
                            }`}
                            placeholder="—"
                          />
                        </td>
                      ))}
                      <td className="py-2.5 px-3 text-center" />
                      <td className="py-2.5 px-3 text-center font-semibold text-primary-800">
                        {calcularPromedio(s.notas)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex-1" />
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={saving || dirtyCount === 0}
              className="px-4 py-2 text-sm text-white bg-primary-800 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              Guardar Cambios {dirtyCount > 0 && `(${dirtyCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
