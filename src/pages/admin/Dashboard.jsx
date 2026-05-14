import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Dashboard() {
  const { user, getRole } = useAuth();
  const role = getRole();
  const [stats, setStats] = useState({ usuarios: 0, cursos: 0, estudiantes: 0, docentes: 0 });
  const [usuarios, setUsuarios] = useState([]);
  const [asistenciasCount, setAsistenciasCount] = useState(0);
  const [misNotas, setMisNotas] = useState([]);

  useEffect(() => {
    if (role === 'ADMIN') {
      const fetchData = async () => {
        try {
          const usersRes = await api.get('/usuarios');
          const users = usersRes.data;
          setUsuarios(users.slice(0, 5));
          setStats({
            usuarios: users.length,
            estudiantes: users.filter((u) => u.rol === 'ESTUDIANTE').length,
            docentes: users.filter((u) => u.rol === 'DOCENTE').length,
            cursos: 0,
          });
          try {
            const cursosRes = await api.get('/cursos');
            setStats((prev) => ({ ...prev, cursos: cursosRes.data.length }));
          } catch (e) { console.error('Error al cargar cursos:', e); }
          try {
            const asisRes = await api.get('/asistencias');
            setAsistenciasCount(asisRes.data.length);
          } catch (e) { console.error('Error al cargar asistencias:', e); }
        } catch (e) { console.error('Error al cargar usuarios:', e); }
      };
      fetchData();
    } else if (role === 'DOCENTE') {
      api.get(`/asignaturas/docente/${user.id}`)
        .then(r => setStats(prev => ({ ...prev, cursos: r.data.length })))
        .catch(() => {});
    } else if (role === 'ESTUDIANTE') {
      api.get(`/calificaciones/estudiante/${user.id}`)
        .then(r => setMisNotas(r.data))
        .catch(() => {});
    }
  }, [role, user]);

  const adminCards = [
    { label: 'Total Usuarios', value: stats.usuarios, color: 'bg-blue-500', icon: '👥' },
    { label: 'Docentes', value: stats.docentes, color: 'bg-green-500', icon: '👨‍🏫' },
    { label: 'Estudiantes', value: stats.estudiantes, color: 'bg-purple-500', icon: '👩‍🎓' },
    { label: 'Cursos', value: stats.cursos, color: 'bg-accent-500', icon: '📚' },
  ];

  const docenteCards = [
    { label: 'Mis Asignaturas', value: stats.cursos, color: 'bg-blue-500', icon: '📖' },
    { label: 'Asistencias Totales', value: asistenciasCount, color: 'bg-green-500', icon: '✅' },
  ];

  const estudianteNotas = misNotas.length;
  const estudiantePromedio = estudianteNotas > 0
    ? (misNotas.reduce((s, c) => s + c.nota, 0) / estudianteNotas).toFixed(1)
    : '-';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {role === 'ADMIN' && 'Dashboard'}
          {role === 'DOCENTE' && 'Panel Docente'}
          {role === 'ESTUDIANTE' && 'Mi Panel'}
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenido, {user?.nombres}
        </p>
      </div>

      {role === 'ADMIN' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-xl`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Usuarios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Nombre</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Rol</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">RUT</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{u.nombres} {u.apellidos}</td>
                      <td className="py-3 px-2 text-gray-600">{u.email}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.rol === 'DOCENTE' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>{u.rol?.replace('ROLE_', '')}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{u.rut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {role === 'DOCENTE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docenteCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {role === 'ESTUDIANTE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Notas Registradas</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{estudianteNotas}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xl">📊</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Promedio General</p>
                <p className="text-3xl font-bold text-primary-800 mt-1">{estudiantePromedio}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-xl">⭐</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
