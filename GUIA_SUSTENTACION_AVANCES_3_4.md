# Guía de sustentación: GymFit, avances 3 y 4

## Preparación en Windows (antes del tiempo de exposición)

Abrir cinco terminales PowerShell en la raíz del repositorio. Ejecutar cada bloque en una terminal distinta y esperar que el API esté listo antes de abrir los portales:

```powershell
cd .\api-mock; npm install; npm run api
```

```powershell
cd .\angular-admin; npm install; npm start
```

```powershell
cd .\react-estudiante; npm install; npm run dev
```

```powershell
cd .\vue-kiosko; npm install; npm run dev
```

```powershell
cd .\next-publico; npm install; npm run dev
```

En una sexta terminal: `cd .\core-js; npm test`. Abrir `http://localhost:3000/clases`, `http://localhost:4200`, `http://localhost:5173`, `http://localhost:5174` y `http://localhost:3001/clases`. Usar Node 20.19+ (recomendado 22 o 24). El `json-server` de demostración escribe en `api-mock/db.json`, así que conservar una copia de los datos iniciales si se va a ejecutar una demostración con cambios.

## Avance 3: demostración en unos cinco minutos

1. Mostrar `/clases` del API. En React, abrir **Catálogo** y una tarjeta: el listado y detalle se obtienen con Fetch. Mostrar `react-estudiante/src/servicios/clienteFetch.js` y la comprobación `response.ok`.
2. Ir a **Login**. Usar `demo+gymfit-u90000003@gymfit.pe` y `solo-demo-2026`. Recargar y mostrar que la sesión continúa. Abrir `react-estudiante/src/contextos.jsx`; señalar GET `/usuarios?correo=`, `AuthContext` y `localStorage` sin contraseña.
3. Ir a **Nueva matrícula**. Escribir el código del usuario mostrado en el perfil o en `/usuarios?correo=...`, elegir una clase disponible donde ese estudiante aún no tenga matrícula y pulsar **Guardar matrícula**. Comprobar POST en `/matriculas`, el nuevo código MAT y que aparece en **Mis matrículas**. El formulario se limpia y enfoca el primer campo. Mostrar `react-estudiante/src/hooks/useReservas.js` y `react-estudiante/src/servicios/clienteAxios.js`.
4. En Angular, abrir **Matrículas**, localizar el código creado y pulsar **Aprobar** o **Rechazar**. Volver a React, pulsar **Actualizar** y mostrar el estado nuevo y el resumen. Mostrar `angular-admin/src/app/lista-matriculas.component.ts`, `gymfit.service.ts`, `react-estudiante/src/servicios/clienteAlova.js` y `ResumenMatriculas.jsx`.
5. En React, pulsar **Cancelar** sobre esa matrícula y comprobar que desaparece del API. Explicar que `useReservas` vuelve a consultar tras POST y DELETE. Mostrar un intento de duplicado, mantenimiento o clase sin cupos y explicar que la validación vive en el frontend y `core-js`; `json-server` no es un backend transaccional.

**Si la clase elegida ya está llena o ya tiene matrícula para ese estudiante:** elegir otra clase y verificar su cupo en el catálogo. Los datos iniciales tienen 8 clases y 20 matrículas. Las fechas de la semilla son del 20 al 23 de noviembre de 2026; para demostrar el contador regresivo, crear antes una clase futura desde Angular.

## Avance 4: demostración en unos cinco minutos

1. Abrir Vue en `http://localhost:5174`. Elegir fecha y sede, señalar la matriz clase × hora de 07:00 a 22:00 y pulsar una celda para mostrar el detalle. Mostrar `vue-kiosko/src/components/GrillaDisponibilidad.vue`, `CeldaHorario.vue` y `core-js/estadisticas.js`.
2. Explicar estados: `rechazada` no consume cupo; `aprobada` y `pendiente` sí. La celda está **ocupada** si no queda cupo o hay mantenimiento; **pendiente** si queda cupo y hay alguna matrícula pendiente; **libre** si queda cupo y no hay pendientes. Mostrar en `vue-kiosko/src/App.vue` los filtros, `onMounted`, `setInterval(..., 30_000)` y `onUnmounted(clearInterval)`.
3. Abrir Next.js en `http://localhost:3001/clases`, luego `/clases/1` y `/matricula/MAT-0001`. Probar un código inexistente para ver la página 404. Mostrar instructor, capacidad, cupos, estado y conteo agregado, sin datos personales.
4. Usar **Ver código fuente de la página** en `/clases/1` y buscar el nombre de la clase: aparece en el HTML inicial. Mostrar `next-publico/src/lib/api.js` (`cache: 'no-store'`), `next-publico/src/app/clases/[id]/page.jsx`, `next-publico/src/app/matricula/[codigo]/page.jsx` y los `generateMetadata`. En el resultado de `npm run build`, las tres rutas de datos aparecen con `ƒ`, renderizadas por solicitud.
5. Mostrar la tabla comparativa del README: Angular administra, React permite matricularse, Vue muestra disponibilidad y Next.js publica consultas SSR. Todas las consultas usan `http://localhost:3000`.

## Preguntas probables del profesor

- **¿Por qué tres librerías HTTP?** Fetch enseña la API nativa y la comprobación manual de `response.ok`; Axios centraliza `baseURL` e interceptor de errores y hace POST/DELETE; Alova aporta `useRequest`, caché y actualización del resumen.
- **¿Qué devuelve `useReservas(usuarioId)`?** `datos`, `cargando`, `error`, `crear`, `cancelar`; también expone `todas` y `actualizar` para cupos y refresco manual.
- **¿Cómo se evita superar el cupo?** `Matricula.validarCupo` usa las matrículas activas de la clase y bloquea duplicados y mantenimiento. Antes del POST se vuelve a consultar el API. Al ser `json-server`, dos solicitudes simultáneas aún podrían exceder el cupo; esa garantía corresponde al servidor del Avance 5.
- **¿Por qué una aprobación no ocupa automáticamente toda la celda Vue?** La capacidad puede ser mayor que uno. La grilla compara matrículas activas con capacidad y muestra el estado pendiente cuando procede.
- **¿Dónde está el SSR real?** En los componentes de servidor de Next.js que hacen `fetch` con `cache: 'no-store'`; el nombre de la clase y metadatos están en el HTML inicial.
- **¿Hay autenticación real?** No. El login es simulado con datos ficticios de `json-server`; JWT y protección del servidor pertenecen al Avance 5.

## Pruebas rápidas

```powershell
cd .\core-js; npm test
cd ..\angular-admin; npm run build
cd ..\react-estudiante; npm run build
cd ..\vue-kiosko; npm run build
cd ..\next-publico; npm run build
```

Las pruebas REST de POST, PATCH y DELETE deben ejecutarse sobre una **copia temporal** de `api-mock/db.json` para no cambiar los datos iniciales del grupo. El frontend de demostración compartido sí escribe en `api-mock/db.json` mientras `json-server` esté en marcha.
