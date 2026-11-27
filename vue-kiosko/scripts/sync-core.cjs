const { copyFileSync, mkdirSync } = require('node:fs');
const { resolve } = require('node:path');
const destino = resolve(__dirname, '../src/core');
mkdirSync(destino, { recursive: true });
copyFileSync(resolve(__dirname, '../../core-js/estadisticas.js'), resolve(destino, 'estadisticas.js'));
