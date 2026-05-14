import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function GestionCursos() {
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nivel: '', letra: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCursos(); }, []);

  const fetchCursos = async () => {
    try {
      const res = await api.get('/cursos');
      setCursos(res.data);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/cursos', form);
      setShowModal(false);
      setForm({ nivel: '', letra: '' });
      fetchCursos();
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
          <h1 className="text-2xl font-bold text-gray-800">Cursos</h1>
          <p className="text-gray-500 mt-1">Gestión de cursos del colegio</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Curso
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 text-primary-800 rounded-lg flex items-center justify-center text-xl font-bold">
                {c.nivel?.charAt(0)}{c.letra}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{c.nivel} {c.letra}</h3>
                <p className="text-xs text-gray-500">ID: {c.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Nuevo Curso</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <input value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} required placeholder="Ej: 1 Medio" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letra</label>
                <input value={form.letra} onChange={(e) => setForm({ ...form, letra: e.target.value })} required placeholder="Ej: A" maxLength={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-800 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {loading ? 'Creando...' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
