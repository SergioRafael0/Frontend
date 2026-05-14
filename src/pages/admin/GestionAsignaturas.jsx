import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function GestionAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', docenteId: '', cursoId: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAsignaturas();
    fetchDocentes();
    fetchCursos();
  }, []);

  const fetchAsignaturas = async () => {
    try {
      const res = await api.get('/asignaturas');
      setAsignaturas(res.data);
    } catch {}
  };

  const fetchDocentes = async () => {
    try {
      const res = await api.get('/usuarios');
      setDocentes(res.data.filter((u) => u.rol === 'DOCENTE'));
    } catch {}
  };

  const fetchCursos = async () => {
    try {
      const res = await api.get('/cursos');
      setCursos(res.data);
    } catch {}
  };

  const getCursoNombre = (cursoId) => {
    const curso = cursos.find((c) => c.id === cursoId);
    return curso ? `${curso.nivel} ${curso.letra}` : `ID: ${cursoId}`;
  };

  const getDocenteNombre = (docenteId) => {
    const docente = docentes.find((d) => d.id === docenteId);
    return docente ? `${docente.nombres} ${docente.apellidos}` : `ID: ${docenteId}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/asignaturas', { nombre: form.nombre, docenteId: parseInt(form.docenteId), cursoId: parseInt(form.cursoId) });
      setShowModal(false);
      setForm({ nombre: '', docenteId: '', cursoId: '' });
      fetchAsignaturas();
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
          <h1 className="text-2xl font-bold text-gray-800">Asignaturas</h1>
          <p className="text-gray-500 mt-1">Gestión de asignaturas del colegio</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Nueva Asignatura</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Curso</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Docente</th>
              </tr>
            </thead>
            <tbody>
              {asignaturas.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{a.nombre}</td>
                  <td className="py-3 px-4 text-gray-600">{getCursoNombre(a.cursoId)}</td>
                  <td className="py-3 px-4 text-gray-600">{getDocenteNombre(a.docenteId)}</td>
                </tr>
              ))}
              {asignaturas.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-gray-400">No hay asignaturas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nueva Asignatura</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                <select value={form.docenteId} onChange={(e) => setForm({ ...form, docenteId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Seleccionar...</option>
                  {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombres} {d.apellidos}</option>)}
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
                  {loading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
