export function getErrorMessage(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (typeof err.response?.data === 'string') return err.response.data;
  if (err.response?.data?.error) return err.response.data.error;
  if (err.response?.status === 403) return 'Acceso denegado. No tienes permisos para esta acción.';
  if (err.response?.status === 404) return 'Recurso no encontrado.';
  if (err.response?.status === 400) return err.response?.data ? JSON.stringify(err.response.data) : 'Solicitud inválida.';
  if (err.response?.status === 500) return 'Error interno del servidor.';
  return 'Error inesperado. Intenta nuevamente.';
}
