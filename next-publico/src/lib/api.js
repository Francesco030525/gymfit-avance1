const BASE = process.env.GYMFIT_API_URL || 'http://localhost:3000';

export async function consultar(recurso) {
  try {
    const respuesta = await fetch(`${BASE}/${recurso}`, { cache: 'no-store' });
    if (respuesta.status === 404) return null;
    if (!respuesta.ok) throw new Error(`El API respondió ${respuesta.status}.`);
    return await respuesta.json();
  } catch (error) {
    throw new Error(`No se pudo consultar GymFit: ${error.message}`);
  }
}

export const clases = () => consultar('clases');
export const clase = id => consultar(`clases/${encodeURIComponent(id)}`);
export async function matricula(codigo) {
  const resultado = await consultar(`matriculas?codigo=${encodeURIComponent(codigo)}`);
  return Array.isArray(resultado) ? resultado[0] || null : null;
}
