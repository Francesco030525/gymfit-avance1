import Link from 'next/link';
import { notFound } from 'next/navigation';
import { clase, consultar } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await clase(id);
  return { title: item ? item.nombre : 'Clase no encontrada', description: item ? `${item.nombre} en ${item.sede}, ${item.fecha}.` : 'La clase solicitada no existe.' };
}

export default async function PaginaDetalle({ params }) {
  const { id } = await params;
  const item = await clase(id);
  if (!item) notFound();
  const matriculas = await consultar(`matriculas?claseId=${encodeURIComponent(id)}`);
  const aprobadas = matriculas.filter(m => m.estado === 'aprobada').length;
  const activas = matriculas.filter(m => m.estado !== 'rechazada').length;
  return <><Link href="/clases">← Todas las clases</Link><p className="eyebrow">{item.sede}</p><h1>{item.nombre}</h1><dl><dt>Instructor</dt><dd>{item.instructor}</dd><dt>Fecha</dt><dd>{item.fecha}</dd><dt>Horario</dt><dd>{item.horaInicio}–{item.horaFin}</dd><dt>Capacidad</dt><dd>{item.capacidad}</dd><dt>Cupos disponibles</dt><dd>{Math.max(0, item.capacidad - activas)}</dd><dt>Matrículas aprobadas</dt><dd>{aprobadas}</dd><dt>Estado</dt><dd>{item.estado}</dd></dl><p>Para matricularte, usa el portal del estudiante.</p></>;
}
