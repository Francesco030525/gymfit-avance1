import Link from 'next/link';
import { clases, consultar } from '../../lib/api';

export const metadata = { title: 'Clases' };
export const dynamic = 'force-dynamic';
export default async function PaginaClases() {
  const [lista, matriculas] = await Promise.all([clases(), consultar('matriculas')]);
  const ocupacion = new Map();
  matriculas.filter(m => m.estado !== 'rechazada').forEach(m => ocupacion.set(String(m.claseId), (ocupacion.get(String(m.claseId)) || 0) + 1));
  return <><p className="eyebrow">CATÁLOGO</p><h1>Clases GymFit</h1><p>Horarios y sedes disponibles en el API.</p><section className="tarjetas">
    {lista?.map(item => <article key={item.id}><p className="eyebrow">{item.sede}</p><h2>{item.nombre}</h2><p>Instructor: {item.instructor}</p><p>{item.fecha} · {item.horaInicio}–{item.horaFin}</p><p>{item.estado} · Capacidad: {item.capacidad} · Cupos: {Math.max(0, item.capacidad - (ocupacion.get(String(item.id)) || 0))}</p><Link href={`/clases/${encodeURIComponent(item.id)}`}>Ver detalle →</Link></article>)}
  </section>{!lista?.length && <p>No hay clases registradas.</p>}</>;
}
