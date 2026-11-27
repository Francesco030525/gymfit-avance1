import axios from 'axios';

export const clienteAxios = axios.create({ baseURL: 'http://localhost:3000', timeout: 8000 });

clienteAxios.interceptors.response.use(
  respuesta => respuesta,
  fallo => {
    if (!fallo.response) return Promise.reject(new Error('No se pudo conectar con el API de GymFit. Comprueba que json-server esté iniciado.'));
    const mensajes = {
      400: 'Los datos enviados no son válidos.',
      404: 'La matrícula ya no existe en el API.',
      409: 'La operación entra en conflicto con los datos actuales.',
      500: 'El API encontró un error interno.'
    };
    return Promise.reject(new Error(mensajes[fallo.response.status] || `El API respondió HTTP ${fallo.response.status}.`));
  }
);

export const consultarTodasMatriculas = async () => (await clienteAxios.get('/matriculas')).data;
export const publicarMatricula = async datos => (await clienteAxios.post('/matriculas', datos)).data;
export const borrarMatricula = async id => clienteAxios.delete(`/matriculas/${encodeURIComponent(id)}`);
