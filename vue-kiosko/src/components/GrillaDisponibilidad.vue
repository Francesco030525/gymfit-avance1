<script setup>
import CeldaHorario from './CeldaHorario.vue';
import { HORAS_KIOSKO } from '../core/estadisticas.js';
defineProps({ filas: { type: Array, required: true } });
const emit = defineEmits(['seleccionar']);
</script>
<template>
  <div class="tabla-scroll"><table><thead><tr><th scope="col">Clase / hora</th><th v-for="hora in HORAS_KIOSKO" :key="hora" scope="col">{{ hora }}</th></tr></thead>
    <tbody><tr v-for="fila in filas" :key="fila.clase.id"><th scope="row">{{ fila.clase.nombre }}<small>{{ fila.clase.sede }} · {{ fila.clase.horaInicio }}–{{ fila.clase.horaFin }}</small></th>
      <td v-for="celda in fila.celdas" :key="celda.hora"><CeldaHorario :celda="celda" :clase="fila.clase" @seleccionar="emit('seleccionar', $event)" /></td></tr></tbody></table>
    <p v-if="!filas.length">No hay clases para los filtros seleccionados.</p>
  </div>
</template>
