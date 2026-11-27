import { createContext, useContext, useState } from 'react';
import { validarCorreo } from './core/validadores.js';
import { buscarUsuarios } from './servicios/clienteFetch.js';

const CLAVE_SESION = 'gymfit-sesion-demo';

export const AuthContext = createContext(null);
export const ThemeContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export function Proveedores({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null'); }
    catch { return null; }
  });
  const [oscuro, setOscuro] = useState(false);
  async function login(correo, password) {
    const normalizado = correo.trim().toLowerCase();
    validarCorreo(normalizado);
    const usuarios = await buscarUsuarios(normalizado);
    const encontrado = usuarios?.find(u => u.correo.toLowerCase() === normalizado && u.password === password && u.rol === 'estudiante');
    if (!encontrado) throw new Error('Correo o contraseña incorrectos.');
    const { password: _password, ...perfil } = encontrado;
    localStorage.setItem(CLAVE_SESION, JSON.stringify(perfil));
    setUsuario(perfil);
  }
  function logout() {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }
  return <AuthContext.Provider value={{ usuario, login, logout }}>
    <ThemeContext.Provider value={{ oscuro, alternar: () => setOscuro(v => !v) }}>{children}</ThemeContext.Provider>
  </AuthContext.Provider>;
}
