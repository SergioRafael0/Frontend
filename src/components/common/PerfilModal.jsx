import { useAuth } from '../../context/AuthContext';

export default function PerfilModal({ onClose }) {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleBadge = () => {
    const role = user.rol?.replace('ROLE_', '');
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800',
      DOCENTE: 'bg-blue-100 text-blue-800',
      ESTUDIANTE: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary-800 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-white">
              {user.nombres?.charAt(0)}{user.apellidos?.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{user.nombres} {user.apellidos}</h2>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge()}`}>
            {user.rol?.replace('ROLE_', '')}
          </span>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
            <p className="mt-1 text-gray-800">{user.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</label>
            <p className="mt-1 text-gray-800">{user.rut}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</label>
            <p className="mt-1 text-gray-800 capitalize">{user.rol?.replace('ROLE_', '').toLowerCase()}</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
