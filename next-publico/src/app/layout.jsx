import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: { default: 'GymFit · Consulta pública', template: '%s | GymFit' },
  description: 'Consulta pública de clases y estados de matrícula de GymFit.'
};

export default function RootLayout({ children }) {
  return <html lang="es"><body><header><nav><Link href="/clases" className="marca">GymFit</Link><span>Consulta pública · Avance 4</span></nav></header><main>{children}</main><footer>Datos de demostración servidos por json-server</footer></body></html>;
}
