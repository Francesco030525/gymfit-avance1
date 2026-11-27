import { useState } from 'react';
import { obtenerSedesUnicas } from '../core/estadisticas.js';
import ListaClases from '../componentes/ListaClases.jsx';

export default function Catalogo({ clases, cargando, error, cupos, actualizar }) {
  const [sede, setSede] = useState('');
  const [texto, setTexto] = useState('');
  const filtradas = clases.filter(c => (!sede || c.sede === sede) && c.nombre.toLowerCase().includes(texto.toLowerCase()));
  return <section><h1>Catálogo</h1>
    <div className="row g-2 mb-3">
      <div className="col-md-4"><label htmlFor="sede">Sede</label><select id="sede" className="form-select" value={sede} onChange={e => setSede(e.target.value)}><option value="">Todas</option>{obtenerSedesUnicas(clases).map(s => <option key={s}>{s}</option>)}</select></div>
      <div className="col-md-5"><label htmlFor="buscar">Buscar clase</label><input id="buscar" className="form-control" value={texto} onChange={e => setTexto(e.target.value)} /></div>
      <div className="col-md-3 d-flex align-items-end"><button className="btn btn-outline-primary" onClick={actualizar}>Actualizar catálogo</button></div>
    </div>
    {cargando ? <p role="status">Cargando clases...</p>
      : error ? <p role="alert" className="alert alert-danger">{error}</p>
        : clases.length === 0 ? <p>No hay clases en el API.</p>
          : <ListaClases clases={filtradas} cupos={cupos} />}
  </section>;
}
