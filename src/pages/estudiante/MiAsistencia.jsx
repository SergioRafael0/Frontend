import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function MiAsistencia() {
  const { user } = useAuth();
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get('/asistencias')
        .then(r => setAsistencias(r.data.filter(a => a.idEstudiante === user.id)))
        .catch(() => {});
    }
  }, [user]);

  const getEstadoBadge = (estado) => {
    const colors = {
      PRESENTE: 'bg-green-100 text-green-700',
      AUSENTE: 'bg-red-100 text-red-700',
      ATRASADO: 'bg-yellow-100 text-yellow-700',
      JUSTIFICADO: 'bg-blue-100 text-blue-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mi Asistencia</h1>
        <p className="text-gray-500 mt-1">Registro de tus asistencias</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Observación</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.idAsistencia} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{a.fecha}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(a.estadoAsistencia)}`}>{a.estadoAsistencia}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{a.observacion || '-'}</td>
                </tr>
              ))}
              {asistencias.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-gray-400">No hay registros de asistencia</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
