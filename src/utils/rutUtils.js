export function formatearRut(value) {
  let limpio = value.replace(/[^0-9Kk]/g, '');

  if (limpio.length > 9) limpio = limpio.slice(0, 9);

  const dv = limpio.slice(-1);
  let cuerpo = limpio.slice(0, -1);

  if (cuerpo.length > 3)
    cuerpo = cuerpo.slice(0, -3) + '.' + cuerpo.slice(-3);
  if (cuerpo.length > 7)
    cuerpo = cuerpo.slice(0, -7) + '.' + cuerpo.slice(-7);

  return dv ? cuerpo + '-' + dv.toUpperCase() : cuerpo;
}
