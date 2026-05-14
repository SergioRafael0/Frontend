import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function GestionAsistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => { fetchAsistencias(); }, []);

  const fetchAsistencias = async () => {
    try {
      let url = '/asistencias';
      if (filtroEstado) {
        url = `/asistencias/estado/${filtroEstado}`;
      } else if (fechaInicio && fechaFin) {
        url = `/asistencias/fecha?inicio=${fechaInicio}&fin=${fechaFin}`;
      }
      const res = await api.get(url);
      setAsistencias(res.data);
    } catch {}
  };

  useEffect(() => { fetchAsistencias(); }, [filtroEstado, fechaInicio, fechaFin]);

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
        <h1 className="text-2xl font-bold text-gray-800">Asistencias</h1>
        <p className="text-gray-500 mt-1">Registro de asistencias</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setFechaInicio(''); setFechaFin(''); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          <option value="">Todos los estados</option>
          <option value="PRESENTE">Presente</option>
          <option value="AUSENTE">Ausente</option>
          <option value="ATRASADO">Atrasado</option>
          <option value="JUSTIFICADO">Justificado</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Desde:</label>
          <input type="date" value={fechaInicio} onChange={(e) => { setFechaInicio(e.target.value); setFiltroEstado(''); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
          <label className="text-sm text-gray-600">Hasta:</label>
          <input type="date" value={fechaFin} onChange={(e) => { setFechaFin(e.target.value); setFiltroEstado(''); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estudiante</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Docente</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Curso</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Observación</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.idAsistencia} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{a.idAsistencia}</td>
                  <td className="py-3 px-4">{a.idEstudiante}</td>
                  <td className="py-3 px-4">{a.idDocente}</td>
                  <td className="py-3 px-4">{a.idCurso}</td>
                  <td className="py-3 px-4">{a.fecha}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(a.estadoAsistencia)}`}>{a.estadoAsistencia}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{a.observacion}</td>
                </tr>
              ))}
              {asistencias.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No hay asistencias registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
