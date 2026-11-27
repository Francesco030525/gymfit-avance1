import Link from 'next/link';
import { notFound } from 'next/navigation';
import { clase, matricula } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { codigo } = await params;
  return { title: `Matrícula ${codigo}`, description: 'Estado público de una matrícula de demostración GymFit.' };
}

export default async function PaginaMatricula({ params }) {
  const { codigo } = await params;
  const registro = await matricula(codigo);
  if (!registro) notFound();
  const actividad = await clase(registro.claseId);
  return <><Link href="/clases">← Clases</Link><p className="eyebrow">SEGUIMIENTO</p><h1>Matrícula {registro.codigo}</h1><p className="estado">Estado: <strong>{registro.estado}</strong></p><p>Clase: {actividad?.nombre || 'Clase no disponible'}</p><p>Sede: {actividad?.sede || 'Sin información'}</p><p>Fecha: {actividad?.fecha || 'Sin información'}</p></>;
}
