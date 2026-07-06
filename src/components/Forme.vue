<template>
  <!-- OVERLAY -->
  <div v-if="showModale" @click="$emit('close')"
    class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">

    <!-- MODAL -->
    <form @click.stop @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col animate-scaleIn">

      <!-- HEADER -->
      <div class="flex justify-between rounded-tl-lg rounded-tr-lg px-2 py-4 bg-primary text-white items-center">
        <h2 class="text-xl font-bold ">
          {{ mode === 'add' ? 'Ajouter un client' : 'Modifier client' }}
        </h2>

        <button type="button" @click="$emit('close')" class="scale-90 hover:scale-100 hover:animate-scaleIn text-lg">
          <X :size="22" />
        </button>
      </div>

      <div class="flex flex-col gap-4 p-4">
        <!-- INPUT NOM -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">Nom</label>
          <input type="text" placeholder="Nom du client" v-model="localData.name"
            class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
  
        <!-- INPUT TEMPS -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">Temps de connexion</label>
          <input type="number" placeholder="Durée" v-model="localData.time"
            class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
  
        <!-- SELECT -->
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600">Unité</label>
          <select v-model="localUnit"
            class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="minute">Minute</option>
            <option value="heure">Heure</option>
          </select>
        </div>
  
        <!-- ACTIONS -->
        <div class="flex justify-end gap-2 pt-2">
  
          <button type="button" @click="$emit('close')"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
            <X :size="18" />
            Annuler
          </button>
  
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/80 transition">
            <template v-if="mode === 'add'">
              <Plus :size="18" />
              Ajouter
            </template>
  
            <template v-else>
              <SquarePen :size="18" />
              Modifier
            </template>
          </button>
  
        </div>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { Plus, SquarePen, X } from '@lucide/vue';
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
