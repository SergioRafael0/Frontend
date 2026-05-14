import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PerfilModal from './PerfilModal';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { user, logout, getRole } = useAuth();
  const [showPerfil, setShowPerfil] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {getRole()?.toLowerCase()}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPerfil(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {user.nombres?.charAt(0)}{user.apellidos?.charAt(0)}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user.nombres} {user.apellidos}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>
      </header>
      {showPerfil && <PerfilModal onClose={() => setShowPerfil(false)} />}
    </>
  );
}
