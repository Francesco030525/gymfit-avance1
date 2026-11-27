import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';

export const clienteAlova = createAlova({
  baseURL: 'http://localhost:3000',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  cacheFor: { GET: 5000 },
  responded: respuesta => {
    if (!respuesta.ok) throw new Error(`No se pudo consultar el resumen de matrículas (HTTP ${respuesta.status}).`);
    return respuesta.json();
  }
});

export const metodoMatriculas = usuarioId =>
  clienteAlova.Get(`/matriculas?usuarioId=${encodeURIComponent(usuarioId)}`);
