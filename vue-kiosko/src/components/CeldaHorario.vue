<script setup>
defineProps({ celda: { type: Object, required: true }, clase: { type: Object, required: true } });
const emit = defineEmits(['seleccionar']);
</script>
<template>
  <button v-if="celda.programada" type="button" class="celda" :class="celda.estado"
    :title="`${clase.nombre}: ${celda.cupos} cupos disponibles`" @click="emit('seleccionar', clase)">
    {{ celda.estado }}<small>{{ celda.cupos }} cupos</small>
  </button>
  <span v-else class="celda sin-clase" aria-label="Sin clase">—</span>
</template>
