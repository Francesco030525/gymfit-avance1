const BASE_URL = 'http://localhost:3000';

async function leer(recurso, descripcion, permitir404 = false) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${recurso}`);
  } catch {
    throw new Error('No se pudo conectar con el API de GymFit. Comprueba que json-server esté iniciado.');
  }
  if (!respuesta.ok) {
    if (respuesta.status === 404 && permitir404) return null;
    throw new Error(`No se pudo cargar ${descripcion} (HTTP ${respuesta.status}).`);
  }
  return respuesta.json();
}

export const obtenerClases = () => leer('/clases', 'el catálogo');
export const obtenerClase = id => leer(`/clases/${encodeURIComponent(id)}`, 'el detalle de la clase', true);
export const buscarUsuarios = correo => leer(`/usuarios?correo=${encodeURIComponent(correo)}`, 'el usuario');
