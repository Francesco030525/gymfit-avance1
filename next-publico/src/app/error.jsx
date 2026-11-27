'use client';
export default function ErrorPagina({ error, reset }) { return <div role="alert"><h1>No se pudieron cargar los datos</h1><p>{error.message}</p><button onClick={reset}>Reintentar</button></div>; }
