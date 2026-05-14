import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function RegistroNotas() {
  const { user } = useAuth();
  const [form, setForm] = useState({ estudianteId: '', asignaturaId: '', nota: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.post('/calificaciones', {
        estudianteId: parseInt(form.estudianteId),
        asignaturaId: parseInt(form.asignaturaId),
        nota: parseFloat(form.nota),
        descripcion: form.descripcion,
      });
      setSuccess('Calificación registrada exitosamente');
      setForm({ estudianteId: '', asignaturaId: '', nota: '', descripcion: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrar Calificación</h1>
        <p className="text-gray-500 mt-1">Ingresa los datos de la calificación</p>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Estudiante</label>
          <input type="number" value={form.estudianteId} onChange={(e) => setForm({ ...form, estudianteId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Asignatura</label>
          <input type="number" value={form.asignaturaId} onChange={(e) => setForm({ ...form, asignaturaId: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
          <input type="number" step="0.1" min="1" max="7" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Solemne 1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary-800 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Registrando...' : 'Registrar Calificación'}
        </button>
      </form>
    </div>
  );
}
