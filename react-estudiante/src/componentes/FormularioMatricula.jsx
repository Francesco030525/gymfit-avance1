import { useEffect, useRef, useState } from 'react';
import { validarCodigo } from '../core/validadores.js';
import { Clase, Matricula } from '../core/modelos.js';

export default function FormularioMatricula({ clases, matriculas, usuario, claseInicial, onIntento, onGuardar }) {
  const [claseId, setClaseId] = useState(claseInicial || '');
  const [codigo, setCodigo] = useState(usuario.codigo);
  const [errores, setErrores] = useState({});
  const primerCampo = useRef(null);
  useEffect(() => { primerCampo.current?.focus(); }, []);
  function enviar(evento) {
    evento.preventDefault();
    onIntento();
    const nuevos = {};
    try { validarCodigo(codigo); if (codigo !== usuario.codigo) nuevos.codigo = 'Usa tu propio código de estudiante.'; }
    catch (error) { nuevos.codigo = error.message; }
    const datosClase = clases.find(c => String(c.id) === claseId);
    if (!datosClase) nuevos.claseId = 'Selecciona una clase.';
    if (datosClase) {
      try { new Matricula({ claseId, usuarioId: usuario.id }).validarCupo(new Clase(datosClase), matriculas); }
      catch (error) { nuevos.claseId = error.message; }
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;
    onGuardar({ claseId, usuarioId: usuario.id });
    setClaseId('');
    setCodigo('');
    primerCampo.current?.focus();
  }
  return <form onSubmit={enviar} noValidate className="card card-body shadow-sm">
    <label className="form-label" htmlFor="codigo">Código de estudiante</label>
    <input ref={primerCampo} id="codigo" className="form-control" value={codigo} onChange={e => setCodigo(e.target.value)} />
    {errores.codigo && <small className="text-danger">{errores.codigo}</small>}
    <label className="form-label mt-3" htmlFor="clase">Clase</label>
    <select id="clase" className="form-select" value={claseId} onChange={e => setClaseId(e.target.value)}>
      <option value="">Selecciona una clase</option>
      {clases.map(c => <option key={c.id} value={c.id}>{c.nombre} · {c.fecha} {c.horaInicio}</option>)}
    </select>
    {errores.claseId && <small className="text-danger">{errores.claseId}</small>}
    <button className="btn btn-primary mt-3" type="submit">Guardar matrícula</button>
  </form>;
}
