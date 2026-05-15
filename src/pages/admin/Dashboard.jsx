import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const { user, getRole } = useAuth();
  const navigate = useNavigate();
  const role = getRole();
  const [stats, setStats] = useState({ usuarios: 0, cursos: 0, estudiantes: 0, docentes: 0 });
  const [usuarios, setUsuarios] = useState([]);
  const [asistenciasCount, setAsistenciasCount] = useState(0);
  const [misNotas, setMisNotas] = useState([]);
  const [docenteAsigCount, setDocenteAsigCount] = useState(0);
  const [docenteEstCount, setDocenteEstCount] = useState(0);
  const [docenteNotasCount, setDocenteNotasCount] = useState(0);
  const [ultimasAnotaciones, setUltimasAnotaciones] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [estAnotaciones, setEstAnotaciones] = useState([]);
  const [estCursosCount, setEstCursosCount] = useState(0);
  const [estAsistenciaPresente, setEstAsistenciaPresente] = useState(0);
  const [estAsistenciaTotal, setEstAsistenciaTotal] = useState(0);

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
        .then(async r => {
          const asigs = r.data;
          setDocenteAsigCount(asigs.length);
          let totalEst = 0;
          for (const a of asigs) {
            try {
              const matRes = await api.get(`/matriculas/curso/${a.cursoId}`);
              totalEst += matRes.data.length;
            } catch {}
          }
          setDocenteEstCount(totalEst);
        })
        .catch(() => {});
      api.get('/calificaciones/mis-calificaciones')
        .then(r => setDocenteNotasCount(r.data.length))
        .catch(() => {});
      api.get(`/anotaciones/docente/${user.id}`)
        .then(r => setUltimasAnotaciones(r.data.slice(-5).reverse()))
        .catch(() => {});
      api.get('/usuarios')
        .then(r => setTodosUsuarios(r.data))
        .catch(() => {});
    } else if (role === 'ESTUDIANTE') {
      api.get(`/calificaciones/estudiante/${user.id}`)
        .then(r => setMisNotas(r.data))
        .catch(() => {});
      api.get(`/anotaciones/estudiante/${user.id}`)
        .then(r => setEstAnotaciones(r.data.slice(-5).reverse()))
        .catch(() => {});
      api.get('/asistencias')
        .then(r => {
          const misAsis = r.data.filter(a => a.idEstudiante === user.id);
          setEstAsistenciaTotal(misAsis.length);
          setEstAsistenciaPresente(misAsis.filter(a => a.estadoAsistencia === 'PRESENTE').length);
        })
        .catch(() => {});
      api.get('/matriculas')
        .then(r => setEstCursosCount(r.data.filter(m => m.estudianteId === user.id).length))
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mis Asignaturas</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{docenteAsigCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-xl">📖</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Estudiantes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{docenteEstCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-xl">👥</div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Calificaciones</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{docenteNotasCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-xl">📊</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Anotaciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Estudiante</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Fecha</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasAnotaciones.map((a) => {
                    const est = todosUsuarios.find(u => u.id === a.idEstudiante);
                    return (
                      <tr key={a.idAnotacion} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{est ? `${est.nombres} ${est.apellidos}` : `ID: ${a.idEstudiante}`}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            a.tipoAnotacion === 'POSITIVA' ? 'bg-green-100 text-green-700' :
                            a.tipoAnotacion === 'NEGATIVA' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{a.tipoAnotacion}</span>
                        </td>
                        <td className="py-3 px-2 text-gray-600">{a.fecha}</td>
                        <td className="py-3 px-2 text-gray-600 max-w-[300px] truncate">{a.descripcion}</td>
                      </tr>
                    );
                  })}
                  {ultimasAnotaciones.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-gray-400">No hay anotaciones registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/docente/asistencia')} className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                ✅ Registrar Asistencia
              </button>
              <button onClick={() => navigate('/docente/anotaciones')} className="flex items-center gap-2 px-5 py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors font-medium">
                📝 Registrar Anotación
              </button>
              <button onClick={() => navigate('/docente/asignaturas')} className="flex items-center gap-2 px-5 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-medium">
                📊 Ver Calificaciones
              </button>
              <button onClick={() => navigate('/docente/cursos')} className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors font-medium">
                👥 Ver Cursos
              </button>
            </div>
          </div>
        </>
      )}

      {role === 'ESTUDIANTE' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Mis Cursos</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{estCursosCount}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-xl">📚</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Anotaciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Tipo</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Fecha</th>
                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {estAnotaciones.map((a) => (
                    <tr key={a.idAnotacion} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.tipoAnotacion === 'POSITIVA' ? 'bg-green-100 text-green-700' :
                          a.tipoAnotacion === 'NEGATIVA' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{a.tipoAnotacion}</span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{a.fecha}</td>
                      <td className="py-3 px-2 text-gray-600 max-w-[400px] truncate">{a.descripcion}</td>
                    </tr>
                  ))}
                  {estAnotaciones.length === 0 && (
                    <tr><td colSpan={3} className="py-8 text-center text-gray-400">No tienes anotaciones registradas</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/estudiante/cursos')} className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors font-medium">
                📚 Mis Cursos
              </button>
              <button onClick={() => navigate('/estudiante/asistencia')} className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors font-medium">
                ✅ Mi Asistencia
              </button>
              <button onClick={() => navigate('/estudiante/notas')} className="flex items-center gap-2 px-5 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-medium">
                📊 Mis Notas
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
