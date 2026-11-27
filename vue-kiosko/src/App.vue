<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';
import { construirGrillaDisponibilidad } from './core/estadisticas.js';

const API = 'http://localhost:3000';
const clases = ref([]), matriculas = ref([]), error = ref(''), cargando = ref(true);
const fecha = ref(''), sede = ref(''), seleccionada = ref(null), ultimaActualizacion = ref('');
let intervalo;

async function leer(recurso) {
  const respuesta = await fetch(`${API}/${recurso}`);
  if (!respuesta.ok) throw new Error(`El API respondió ${respuesta.status} al consultar ${recurso}.`);
  return respuesta.json();
}
async function actualizar() {
  try {
    const [nuevasClases, nuevasMatriculas] = await Promise.all([leer('clases'), leer('matriculas')]);
    clases.value = nuevasClases; matriculas.value = nuevasMatriculas;
    if (!fecha.value && nuevasClases.length) fecha.value = [...new Set(nuevasClases.map(c => c.fecha))].sort()[0];
    ultimaActualizacion.value = new Date().toLocaleTimeString('es-PE');
    error.value = '';
  } catch (fallo) { error.value = `No se pudo actualizar la disponibilidad: ${fallo.message}`; }
  finally { cargando.value = false; }
}
onMounted(() => { actualizar(); intervalo = setInterval(actualizar, 30_000); });
onUnmounted(() => clearInterval(intervalo));
const fechas = computed(() => [...new Set(clases.value.map(c => c.fecha))].sort());
const sedes = computed(() => [...new Set(clases.value.map(c => c.sede))].sort());
const filtradas = computed(() => clases.value.filter(c => !sede.value || c.sede === sede.value));
const grilla = computed(() => construirGrillaDisponibilidad(filtradas.value, matriculas.value, fecha.value));
</script>

<template>
  <main class="contenedor">
    <header><div><p class="eyebrow">GYMFIT · KIOSKO</p><h1>Disponibilidad de clases</h1><p>Actualización automática cada 30 segundos</p></div><strong>07:00–22:00</strong></header>
    <section class="controles" aria-label="Filtros de clases">
      <label>Fecha<select v-model="fecha"><option v-for="valor in fechas" :key="valor" :value="valor">{{ valor }}</option></select></label>
      <label>Sede<select v-model="sede"><option value="">Todas las sedes</option><option v-for="valor in sedes" :key="valor" :value="valor">{{ valor }}</option></select></label>
      <button type="button" @click="actualizar">Actualizar ahora</button>
      <span v-if="ultimaActualizacion">Última actualización: {{ ultimaActualizacion }}</span>
    </section>
    <p v-if="cargando" role="status">Cargando disponibilidad…</p>
    <p v-if="error" role="alert" class="alerta">{{ error }}</p>
    <GrillaDisponibilidad v-if="!cargando && !error" :filas="grilla" @seleccionar="seleccionada = $event" />
    <aside v-if="seleccionada" class="detalle"><button type="button" class="cerrar" @click="seleccionada = null" aria-label="Cerrar detalle">×</button><h2>{{ seleccionada.nombre }}</h2><p>{{ seleccionada.sede }} · {{ seleccionada.fecha }} · {{ seleccionada.horaInicio }}–{{ seleccionada.horaFin }}</p><p>Capacidad: {{ seleccionada.capacidad }} · Estado: {{ seleccionada.estado }}</p></aside>
    <footer>Libre: hay cupos · Pendiente: hay matrículas por aprobar · Ocupada: sin cupos o en mantenimiento</footer>
  </main>
</template>
