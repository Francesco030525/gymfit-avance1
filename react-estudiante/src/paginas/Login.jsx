import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contextos.jsx';

export default function Login() {
  const { login } = useAuth();
  const navegar = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  async function enviar(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);
    try { await login(correo, password); navegar('/mis-matriculas'); }
    catch (fallo) { setError(fallo.message); }
    finally { setCargando(false); }
  }
  return <section><h1>Iniciar sesión</h1><p>Demo: demo+gymfit-u90000003@gymfit.pe / solo-demo-2026</p>
    <form onSubmit={enviar} className="card card-body col-md-6" noValidate>
      <label htmlFor="correo">Correo</label><input id="correo" className="form-control mb-3" value={correo} onChange={e => setCorreo(e.target.value)} />
      <label htmlFor="password">Contraseña</label><input id="password" type="password" className="form-control mb-3" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="text-danger">{error}</p>}
      <button className="btn btn-primary" disabled={cargando}>{cargando ? 'Entrando...' : 'Entrar'}</button>
    </form></section>;
}
