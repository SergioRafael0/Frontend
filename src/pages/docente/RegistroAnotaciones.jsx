import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function RegistroAnotaciones() {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [form, setForm] = useState({ idEstudiante: '', fecha: new Date().toISOString().split('T')[0], tipoAnotacion: 'OBSERVACION', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/usuarios')
      .then(r => setEstudiantes(
        r.data
          .filter(u => u.rol === 'ESTUDIANTE')
          .sort((a, b) => `${a.apellidos} ${a.nombres}`.localeCompare(`${b.apellidos} ${b.nombres}`))
      ))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.post('/anotaciones', {
        idEstudiante: parseInt(form.idEstudiante),
        idDocente: user.id,
        fecha: form.fecha,
        tipoAnotacion: form.tipoAnotacion,
        descripcion: form.descripcion,
      });
      setSuccess('Anotación registrada exitosamente');
      setForm({ idEstudiante: '', fecha: new Date().toISOString().split('T')[0], tipoAnotacion: 'OBSERVACION', descripcion: '' });
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registrar Anotación</h1>
        <p className="text-gray-500 mt-1">Selecciona el estudiante y completa los datos</p>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
          <select
            value={form.idEstudiante}
            onChange={(e) => setForm({ ...form, idEstudiante: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Seleccionar estudiante...</option>
            {estudiantes.map((e) => (
              <option key={e.id} value={e.id}>{e.apellidos}, {e.nombres} (ID: {e.id})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select value={form.tipoAnotacion} onChange={(e) => setForm({ ...form, tipoAnotacion: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
            <option value="POSITIVA">Positiva</option>
            <option value="NEGATIVA">Negativa</option>
            <option value="OBSERVACION">Observación</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary-800 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Registrando...' : 'Registrar Anotación'}
        </button>
      </form>
    </div>
  );
}
