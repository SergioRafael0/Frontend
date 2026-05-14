import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function RegistroAsistencia() {
  const { user } = useAuth();
  const [form, setForm] = useState({ idEstudiante: '', idCurso: '', fecha: '', estadoAsistencia: 'PRESENTE', observacion: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.post('/asistencias', {
        idEstudiante: parseInt(form.idEstudiante),
        idDocente: user.id,
        idCurso: parseInt(form.idCurso),
        fecha: form.fecha,
        estadoAsistencia: form.estadoAsistencia,
        observacion: form.observacion,
      });
      setSuccess('Asistencia registrada exitosamente');
      setForm({ idEstudiante: '', idCurso: '', fecha: '', estadoAsistencia: 'PRESENTE', observacion: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrar Asistencia</h1>
        <p className="text-gray-500 mt-1">Ingresa los datos de la asistencia</p>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Estudiante</label>
          <input type="number" value={form.idEstudiante} onChange={(e) => setForm({ ...form, idEstudiante: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Curso</label>
          <input type="number" value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select value={form.estadoAsistencia} onChange={(e) => setForm({ ...form, estadoAsistencia: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option value="PRESENTE">Presente</option>
            <option value="AUSENTE">Ausente</option>
            <option value="ATRASADO">Atrasado</option>
            <option value="JUSTIFICADO">Justificado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
          <textarea value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary-800 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Registrando...' : 'Registrar Asistencia'}
        </button>
      </form>
    </div>
  );
}
