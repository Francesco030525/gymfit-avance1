import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validarCorreo, validarCodigo, validarHora, validarFecha, validarCapacidad } from './validadores.js';
import { Usuario, Clase, Matricula } from './modelos.js';
import { contarMatriculasPorEstado, calcularOcupacionPorClase, obtenerSedesUnicas, obtenerRankingClases, crearGeneradorCodigoMatricula, construirGrillaDisponibilidad, HORAS_KIOSKO } from './estadisticas.js';

const clase = new Clase({ id: '1', nombre: 'Spinning', sede: 'Lima Centro', capacidad: 2, fecha: '2026-11-20', horaInicio: '08:00', horaFin: '09:00' });
const una = new Matricula({ id: '1', codigo: 'MAT-0001', claseId: '1', usuarioId: '3', estado: 'aprobada' });
const dos = new Matricula({ id: '2', codigo: 'MAT-0002', claseId: '1', usuarioId: '4' });

test('correo institucional y corporativo', () => { assert.equal(validarCorreo('a@utp.edu.pe'), true); assert.equal(validarCorreo('a@gymfit.pe'), true); assert.throws(() => validarCorreo('a@gmail.com')); });
test('códigos de estudiante y administrador', () => { assert.equal(validarCodigo('U90000003'), true); assert.equal(validarCodigo('A90000001'), true); assert.throws(() => validarCodigo('U123')); });
test('hora y fecha reales', () => { assert.equal(validarHora('23:59'), true); assert.equal(validarFecha('2026-11-20'), true); assert.throws(() => validarHora('25:00')); assert.throws(() => validarFecha('2026-02-30')); });
test('capacidad entre 1 y 60', () => { assert.equal(validarCapacidad(60), true); assert.throws(() => validarCapacidad(61)); });
test('Usuario expone su perfil', () => assert.match(new Usuario({ nombre: 'Estudiante Ficticio 01', codigo: 'U90000003' }).obtenerPerfil(), /Ficticio/));
test('Clase calcula cupos activos', () => assert.equal(clase.cuposDisponibles([una]), 1));
test('Matricula permite el último cupo', () => assert.equal(new Matricula({ claseId: '1', usuarioId: '4' }).validarCupo(clase, [una]), true));
test('Matricula bloquea exceso de cupo', () => assert.throws(() => new Matricula({ claseId: '1', usuarioId: '5' }).validarCupo(clase, [una, dos]), /cupos/));
test('Matricula bloquea duplicados', () => assert.throws(() => new Matricula({ claseId: '1', usuarioId: '3' }).validarCupo(clase, [una]), /matrícula activa/));
test('matrícula rechazada libera cupo', () => assert.equal(clase.cuposDisponibles([una, { ...dos, estado: 'rechazada' }]), 1));
test('reduce, Map, Set y ranking', () => { const lista = [una, dos, { ...dos, id: '3', claseId: '2', estado: 'rechazada' }]; assert.deepEqual(contarMatriculasPorEstado(lista), { aprobada: 1, pendiente: 1, rechazada: 1 }); assert.equal(calcularOcupacionPorClase(lista).get('1'), 2); assert.deepEqual(obtenerSedesUnicas([clase, { ...clase }]), ['Lima Centro']); assert.equal(obtenerRankingClases(lista, [clase, { ...clase, id: '2' }])[0].id, '1'); });
test('closure y padStart generan códigos consecutivos', () => { const siguiente = crearGeneradorCodigoMatricula(); assert.equal(siguiente(), 'MAT-0001'); assert.equal(siguiente(), 'MAT-0002'); });
test('grilla de clase por hora distingue horas sin sesión y cupos pendientes', () => {
  const grilla = construirGrillaDisponibilidad([clase], [una, { ...dos, estado: 'rechazada' }, { ...dos, id: '3' }], '2026-11-20');
  assert.equal(HORAS_KIOSKO.length, 15);
  assert.equal(grilla.length, 1);
  assert.equal(grilla[0].celdas[1].estado, 'ocupada');
  assert.equal(grilla[0].celdas[1].cupos, 0);
  assert.equal(grilla[0].celdas[2].estado, 'sin-clase');
});
test('grilla no cuenta rechazadas y distingue pendiente de ocupada', () => {
  const pendiente = construirGrillaDisponibilidad([{ ...clase, capacidad: 3 }], [una, dos], '2026-11-20')[0].celdas[1];
  const libre = construirGrillaDisponibilidad([clase], [{ ...una, estado: 'rechazada' }], '2026-11-20')[0].celdas[1];
  assert.equal(pendiente.estado, 'pendiente');
  assert.equal(pendiente.cupos, 1);
  assert.equal(libre.estado, 'libre');
  assert.equal(libre.cupos, 2);
});
