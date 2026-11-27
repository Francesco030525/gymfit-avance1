# GymFit — JavaScript Avanzado

Sistema 6 del proyecto integral: **clases** como catálogo y **matrículas** como transacciones. La regla del dominio es un máximo de matrículas activas por clase; las rechazadas liberan cupo. Este repositorio contiene los avances 1 a 4. Todos los portales consultan el API simulado de `api-mock` en `http://localhost:3000`.

## Integrantes

- Edilson Francesco Magallanes Morales
- Diogo Capcha Huamán
- Luis Rodrigo Tenorio Gómez
- Isabel Cruz Campos
- Dominick Joshiro Ramirez Calixto 


## Avances incluidos

- **Avance 1:** lógica y 12 pruebas originales en `core-js`, API de prueba con `json-server` en `api-mock` y panel administrativo en Angular.
- **Avance 2:** portal del estudiante en React con catálogo, rutas, Hooks y matrículas. Su versión histórica está conservada en la etiqueta `avance-2`.
- **Avance 3:** React consume el API mediante Fetch, Axios y Alova. Angular aprueba o rechaza matrículas con PATCH.
- **Avance 4:** kiosko Vue con grilla de disponibilidad y portal público Next.js con SSR.

## Estructura

| Carpeta | Función |
| --- | --- |
| `core-js` | Validadores, modelos, estadísticas y 14 pruebas con `node:test` (12 originales y 2 de grilla) |
| `api-mock` | Contrato REST, datos ficticios y colección Thunder Client |
| `angular-admin` | Panel Angular para administrar el catálogo y aprobar o rechazar matrículas |
| `react-estudiante` | Portal React REST para consulta, matrícula y cancelación |
| `vue-kiosko` | Grilla Vue de clase × hora con actualización cada 30 segundos |
| `next-publico` | Consulta pública de clases y matrículas con SSR |
| `demo-web` | Prototipo HTML heredado del Avance 1; se conserva como referencia |

## Instalación y ejecución en Windows desde VS Code

Requisitos: Node.js **20.19 o superior** (recomendado 22 o 24) y npm. Abrir cinco terminales PowerShell, una por servicio. Cada bloque parte de la raíz del repositorio:

```powershell
cd .\core-js
npm test
```

```powershell
cd .\api-mock
npm install
npm run api
```

```powershell
cd .\angular-admin
npm install
npm start
```

```powershell
cd .\react-estudiante
npm install
npm run dev
```

```powershell
cd .\vue-kiosko
npm install
npm run dev
```

```powershell
cd .\next-publico
npm install
npm run dev
```

Abrir Angular en http://localhost:4200, React en http://localhost:5173, Vue en http://localhost:5174, Next.js en http://localhost:3001/clases y el API en http://localhost:3000/clases. Iniciar primero `api-mock`. Las matrículas creadas desde React persisten en `api-mock/db.json` mientras se ejecuta `json-server`; su archivo inicial se debe respaldar si se desea volver a los datos de demostración. La copia histórica `react-estudiante/src/data/db.json` ya no se importa en ejecución. React y Vue ejecutan `sync-core` antes de `dev` y `build` para copiar los módulos compartidos desde `core-js`.

Inicio de sesión simulado del estudiante: `demo+gymfit-u90000003@gymfit.pe` / `solo-demo-2026`. Son datos ficticios exclusivos de demostración; el perfil sin contraseña se guarda en `localStorage`. No hay autenticación real ni JWT.

## Contrato y datos

Recursos: `/usuarios`, `/clases` y `/matriculas`. IDs en cadena; estados de clase `disponible | mantenimiento`; estados de matrícula `pendiente | aprobada | rechazada`. `db.json` contiene 2 administradores, 6 estudiantes, 8 clases y 20 matrículas. La colección `api-mock/thunder-collection_gymfit.json` incluye GET, POST, PUT y DELETE para la sustentación. Las consultas con `?usuarioId=` usan el recurso `/matriculas`.

Angular usa GET/POST/PUT/DELETE de `/clases`, GET de `/matriculas` y PATCH de `/matriculas/:id` para aprobar o rechazar. React usa GET `/clases`, GET `/clases/:id`, GET `/usuarios?correo=`, GET `/matriculas?usuarioId=`, POST `/matriculas` y DELETE `/matriculas/:id`. Vue consulta GET `/clases` y `/matriculas`. Next.js consulta esos recursos para SSR y GET `/matriculas?codigo=` para la página pública. El formulario de Angular evita reducir la capacidad por debajo de las matrículas activas y la lista impide borrar una clase con matrículas. React impide matricularse en una clase llena, en mantenimiento o ya matriculada. **json-server no valida reglas de negocio al recibir peticiones directas ni ofrece protección ante solicitudes simultáneas**; esa validación en el servidor corresponde al backend Express del Avance 5.

