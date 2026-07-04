<template>
  <div class="bg-white rounded-xl p-4 shadow-md self-start flex flex-col gap-3">

    <!-- NOM -->
    <div class="flex justify-between items-center">
      <h2 class="text-lg font-bold text-black">
        {{ connexion.name }}
      </h2>

      <!-- STATUS -->
      <span class="text-xs px-2 py-1 rounded"
        :class="connexion.time === 0 ? 'bg-red-600 text-white' : connexion.isRunning ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'">
        {{ connexion.time === 0 ? 'Terminer' : connexion.isRunning && connexion.time > 0 ? 'En cours' : 'Pause' }}
      </span>
    </div>

    <!-- TEMPS -->
    <div class="text-2xl font-mono text-center" :class="connexion.time === 0 ? 'text-red-500' : 'text-black'">
      {{ formatTime(connexion.time) }}
    </div>

    <!-- ACTIONS -->
    <div class="flex flex-wrap gap-2 justify-center">

      <button @click="$emit('onStart', index)" class="bg-green-500 text-white px-2 py-1 rounded" title="Démarrer la session">
        ▶
      </button>

      <button @click="$emit('onPause', index)" class="bg-yellow-500 text-white px-2 py-1 rounded" title="Mettre en pause">
        ⏸
      </button>

      <button @click="$emit('onPlusTime', index)" class="bg-blue-500 text-white px-2 py-1 rounded" title="Ajouter du temps">
        + Temps
      </button>

      <button @click="$emit('onEdit', index)" class="bg-purple-500 text-white px-2 py-1 rounded" title="Modifier les infos">
        ✏
      </button>

      <button @click="$emit('onDelete', index)" class="bg-red-500 text-white px-2 py-1 rounded" title="Supprimer ce client">
        🗑
      </button>

      <button v-if="connexion.time <= 0" @click="retirerAnnonce(connexion.name)"
        class="bg-red-500 text-white px-2 py-1 rounded" title="Stoper l'annonce">
        🔊 Stop annonce
      </button>

    </div>
  </div>
</template>
<script setup lang="ts">
import type { Connextion } from '../App.vue';
import { formatTime, retirerAnnonce } from '../fonction.ts';

const props = defineProps<{ connexion: Connextion , index : number}>();
const emits = defineEmits<{
  (e: 'onStart', index: number): void,
  (e: 'onPause', index: number): void,
  (e: 'onPlusTime', index: number): void,
  (e: 'onEdit', index: number): void,
  (e: 'onDelete', index: number): void,
}>();

</script>