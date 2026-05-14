import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function GestionMatriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ estudianteId: '', cursoId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatriculas();
    api.get('/usuarios').then(r => setEstudiantes(r.data.filter(u => u.rol === 'ESTUDIANTE'))).catch(() => {});
    api.get('/cursos').then(r => setCursos(r.data)).catch(() => {});
  }, []);

  const fetchMatriculas = async () => {
    try {
      if (selectedCurso) {
        const res = await api.get(`/matriculas/curso/${selectedCurso}`);
        setMatriculas(res.data);
      } else {
        const res = await api.get('/matriculas');
        setMatriculas(res.data);
      }
    } catch {}
  };

  useEffect(() => { fetchMatriculas(); }, [selectedCurso]);

  const getCursoNombre = (cursoId) => {
    const curso = cursos.find((c) => c.id === cursoId);
    return curso ? `${curso.nivel} ${curso.letra}` : `ID: ${cursoId}`;
  };

  const getEstudianteNombre = (estudianteId) => {
    const est = estudiantes.find((e) => e.id === estudianteId);
    return est ? `${est.nombres} ${est.apellidos}` : `ID: ${estudianteId}`;
  };

  const handleMatricular = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/matriculas', { estudianteId: parseInt(form.estudianteId), cursoId: parseInt(form.cursoId) });
      setShowModal(false);
      setForm({ estudianteId: '', cursoId: '' });
      fetchMatriculas();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Matrículas</h1>
          <p className="text-gray-500 mt-1">Gestión de matrículas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Matricular</button>
      </div>
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filtrar por curso:</label>
        <select value={selectedCurso} onChange={(e) => setSelectedCurso(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">Todos los cursos</option>
          {cursos.map((c) => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estudiante</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Curso</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{getEstudianteNombre(m.estudianteId)}</td>
                  <td className="py-3 px-4 text-gray-600">{getCursoNombre(m.cursoId)}</td>
                </tr>
              ))}
              {matriculas.length === 0 && (
                <tr><td colSpan={2} className="py-8 text-center text-gray-400">No hay matrículas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nueva Matrícula</h2>
            <form onSubmit={handleMatricular} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
                <select value={form.estudianteId} onChange={(e) => setForm({ ...form, estudianteId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Seleccionar...</option>
                  {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos} - {e.rut}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                <select value={form.cursoId} onChange={(e) => setForm({ ...form, cursoId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Seleccionar...</option>
                  {cursos.map((c) => <option key={c.id} value={c.id}>{c.nivel} {c.letra}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-primary-800 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {loading ? 'Matriculando...' : 'Matricular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
