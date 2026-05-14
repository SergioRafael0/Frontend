import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '', rut: '', password: '', rol: 'ESTUDIANTE' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsuarios(); }, []);

  const fetchUsuarios = async () => {
    const res = await api.get('/usuarios');
    setUsuarios(res.data);
  };

  const openCreate = () => {
    setEditando(null);
    setForm({ nombres: '', apellidos: '', email: '', rut: '', password: '', rol: 'ESTUDIANTE' });
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditando(u);
    setForm({ nombres: u.nombres, apellidos: u.apellidos, email: u.email, rut: u.rut, password: '', rol: u.rol.replace('ROLE_', '') });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        rut: form.rut,
        password: form.password,
        rol: form.rol,
        enabled: true,
      };

      if (editando) {
        if (!form.password) delete payload.password;
        await api.put(`/usuarios/${editando.id}`, { ...payload, id: editando.id });
      } else {
        await api.post('/usuarios', payload);
      }
      setShowModal(false);
      fetchUsuarios();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
          <p className="text-gray-500 mt-1">Gestión de usuarios del sistema</p>
        </div>
        <button onClick={openCreate} className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Nuevo Usuario
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Nombre</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">RUT</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Rol</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{u.nombres} {u.apellidos}</td>
                  <td className="py-3 px-4 text-gray-600">{u.email}</td>
                  <td className="py-3 px-4 text-gray-600">{u.rut}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.rol === 'DOCENTE' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{u.rol?.replace('ROLE_', '')}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 mr-3 text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
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
                  <input value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="ADMIN">Admin</option>
                    <option value="DOCENTE">Docente</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{editando ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editando} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-800 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
