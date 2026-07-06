<template>
  <div class="bg-white rounded-xl p-4 shadow-md self-start flex justify-between gap-3">

    <!-- NOM -->
    <h2 :title="connexion.name" class="text-lg font-bold text-black">
      {{ formatName(connexion.name) }}
    </h2>


    <div class="flex flex-wrap justify-center gap-2 flex-col items-center">
      <h3 v-if="!connexion.isRunning && connexion.time === 0" class="flex flex-col items-center text-gray-600">
        <!-- <h3 v-if="!connexion.isRunning && connexion.time === 0"> -->
        <span class="text-sm">
          Total : {{ formatTime(connexion.totalTime) }}
        </span>
        <span class="text-lg font-bold">
          Prix : {{ (connexion.totalTime / 60 * price).toFixed(2) }} Ar
        </span>
      </h3>

      <!-- TEMPS -->
      <div class="text-lg font-mono text-center" :class="connexion.time === 0 ? 'text-red-500' : 'text-black'">
        Restan : {{ formatTime(connexion.time) }}
      </div>
      <!-- ACTIONS -->

      <div class="flex gap-3">
        <button @click="$emit('onStart', index)"
          class="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition" title="Démarrer la session">
          <Play :size="18" />
        </button>

        <button @click="$emit('onPause', index)"
          class="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition" title="Mettre en pause">
          <Pause :size="18" />
        </button>

        <button @click="$emit('onPlusTime', index)"
          class="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition" title="Ajouter du temps">
          <ClockPlus :size="18" />
        </button>

        <button @click="$emit('onEdit', index)"
          class="p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition" title="Modifier">
          <SquarePen :size="18" />
        </button>

        <button @click="$emit('onDelete', index)"
          class="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition" title="Supprimer">
          <Trash2 :size="18" />
        </button>

        <button v-if="connexion.time <= 0" @click="retirerAnnonce(connexion.name)"
          class="p-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition" title="Arrêter l'annonce">
          <VolumeX :size="18" />
        </button>
      </div>

    </div>
    <!-- STATUS -->
    <span class="text-xs px-2 py-1 rounded self-start"
      :class="connexion.time === 0 ? 'bg-red-600 text-white' : connexion.isRunning ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'">
      {{ connexion.time === 0 ? 'Terminer' : connexion.isRunning && connexion.time > 0 ? 'En cours' : 'Pause' }}
    </span>
  </div>
</template>
<script setup lang="ts">
import type { Connextion } from '../App.vue';
import { formatName, formatTime, retirerAnnonce } from '../fonction.ts';
import {
  Play,
  Pause,
  ClockPlus,
  SquarePen,
  Trash2,
  VolumeX
} from "@lucide/vue";

const props = defineProps<{ connexion: Connextion, index: number, price: number }>();
const emits = defineEmits<{
  (e: 'onStart', index: number): void,
  (e: 'onPause', index: number): void,
  (e: 'onPlusTime', index: number): void,
  (e: 'onEdit', index: number): void,
  (e: 'onDelete', index: number): void,
}>();

</script>