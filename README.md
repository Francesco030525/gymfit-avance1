# GymFit — JavaScript Avanzado

Sistema 6 del proyecto integral: **clases** como catálogo y **matrículas** como transacciones. La regla del dominio es un máximo de matrículas activas por clase; las rechazadas liberan cupo. Este repositorio contiene los avances 1 y 2. No incluye la integración REST de React de la semana 15 ni los módulos de semanas posteriores.

## Integrantes

- Edilson Francesco Magallanes Morales
- Diogo Capcha Huamán
- Luis Rodrigo Tenorio Gómez
- Isabel Cruz Campos
- Dominick Joshiro Ramirez Calixto 


## Avances incluidos

- **Avance 1:** lógica y 12 pruebas en `core-js`, API de prueba con `json-server` en `api-mock` y panel administrativo en Angular.
- **Avance 2:** portal del estudiante en React con catálogo, inicio de sesión simulado y matrículas locales. React usa una copia inicial de los datos de `api-mock`; no se conecta al API REST en este avance.

## Estructura

| Carpeta | Función |
| --- | --- |
| `core-js` | Validadores, modelos, estadísticas y 12 pruebas con `node:test` |
| `api-mock` | Contrato REST, datos ficticios y colección Thunder Client |
| `angular-admin` | Panel Angular para administrar el catálogo y consultar matrículas |
| `react-estudiante` | Portal React con datos locales e inicio de sesión simulado |
| `demo-web` | Prototipo HTML heredado del Avance 1; se conserva como referencia |

## Instalación y ejecución en Windows desde VS Code

Requisitos: Node.js LTS y npm. Abrir tres terminales PowerShell en la raíz del repositorio para los servicios; ejecutar las pruebas de `core-js` en una terminal adicional o antes de iniciarlos. Cada bloque parte de la raíz del repositorio:

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

Abrir http://localhost:4200 para Angular, http://localhost:5173 para React y http://localhost:3000/clases para comprobar el API. React importa `src/data/db.json`, copia de `api-mock/db.json`. Las matrículas nuevas viven en la memoria de la pestaña y se pierden al recargar. `npm run dev` y `npm run build` ejecutan automáticamente `npm run sync-core`, que copia tres módulos de `core-js` a `react-estudiante/src/core`.

Inicio de sesión simulado del estudiante: `demo+gymfit-u90000003@gymfit.pe` / `solo-demo-2026`. Son datos ficticios exclusivos de demostración; no existe autenticación real en estos avances.

## Contrato y datos

Recursos: `/usuarios`, `/clases` y `/matriculas`. IDs en cadena; estados de clase `disponible | mantenimiento`; estados de matrícula `pendiente | aprobada | rechazada`. `db.json` contiene 2 administradores, 6 estudiantes, 8 clases y 20 matrículas. La colección `api-mock/thunder-collection_gymfit.json` incluye GET, POST, PUT y DELETE para la sustentación. Las consultas con `?usuarioId=` usan el recurso `/matriculas`.

Angular usa GET/POST/PUT/DELETE de `/clases` y consulta `/matriculas` para mostrar ocupación. El formulario evita reducir la capacidad por debajo de las matrículas activas y la lista impide borrar una clase con matrículas. React impide matricularse en una clase llena, en mantenimiento o ya matriculada. **json-server no valida reglas de negocio al recibir peticiones directas**; esa validación en el servidor corresponde al backend Express del Avance 5.

## Demostración breve

1. Ejecutar `npm test` en `core-js` y mostrar los 12 casos.
2. Levantar el API y abrir `/clases`; importar la colección Thunder Client.
3. En Angular, listar clases, abrir detalle, crear una clase, editarla y eliminar la clase de prueba. Mostrar el formulario reactivo, el estado de mantenimiento y la lista de matrículas.
4. En React, filtrar por sede y texto, abrir el detalle, comprobar la página 404, iniciar sesión y crear una matrícula. Mostrar que aparece en «Mis matrículas» y que cambia el cupo. Probar un duplicado y una clase llena.
5. Mostrar el contador de la próxima clase y alternar entre modo claro y oscuro.

## Uso de IA

Se utilizó asistencia de IA para auditar el repositorio frente al PDF, adaptar el código del dominio GymFit, preparar datos de prueba, implementar Angular y React y redactar esta documentación. El grupo debe revisar y comprender cada línea antes de sustentar; cada integrante es responsable de explicar y modificar el código que presente.
