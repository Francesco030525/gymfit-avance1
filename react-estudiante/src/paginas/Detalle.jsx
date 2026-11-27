import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BadgeEstado from '../componentes/BadgeEstado.jsx';
import { obtenerClase } from '../servicios/clienteFetch.js';

export default function Detalle({ cupos }) {
  const { id } = useParams();
  const [clase, setClase] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError('');
    obtenerClase(id).then(resultado => { if (activo) setClase(resultado); })
      .catch(fallo => { if (activo) setError(fallo.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [id]);
  if (cargando) return <p role="status">Cargando detalle de la clase...</p>;
  if (error) return <p role="alert" className="alert alert-danger">{error}</p>;
  if (!clase) return <p>Clase no encontrada. <Link to="/catalogo">Volver al catálogo</Link></p>;
  const disponibles = cupos(clase);
  return <section><h1>{clase.nombre}</h1><p>{clase.sede} · {clase.instructor}</p>
    <p>{clase.fecha}, {clase.horaInicio}–{clase.horaFin}</p>
    <p><BadgeEstado estado={clase.estado} /> · {disponibles == null ? 'Consultando cupos...' : `${disponibles} cupos libres`}</p>
    <Link className="btn btn-primary" to={`/nueva-matricula?claseId=${clase.id}`}>Matricularme</Link>
  </section>;
}
