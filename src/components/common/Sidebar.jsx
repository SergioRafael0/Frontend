import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/usuarios', label: 'Usuarios', icon: '👥' },
  { path: '/cursos', label: 'Cursos', icon: '📚' },
  { path: '/asignaturas', label: 'Asignaturas', icon: '📖' },
  { path: '/matriculas', label: 'Matrículas', icon: '📝' },
  { path: '/asistencias', label: 'Asistencias', icon: '✅' },
  { path: '/anotaciones', label: 'Anotaciones', icon: '📋' },
  { path: '/calificaciones', label: 'Calificaciones', icon: '📊' },
];

const docenteItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/docente/cursos', label: 'Cursos', icon: '📚' },
  { path: '/docente/asignaturas', label: 'Mis Asignaturas', icon: '📖' },
  { path: '/docente/asistencia', label: 'Registrar Asistencia', icon: '✅' },
  { path: '/docente/anotaciones', label: 'Anotaciones', icon: '📋' },
  { path: '/docente/notas', label: 'Calificaciones', icon: '📊' },
];

const estudianteItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/estudiante/cursos', label: 'Mis Cursos', icon: '📚' },
  { path: '/estudiante/asistencia', label: 'Mi Asistencia', icon: '✅' },
  { path: '/estudiante/notas', label: 'Mis Notas', icon: '📊' },
];

export default function Sidebar({ open, onClose }) {
  const { getRole } = useAuth();
  const role = getRole();

  const menuItems = role === 'ADMIN' ? adminItems
    : role === 'DOCENTE' ? docenteItems
    : role === 'ESTUDIANTE' ? estudianteItems
    : [];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-30 min-h-screen bg-primary-800 text-white w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-700">
          <span className="text-2xl">🏫</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Colegio</h1>
            <p className="text-xs text-primary-200">Bernardo O'Higgins</p>
          </div>
        </div>
        <div className="px-4 py-2 border-b border-primary-700">
          <span className="text-xs uppercase tracking-wider text-primary-300 font-medium">
            {role?.toLowerCase()}
          </span>
        </div>
        <nav className="mt-2 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
