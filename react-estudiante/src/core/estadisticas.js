export const contarMatriculasPorEstado = matriculas => matriculas.reduce((acc, m) => {
  acc[m.estado] = (acc[m.estado] || 0) + 1;
  return acc;
}, {});

export function calcularOcupacionPorClase(matriculas) {
  const ocupacion = new Map();
  matriculas.filter(m => m.estado !== 'rechazada').forEach(m =>
    ocupacion.set(String(m.claseId), (ocupacion.get(String(m.claseId)) || 0) + 1));
  return ocupacion;
}
export const obtenerSedesUnicas = clases => [...new Set(clases.map(c => c.sede))];
export function obtenerRankingClases(matriculas, clases) {
  const ocupacion = calcularOcupacionPorClase(matriculas);
  return [...clases.map(c => ({ ...c, totalMatriculas: ocupacion.get(String(c.id)) || 0 }))]
    .sort((a, b) => b.totalMatriculas - a.totalMatriculas);
}
export function crearGeneradorCodigoMatricula(prefijo = 'MAT', inicio = 0) {
  let contador = inicio;
  return () => `${prefijo}-${String(++contador).padStart(4, '0')}`;
}

export const HORAS_KIOSKO = Array.from({ length: 15 }, (_, indice) => `${String(indice + 7).padStart(2, '0')}:00`);

const minutos = hora => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5));

export function construirGrillaDisponibilidad(clases, matriculas, fecha) {
  return clases.filter(clase => clase.fecha === fecha).map(clase => {
    const activas = matriculas.filter(m => String(m.claseId) === String(clase.id) && m.estado !== 'rechazada');
    const pendientes = activas.filter(m => m.estado === 'pendiente').length;
    const aprobadas = activas.filter(m => m.estado === 'aprobada').length;
    const cupos = Math.max(0, Number(clase.capacidad) - activas.length);
    const celdas = HORAS_KIOSKO.map(hora => {
      const inicio = minutos(hora);
      const programada = inicio < minutos(clase.horaFin) && inicio + 60 > minutos(clase.horaInicio);
      const estado = !programada ? 'sin-clase'
        : clase.estado === 'mantenimiento' || cupos === 0 ? 'ocupada'
          : pendientes > 0 ? 'pendiente' : 'libre';
      return { hora, programada, estado, cupos, pendientes, aprobadas };
    });
    return { clase, celdas };
  });
}
