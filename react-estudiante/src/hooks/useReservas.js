import { useCallback, useEffect, useRef, useState } from 'react';
import { useRequest } from 'alova/client';
import { Clase, Matricula } from '../core/modelos.js';
import { crearGeneradorCodigoMatricula } from '../core/estadisticas.js';
import { metodoMatriculas } from '../servicios/clienteAlova.js';
import { borrarMatricula, consultarTodasMatriculas, publicarMatricula } from '../servicios/clienteAxios.js';

export function useReservas(usuarioId) {
  const { data, loading, error: errorAlova, send } = useRequest(
    () => metodoMatriculas(usuarioId || '__sin_usuario__'),
    { immediate: false, initialData: [], force: ({ args }) => Boolean(args[0]) }
  );
  const [todas, setTodas] = useState(null);
  const [cargandoTodas, setCargandoTodas] = useState(false);
  const [operando, setOperando] = useState(false);
  const [errorLocal, setErrorLocal] = useState(null);

  const cargarTodas = useCallback(async () => {
    setCargandoTodas(true);
    try {
      const resultado = await consultarTodasMatriculas();
      setTodas(resultado);
      return resultado;
    } catch (fallo) {
      setTodas(null);
      throw fallo;
    } finally {
      setCargandoTodas(false);
    }
  }, []);

  const actualizar = useCallback(async (forzar = true) => {
    setErrorLocal(null);
    try {
      const solicitudes = [cargarTodas()];
      if (usuarioId) solicitudes.push(send(forzar));
      return await Promise.all(solicitudes);
    } catch (fallo) {
      setErrorLocal(fallo);
      throw fallo;
    }
  }, [cargarTodas, send, usuarioId]);

  const actualizarRef = useRef(actualizar);
  actualizarRef.current = actualizar;
  useEffect(() => { actualizarRef.current(false).catch(() => {}); }, [usuarioId]);

  async function crear(clase) {
    if (!usuarioId) throw new Error('Inicia sesión antes de matricularte.');
    setOperando(true);
    setErrorLocal(null);
    try {
      const actuales = await consultarTodasMatriculas();
      new Matricula({ claseId: clase.id, usuarioId }).validarCupo(new Clase(clase), actuales);
      const ultimo = Math.max(0, ...actuales.map(m => Number(String(m.codigo).replace(/^MAT-/, '')) || 0));
      const codigo = crearGeneradorCodigoMatricula('MAT', ultimo)();
      const creada = await publicarMatricula({
        id: crypto.randomUUID(), codigo, claseId: String(clase.id), usuarioId: String(usuarioId),
        estado: 'pendiente', creadoEn: new Date().toISOString()
      });
      await actualizar(true);
      return creada;
    } catch (fallo) {
      setErrorLocal(fallo);
      throw fallo;
    } finally {
      setOperando(false);
    }
  }

  async function cancelar(matricula) {
    if (String(matricula.usuarioId) !== String(usuarioId)) throw new Error('Esta matrícula no pertenece a tu sesión.');
    setOperando(true);
    setErrorLocal(null);
    try {
      await borrarMatricula(matricula.id);
      await actualizar(true);
    } catch (fallo) {
      setErrorLocal(fallo);
      throw fallo;
    } finally {
      setOperando(false);
    }
  }

  return {
    datos: usuarioId && Array.isArray(data) ? data.filter(m => String(m.usuarioId) === String(usuarioId)) : [], todas,
    cargando: loading || cargandoTodas || operando, error: errorLocal || errorAlova,
    crear, cancelar, actualizar
  };
}
