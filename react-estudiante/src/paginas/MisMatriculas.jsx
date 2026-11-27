import { useState } from 'react';
import BadgeEstado from '../componentes/BadgeEstado.jsx';
import ResumenMatriculas from '../componentes/ResumenMatriculas.jsx';

export default function MisMatriculas({ matriculas, clases, cargando, error, actualizar, cancelar }) {
  const [errorAccion, setErrorAccion] = useState('');
  async function eliminar(matricula) {
    setErrorAccion('');
    try { await cancelar(matricula); }
    catch (fallo) { setErrorAccion(fallo.message); }
  }
  return <section><div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-3">
    <h1 className="mb-0">Mis matrículas</h1>
    <button className="btn btn-outline-primary" onClick={() => actualizar(true).catch(() => {})}>Actualizar</button>
  </div>
    {cargando && <p role="status">Cargando matrículas...</p>}
    {(errorAccion || error) && <p role="alert" className="alert alert-danger">{errorAccion || error.message}</p>}
    {!cargando && !error && <><ResumenMatriculas matriculas={matriculas} />
      {matriculas.length ? <div className="list-group">{matriculas.map(m => {
        const clase = clases.find(c => String(c.id) === String(m.claseId));
        return <div className="list-group-item d-flex justify-content-between align-items-center gap-2 flex-wrap" key={m.id}>
          <span><strong>{m.codigo}</strong> · {clase?.nombre || `Clase ${m.claseId}`} · <BadgeEstado estado={m.estado} /></span>
          <button className="btn btn-sm btn-outline-danger" disabled={cargando} onClick={() => eliminar(m)}>Cancelar</button>
        </div>;
      })}</div> : <p>Aún no tienes matrículas.</p>}
    </>}
  </section>;
}
