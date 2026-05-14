import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function GestionCalificaciones() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [filtroEstudiante, setFiltroEstudiante] = useState('');

  useEffect(() => {
    api.get('/asignaturas').then(r => setAsignaturas(r.data)).catch(() => {});
    fetchCalificaciones();
  }, []);

  const fetchCalificaciones = async () => {
    try {
      if (filtroEstudiante) {
        const res = await api.get(`/calificaciones/estudiante/${filtroEstudiante}`);
        setCalificaciones(res.data);
      } else {
        const res = await api.get('/calificaciones');
        setCalificaciones(res.data);
      }
    } catch {}
  };

  useEffect(() => { fetchCalificaciones(); }, [filtroEstudiante]);

  const getAsignaturaNombre = (asignaturaId) => {
    const a = asignaturas.find((as) => as.id === asignaturaId);
    return a ? a.nombre : `ID: ${asignaturaId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Calificaciones</h1>
        <p className="text-gray-500 mt-1">Consulta de calificaciones</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por ID de Estudiante (vacío = todos)</label>
        <input type="number" value={filtroEstudiante} onChange={(e) => setFiltroEstudiante(e.target.value)} placeholder="Dejar vacío para ver todas" className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none w-80 focus:ring-2 focus:ring-primary-500" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estudiante</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Asignatura</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Nota</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{c.id}</td>
                  <td className="py-3 px-4">{c.estudianteId}</td>
                  <td className="py-3 px-4">{getAsignaturaNombre(c.asignaturaId)}</td>
                  <td className="py-3 px-4 font-semibold">{c.nota}</td>
                  <td className="py-3 px-4 text-gray-600">{c.descripcion}</td>
                </tr>
              ))}
              {calificaciones.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No hay calificaciones registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
