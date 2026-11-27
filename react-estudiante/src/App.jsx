import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Clase } from './core/modelos.js';
import { Proveedores, useAuth, useTheme } from './contextos.jsx';
import Navbar from './componentes/Navbar.jsx';
import FormularioMatricula from './componentes/FormularioMatricula.jsx';
import Catalogo from './paginas/Catalogo.jsx';
import Detalle from './paginas/Detalle.jsx';
import Login from './paginas/Login.jsx';
import MisMatriculas from './paginas/MisMatriculas.jsx';
import { obtenerClases } from './servicios/clienteFetch.js';
import { useReservas } from './hooks/useReservas.js';

function Protegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function Contenido() {
  const [clases, setClases] = useState([]);
  const [cargandoClases, setCargandoClases] = useState(true);
  const [errorClases, setErrorClases] = useState('');
  const [ahora, setAhora] = useState(Date.now());
  const [mensaje, setMensaje] = useState('');
  const { usuario } = useAuth();
  const { oscuro } = useTheme();
  const ubicacion = useLocation();
  const { datos, todas, cargando, error, crear, cancelar, actualizar } = useReservas(usuario?.id);
  const cupos = clase => todas ? new Clase(clase).cuposDisponibles(todas) : null;
  const proxima = datos.filter(m => m.estado !== 'rechazada').map(m => clases.find(c => String(c.id) === String(m.claseId)))
    .filter(Boolean).map(c => ({ clase: c, tiempo: new Date(c.fecha + 'T' + c.horaInicio + ':00').getTime() }))
    .filter(x => x.tiempo > ahora).sort((a, b) => a.tiempo - b.tiempo)[0];
  const resta = proxima ? Math.max(0, Math.floor((proxima.tiempo - ahora) / 1000)) : 0;
  const cuenta = Math.floor(resta / 86400) + 'd ' + Math.floor(resta % 86400 / 3600) + 'h ' + Math.floor(resta % 3600 / 60) + 'm ' + resta % 60 + 's';

  const cargarClases = useCallback(async () => {
    setCargandoClases(true);
    setErrorClases('');
    try { setClases(await obtenerClases()); }
    catch (fallo) { setErrorClases(fallo.message); setClases([]); }
    finally { setCargandoClases(false); }
  }, []);

  useEffect(() => { cargarClases(); }, [cargarClases]);
  useEffect(() => {
    const titulo = ubicacion.pathname === '/' ? 'Inicio' : ubicacion.pathname.split('/')[1] || 'GymFit';
    document.title = 'GymFit | ' + titulo;
    setMensaje('');
  }, [ubicacion.pathname]);
  useEffect(() => {
    const intervalo = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(intervalo);
  }, []);

  async function guardar({ claseId }) {
    const clase = clases.find(c => String(c.id) === String(claseId));
    if (!clase) throw new Error('La clase ya no está disponible en el catálogo.');
    await crear(clase);
    setMensaje('Matrícula guardada en el API de GymFit.');
  }

  return <div data-bs-theme={oscuro ? 'dark' : 'light'} className="app-shell">
    <Navbar titulo="GymFit" />
    <main className="container py-4">
      {proxima && <p className="alert alert-info">Próxima clase: {proxima.clase.nombre} · faltan {cuenta}</p>}
      {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}
      <Routes>
        <Route path="/" element={<section><h1>Clases GymFit</h1><p>Explora el catálogo y matricúlate con datos del API compartido.</p><Link className="btn btn-primary" to="/catalogo">Ver clases</Link></section>} />
        <Route path="/catalogo" element={<Catalogo clases={clases} cargando={cargandoClases} error={errorClases} cupos={cupos} actualizar={cargarClases} />} />
        <Route path="/catalogo/:id" element={<Detalle cupos={cupos} />} />
        <Route path="/mis-matriculas" element={<Protegida><MisMatriculas matriculas={datos} clases={clases} cargando={cargando || cargandoClases} error={error || (errorClases && new Error(errorClases))} actualizar={actualizar} cancelar={cancelar} /></Protegida>} />
        <Route path="/nueva-matricula" element={<Protegida><section><h1>Nueva matrícula</h1>
          {cargandoClases ? <p role="status">Cargando clases...</p>
            : errorClases ? <p role="alert" className="alert alert-danger">{errorClases}</p>
              : clases.length === 0 ? <p>No hay clases disponibles en el API.</p>
                : !todas && error ? <div role="alert" className="alert alert-danger">{error.message} <button className="btn btn-sm btn-outline-danger" onClick={() => actualizar(true).catch(() => {})}>Reintentar</button></div>
                  : <FormularioMatricula key={ubicacion.search} clases={clases} matriculas={todas} usuario={usuario} claseInicial={new URLSearchParams(ubicacion.search).get('claseId')} cargando={cargando} onIntento={() => setMensaje('')} onGuardar={guardar} />}
        </section></Protegida>} />
        <Route path="/login" element={usuario ? <Navigate to="/mis-matriculas" replace /> : <Login />} />
        <Route path="*" element={<section><h1>404</h1><p>Página no encontrada.</p><Link to="/">Ir al inicio</Link></section>} />
      </Routes>
    </main>
  </div>;
}

export default function App() { return <Proveedores><Contenido /></Proveedores>; }
