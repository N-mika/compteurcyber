<template>
  <!-- OVERLAY -->
  <div 
    v-if="showModale" 
    @click="$emit('close')" 
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >

    <!-- MODAL -->
    <form 
      @click.stop 
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-5 animate-scaleIn"
    >

      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">
          {{ mode === 'add' ? 'Ajouter un client' : 'Modifier client' }}
        </h2>

        <button 
          type="button" 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-red-500 text-lg"
        >
          ✕
        </button>
      </div>

      <!-- INPUT NOM -->
      <div class="flex flex-col gap-1">
        <label class="text-sm text-gray-600">Nom</label>
        <input 
          type="text" 
          placeholder="Nom du client"
          v-model="localData.name"
          class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
      </div>

      <!-- INPUT TEMPS -->
      <div class="flex flex-col gap-1">
        <label class="text-sm text-gray-600">Temps de connexion</label>
        <input 
          type="number" 
          placeholder="Durée"
          v-model="localData.time"
          class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
      </div>

      <!-- SELECT -->
      <div class="flex flex-col gap-1">
        <label class="text-sm text-gray-600">Unité</label>
        <select 
          v-model="localUnit" 
          class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="minute">Minute</option>
          <option value="heure">Heure</option>
        </select>
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-2 pt-2">

        <button 
          type="button" 
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Annuler
        </button>

        <button 
          class="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition"
        >
          {{ mode === 'add' ? 'Ajouter' : 'Modifier' }}
        </button>

      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: {
    name: string,
    time: number
  },
  unit: 'minute' | 'heure',
  mode: 'add' | 'edit',
  showModale: boolean
}>();
const localData = ref({ ...props.modelValue });
const localUnit = ref(props.unit);

export type FormPayload = {
  name: string;
  time: number;
  unit: 'minute' | 'heure';
};

type Emits = {
  submit: [payload: FormPayload];
  'update:modelValue': [value: { name: string; time: number }];
  'update:unit': [value: 'minute' | 'heure'];
  close: [];
};

const emit = defineEmits<Emits>();

// sync si props changent
watch(() => props.modelValue, (val) => {
  localData.value = { ...val };
});

watch(() => props.unit, (val) => {
  localUnit.value = val;
});

// submit
const onSubmit = () => {
  emit('submit', {
    ...localData.value,
    unit: localUnit.value
  });
};
</script>