## Avance 3: Fetch, Axios y Alova

| Librería | Uso real en GymFit | Características |
| --- | --- | --- |
| Fetch | `clienteFetch.js` obtiene catálogo, detalle y usuario de login | `async/await`, `response.ok`, errores de conexión y HTTP |
| Axios | `clienteAxios.js` consulta ocupación, crea y cancela matrículas | Instancia con `baseURL`, interceptor y errores entendibles |
| Alova | `clienteAlova.js` y `useReservas.js` consultan matrículas del estudiante | `useRequest`, caché GET de 5 segundos y actualización forzada |

`useReservas(usuarioId)` agrupa carga, error, listado, creación y cancelación. El resumen cuenta pendientes, aprobadas y rechazadas. Tras POST o DELETE, fuerza una nueva consulta. Después de PATCH en Angular, el botón **Actualizar** de React obtiene el nuevo estado. Las tres librerías usan el mismo contrato HTTP; la separación permite mostrar sus diferencias durante la sustentación.

## Avance 4: grilla y SSR

`core-js/estadisticas.js` construye la matriz **clase × hora** desde 07:00 hasta 22:00. Cada clase ocupa sus tramos horarios. Las matrículas `aprobada` y `pendiente` consumen cupo; `rechazada` no. Una celda programada está **ocupada** cuando no quedan cupos o la clase está en mantenimiento; está **pendiente** cuando aún hay cupos y al menos una matrícula pendiente; de lo contrario está **libre**. Las horas fuera de la clase aparecen como «sin clase». Vue permite filtrar por fecha y sede, y vuelve a consultar el API cada 30 segundos; libera el intervalo al desmontarse.

Next.js usa componentes de servidor y `fetch` con `cache: 'no-store'` en `/clases`, `/clases/[id]` y `/matricula/[codigo]`. El HTML inicial contiene los datos públicos, sin contraseñas ni nombres de estudiantes. El catálogo muestra instructor, capacidad y cupos; el detalle muestra conteos agregados de matrículas. Hay metadatos de título y descripción y una página 404.

| Framework | Curva de aprendizaje en este proyecto | Estado | Rutas | Renderizado y función |
| --- | --- | --- | --- | --- |
| Angular | Mayor configuración: servicios, tipos y plantillas | Servicio y componentes | Router Angular | Cliente; panel administrativo de clases y matrículas |
| React | Hooks y separación de tres clientes HTTP | Contextos y `useReservas` | React Router | Cliente; portal del estudiante |
| Vue | Plantillas y reactividad directas | `ref` y `computed` | Una pantalla, sin router | Cliente; kiosko de disponibilidad |
| Next.js | Convenciones de carpetas y límites servidor/cliente | Datos consultados por solicitud | App Router | Servidor; consulta pública e indexable |

## Demostración breve

1. Ejecutar `npm test` en `core-js` y mostrar los 14 casos (12 originales y 2 de grilla).
2. Levantar el API y abrir `/clases`; importar la colección Thunder Client.
3. En Angular, listar clases, abrir detalle, crear una clase, editarla y eliminar la clase de prueba. Mostrar el formulario reactivo, el estado de mantenimiento y la lista de matrículas.
4. En React, filtrar por sede y texto, abrir el detalle, comprobar la página 404, iniciar sesión y crear una matrícula. Mostrar que persiste en `/matriculas` y aparece en «Mis matrículas»; probar duplicado y clase llena.
5. Mostrar el contador de la próxima clase y alternar entre modo claro y oscuro.
6. En Angular, aprobar o rechazar la matrícula pendiente. En React, pulsar **Actualizar** y ver el nuevo estado; luego cancelarla y confirmar el DELETE.
7. En Vue, filtrar sede y fecha, abrir una celda y observar los estados. En Next.js, abrir `/clases`, `/clases/1` y `/matricula/MAT-0001`; inspeccionar el HTML servido para comprobar SSR.

La guía detallada de botones, archivos y preguntas para la sustentación está en `GUIA_SUSTENTACION_AVANCES_3_4.md`.

## Uso de IA

Se utilizó asistencia de IA para auditar el repositorio frente al PDF, adaptar el código del dominio GymFit, preparar datos de prueba, implementar Angular, React, Vue y Next.js, y redactar esta documentación. El grupo debe revisar y comprender cada línea antes de sustentar; cada integrante es responsable de explicar y modificar el código que presente.
