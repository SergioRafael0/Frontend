import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function RegistroAsistencia() {
  const { user } = useAuth();
  const [cursosDelDocente, setCursosDelDocente] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/usuarios').then(r => setUsuarios(r.data)).catch(() => {});
    if (user?.id) {
      api.get(`/asignaturas/docente/${user.id}`).then(r => {
        const asigs = r.data;
        const cursoIds = [...new Set(asigs.map(a => a.cursoId))];
        api.get('/cursos').then(cRes => {
          const cursosFiltrados = cRes.data.filter(c => cursoIds.includes(c.id));
          setCursosDelDocente(cursosFiltrados);
        }).catch(() => {});
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCurso) { setEstudiantes([]); return; }
    api.get(`/matriculas/curso/${selectedCurso}`)
      .then(r => {
        const alumnos = r.data.map(m => ({
          estudianteId: m.estudianteId,
          estado: 'PRESENTE',
          observacion: '',
        }));
        setEstudiantes(alumnos);
      })
      .catch(() => setEstudiantes([]));
  }, [selectedCurso]);

  const getUsuario = (id) => usuarios.find(u => u.id === id);

  const actualizarEstado = (estudianteId, estado) => {
    setEstudiantes(prev =>
      prev.map(e => e.estudianteId === estudianteId ? { ...e, estado } : e)
    );
  };

  const actualizarObservacion = (estudianteId, observacion) => {
    setEstudiantes(prev =>
      prev.map(e => e.estudianteId === estudianteId ? { ...e, observacion } : e)
    );
  };

  const handleGuardar = async () => {
    if (!selectedCurso || !fecha) return;
    setLoading(true);
    setSuccess('');
    let errors = [];
    for (const est of estudiantes) {
      try {
        await api.post('/asistencias', {
          idEstudiante: est.estudianteId,
          idDocente: user.id,
          idCurso: parseInt(selectedCurso),
          fecha,
          estadoAsistencia: est.estado,
          observacion: est.observacion || '',
        });
      } catch (err) {
        errors.push(`Estudiante ID ${est.estudianteId}: ${getErrorMessage(err)}`);
      }
    }
    if (errors.length === 0) {
      setSuccess(`Asistencia registrada exitosamente para ${estudiantes.length} estudiantes`);
    } else {
      alert('Errores:\n' + errors.join('\n'));
    }
    setLoading(false);
  };

  const getCursoLabel = (curso) =>
    curso ? `${curso.nivel} ${curso.letra}` : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrar Asistencia</h1>
        <p className="text-gray-500 mt-1">Selecciona curso y fecha para registrar asistencia</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
            <select
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleccionar curso...</option>
              {cursosDelDocente.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCursoLabel(c)} (ID: {c.id})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-56">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {selectedCurso && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Nombre</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Apellido</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Observación</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => {
                  const usr = getUsuario(est.estudianteId);
                  return (
                    <tr key={est.estudianteId} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{usr?.nombres || '—'}</td>
                      <td className="py-3 px-4 text-gray-600">{usr?.apellidos || '—'}</td>
                      <td className="py-3 px-4 text-gray-600">{est.estudianteId}</td>
                      <td className="py-3 px-4">
                        <select
                          value={est.estado}
                          onChange={(e) => actualizarEstado(est.estudianteId, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border outline-none focus:ring-2 focus:ring-primary-500 ${
                            est.estado === 'PRESENTE' ? 'bg-green-50 border-green-300 text-green-700' :
                            est.estado === 'AUSENTE' ? 'bg-red-50 border-red-300 text-red-700' :
                            est.estado === 'ATRASADO' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                            'bg-blue-50 border-blue-300 text-blue-700'
                          }`}
                        >
                          <option value="PRESENTE">PRESENTE</option>
                          <option value="AUSENTE">AUSENTE</option>
                          <option value="ATRASADO">ATRASADO</option>
                          <option value="JUSTIFICADO">JUSTIFICADO</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={est.observacion}
                          onChange={(e) => actualizarObservacion(est.estudianteId, e.target.value)}
                          placeholder="Sin observación"
                          maxLength={250}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </td>
                    </tr>
                  );
                })}
                {estudiantes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      {selectedCurso ? 'No hay estudiantes matriculados en este curso' : 'Selecciona un curso'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {estudiantes.length > 0 && (
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleGuardar}
                disabled={loading}
                className="bg-primary-800 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : `Guardar Asistencias (${estudiantes.length})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
