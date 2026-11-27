const estados = [
  { clave: 'pendiente', titulo: 'Pendientes', color: 'warning' },
  { clave: 'aprobada', titulo: 'Aprobadas', color: 'success' },
  { clave: 'rechazada', titulo: 'Rechazadas', color: 'danger' }
];

export default function ResumenMatriculas({ matriculas }) {
  return <div className="row g-2 mb-3">{estados.map(estado =>
    <div className="col-md-4" key={estado.clave}>
      <div className={`card border-${estado.color}`}><div className="card-body">
        <h2 className="h6">{estado.titulo}</h2>
        <strong>{matriculas.filter(m => m.estado === estado.clave).length}</strong>
      </div></div>
    </div>
  )}</div>;
}
