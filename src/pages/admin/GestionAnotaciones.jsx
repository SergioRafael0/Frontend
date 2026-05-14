import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function GestionAnotaciones() {
  const [anotaciones, setAnotaciones] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstudiante, setFiltroEstudiante] = useState('');

  useEffect(() => { fetchAnotaciones(); }, []);

  const fetchAnotaciones = async () => {
    try {
      let url = '/anotaciones';
      if (filtroTipo) url = `/anotaciones/tipo/${filtroTipo}`;
      else if (filtroEstudiante) url = `/anotaciones/estudiante/${filtroEstudiante}`;
      const res = await api.get(url);
      setAnotaciones(res.data);
    } catch {}
  };

  useEffect(() => { fetchAnotaciones(); }, [filtroTipo, filtroEstudiante]);

  const getTipoBadge = (tipo) => {
    const colors = {
      POSITIVA: 'bg-green-100 text-green-700',
      NEGATIVA: 'bg-red-100 text-red-700',
      OBSERVACION: 'bg-yellow-100 text-yellow-700',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Anotaciones</h1>
        <p className="text-gray-500 mt-1">Registro de anotaciones de estudiantes</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <select value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setFiltroEstudiante(''); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none">
          <option value="">Todos los tipos</option>
          <option value="POSITIVA">Positiva</option>
          <option value="NEGATIVA">Negativa</option>
          <option value="OBSERVACION">Observación</option>
        </select>
        <input
          type="number"
          value={filtroEstudiante}
          onChange={(e) => { setFiltroEstudiante(e.target.value); setFiltroTipo(''); }}
          placeholder="ID Estudiante"
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none w-40"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Estudiante</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Docente</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Fecha</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {anotaciones.map((a) => (
                <tr key={a.idAnotacion} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">{a.idAnotacion}</td>
                  <td className="py-3 px-4">{a.idEstudiante}</td>
                  <td className="py-3 px-4">{a.idDocente}</td>
                  <td className="py-3 px-4">{a.fecha}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoBadge(a.tipoAnotacion)}`}>{a.tipoAnotacion}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-[300px] truncate">{a.descripcion}</td>
                </tr>
              ))}
              {anotaciones.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No hay anotaciones registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
