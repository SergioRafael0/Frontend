import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { formatearRut } from '../../utils/rutUtils';

export default function Register() {
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '', password: '', rut: '', rol: 'ESTUDIANTE' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        password: form.password,
        rut: form.rut,
        rol: form.rol,
      });
      setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary-800 px-8 py-6 text-center">
            <div className="text-4xl mb-2">🏫</div>
            <h1 className="text-xl font-bold text-white">Crear Cuenta</h1>
            <p className="text-primary-200 text-sm mt-1">Colegio Bernardo O'Higgins</p>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input value={form.rut} onChange={(e) => setForm({ ...form, rut: formatearRut(e.target.value) })} required placeholder="12.345.678-9" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="DOCENTE">Docente</option>
                  <option value="APODERADO">Apoderado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-800 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </form>
        </div>
        <p className="text-center text-primary-200 text-xs mt-4">© 2026 Colegio Bernardo O'Higgins</p>
      </div>
    </div>
  );
}
