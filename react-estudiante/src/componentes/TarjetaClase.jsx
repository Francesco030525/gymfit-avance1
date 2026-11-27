import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado.jsx';
export default function TarjetaClase({ clase, disponibles }) {
  return <article className="card h-100 shadow-sm"><div className="card-body">
    <div className="d-flex justify-content-between"><h2 className="h5">{clase.nombre}</h2><BadgeEstado estado={clase.estado} /></div>
    <p className="mb-1">{clase.sede} · {clase.instructor}</p>
    <p className="mb-1">{clase.fecha} · {clase.horaInicio}–{clase.horaFin}</p>
    <p className="fw-semibold">{disponibles == null ? 'Consultando cupos...' : `${disponibles} de ${clase.capacidad} cupos disponibles`}</p>
    <Link className="btn btn-outline-primary" to={`/catalogo/${clase.id}`}>Ver detalle</Link>
  </div></article>;
}
