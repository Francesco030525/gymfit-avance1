import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import datos from './data/db.json';
import { Clase } from './core/modelos.js';
import { crearGeneradorCodigoMatricula, obtenerSedesUnicas } from './core/estadisticas.js';
import { Proveedores, useAuth, useTheme } from './contextos.jsx';
import Navbar from './componentes/Navbar.jsx';
import ListaClases from './componentes/ListaClases.jsx';
import FormularioMatricula from './componentes/FormularioMatricula.jsx';
import BadgeEstado from './componentes/BadgeEstado.jsx';

const siguienteCodigo = crearGeneradorCodigoMatricula('MAT', Math.max(...datos.matriculas.map(m => Number(m.codigo.slice(4)))));
function Protegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}
function Detalle({ clases, cupos }) {
  const { id } = useParams();
  const clase = clases.find(c => String(c.id) === id);
  if (!clase) return <p>Clase no encontrada. <Link to="/catalogo">Volver al catálogo</Link></p>;
  return <section><h1>{clase.nombre}</h1><p>{clase.sede} · {clase.instructor}</p>
    <p>{clase.fecha}, {clase.horaInicio}–{clase.horaFin}</p>
    <p><BadgeEstado estado={clase.estado} /> · {cupos(clase)} cupos libres</p>
    <Link className="btn btn-primary" to={`/nueva-matricula?claseId=${clase.id}`}>Matricularme</Link>
  </section>;
}
function Login() {
  const { login } = useAuth();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function enviar(e) {
    e.preventDefault();
    try { login(correo, password); navegar('/mis-matriculas'); }
    catch (err) { setError(err.message); }
  }
  return <section><h1>Iniciar sesión</h1><p>Demo: demo+gymfit-u90000003@gymfit.pe / solo-demo-2026</p>
    <form onSubmit={enviar} className="card card-body col-md-6" noValidate>
      <label htmlFor="correo">Correo</label><input id="correo" className="form-control mb-3" value={correo} onChange={e => setCorreo(e.target.value)} />
      <label htmlFor="password">Contraseña</label><input id="password" type="password" className="form-control mb-3" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="text-danger">{error}</p>}<button className="btn btn-primary">Entrar</button>
    </form></section>;
}
function Contenido() {
  const [matriculas, setMatriculas] = useState(datos.matriculas);
  const [sede, setSede] = useState('');
  const [texto, setTexto] = useState('');
  const [ahora, setAhora] = useState(Date.now());
  const [mensaje, setMensaje] = useState('');
  const { usuario } = useAuth();
  const { oscuro } = useTheme();
  const ubicacion = useLocation();
  const clases = datos.clases;
  const cupos = clase => new Clase(clase).cuposDisponibles(matriculas);
  const filtradas = clases.filter(c => (!sede || c.sede === sede) && c.nombre.toLowerCase().includes(texto.toLowerCase()));
  const propias = matriculas.filter(m => String(m.usuarioId) === String(usuario?.id));
  const proxima = propias.filter(m => m.estado !== 'rechazada').map(m => clases.find(c => String(c.id) === String(m.claseId)))
    .filter(Boolean).map(c => ({ clase: c, tiempo: new Date(`${c.fecha}T${c.horaInicio}:00`).getTime() }))
    .filter(x => x.tiempo > ahora).sort((a, b) => a.tiempo - b.tiempo)[0];
  const resta = proxima ? Math.max(0, Math.floor((proxima.tiempo - ahora) / 1000)) : 0;
  const cuenta = `${Math.floor(resta / 86400)}d ${Math.floor(resta % 86400 / 3600)}h ${Math.floor(resta % 3600 / 60)}m ${resta % 60}s`;
  useEffect(() => {
    const titulo = ubicacion.pathname === '/' ? 'Inicio' : ubicacion.pathname.split('/')[1] || 'GymFit';
    document.title = `GymFit | ${titulo}`;
  }, [ubicacion.pathname]);
  useEffect(() => {
    const intervalo = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(intervalo);
  }, []);
  function guardar(datosNuevos) {
    setMatriculas(prev => [...prev, { ...datosNuevos, id: String(Date.now()), codigo: siguienteCodigo(), estado: 'pendiente', creadoEn: new Date().toISOString() }]);
    setMensaje('Matrícula guardada en los datos locales de esta sesión.');
  }
  return <div data-bs-theme={oscuro ? 'dark' : 'light'} className="app-shell">
    <Navbar titulo="GymFit" />
    <main className="container py-4">
      {proxima && <p className="alert alert-info">Próxima clase: {proxima.clase.nombre} · faltan {cuenta}</p>}
      {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}
      <Routes>
        <Route path="/" element={<section><h1>Clases GymFit</h1><p>Explora el catálogo y reserva tu cupo.</p><Link className="btn btn-primary" to="/catalogo">Ver clases</Link></section>} />
        <Route path="/catalogo" element={<section><h1>Catálogo</h1><div className="row g-2 mb-3">
          <div className="col-md-4"><label htmlFor="sede">Sede</label><select id="sede" className="form-select" value={sede} onChange={e => setSede(e.target.value)}><option value="">Todas</option>{obtenerSedesUnicas(clases).map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="col-md-5"><label htmlFor="buscar">Buscar clase</label><input id="buscar" className="form-control" value={texto} onChange={e => setTexto(e.target.value)} /></div>
        </div><ListaClases clases={filtradas} cupos={cupos} /></section>} />
        <Route path="/catalogo/:id" element={<Detalle clases={clases} cupos={cupos} />} />
        <Route path="/mis-matriculas" element={<Protegida><section><h1>Mis matrículas</h1>{propias.length ? <div className="list-group">{propias.map(m => { const clase = clases.find(c => String(c.id) === String(m.claseId)); return <div className="list-group-item" key={m.id}><strong>{m.codigo}</strong> · {clase?.nombre || 'Clase eliminada'} · <BadgeEstado estado={m.estado} /></div>; })}</div> : <p>Aún no tienes matrículas.</p>}</section></Protegida>} />
        <Route path="/nueva-matricula" element={<Protegida><section><h1>Nueva matrícula</h1><FormularioMatricula key={ubicacion.search} clases={clases} matriculas={matriculas} usuario={usuario} claseInicial={new URLSearchParams(ubicacion.search).get('claseId')} onIntento={() => setMensaje('')} onGuardar={guardar} /></section></Protegida>} />
        <Route path="/login" element={usuario ? <Navigate to="/mis-matriculas" replace /> : <Login />} />
        <Route path="*" element={<section><h1>404</h1><p>Página no encontrada.</p><Link to="/">Ir al inicio</Link></section>} />
      </Routes>
    </main>
  </div>;
}
export default function App() { return <Proveedores><Contenido /></Proveedores>; }
