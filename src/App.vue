<template>
  <div class="h-screen flex relative flex-col gap-4 px-2.5">
    <div class="bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center">
      <h1 class="text-xl font-bold">Cyber Café Manager</h1>
      <div class="text-lg">
        Clients actifs :
        <span class="font-bold text-green-400">
          {{ activeClients }}
        </span>
      </div>
    </div>
    <input type="text" name="" id=""
      class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400  "
      v-model="search">
    <div
      class="grid grid-cols-1 max-h-[80vh] dashboard overflow-auto  px-4 py-2 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
      <Card v-for="(connexion, index) in allConnexionFiltred" :key="index" :connexion="connexion" :index="index"
        @onDelete="onDelete" @onEdit="onEdit" @onPause="onPause" @onPlusTime="onPlusTime" @onStart="onStart"/>
    </div>
    <div v-if="showAddTimeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div class="bg-white p-4 rounded flex flex-col gap-3 w-80">

        <h2 class="text-black text-lg font-bold">Ajouter du temps</h2>

        <input type="number" v-model="tempTime" placeholder="Durée" class="border p-2 text-black" />

        <select v-model="tempUnit" class="border p-2 text-black">
          <option value="minute">Minute</option>
          <option value="heure">Heure</option>
        </select>

        <div class="flex gap-2 justify-end">
          <button @click="closeAddTimeModal" class="px-3 py-1 bg-gray-400">
            Annuler
          </button>

          <button @click="confirmAddTime" class="px-3 py-1 bg-blue-500 text-white">
            Ajouter
          </button>
        </div>

      </div>

    </div>
    <div class=" absolute right-2 bottom-2 flex gap-2">
      <button @click="onShowModale('add')"
        class="px-5 font-bold rounded-xl py-2.5 bg-primary text-white">Ajouter</button>
      <button @click="arreterAnnonce" class="px-5 py-2.5 font-bold bg-red-600 text-white rounded-xl">
        🔊 Stop annonce
      </button>
    </div>
    <Forme :showModale="showModale" @close="onClose" :modelValue="connextion" :unit="unit" :mode="modeModale"
      @submit="(data) => modeModale === 'add' ? onAdd(data) : onUpdate(data)" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Forme, { type FormPayload } from './components/Forme.vue';
import { ajouterAnnonce, arreterAnnonce } from './fonction.ts';
import Card from './components/Card.vue';

export type Connextion = {
  name: string,
  time: number,
  isRunning: boolean
}

const search = ref<string>('');

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // enlève les accents

const allConnexionFiltred = computed(() => {
  const query = normalize(search.value.trim());

  if (!query) return allConnexion.value;

  return allConnexion.value.filter(({ name }) =>
    normalize(name).includes(query)
  );
});
const showAddTimeModal = ref(false);
const selectedIndex = ref<number | null>(null);
const showModale = ref<boolean>(false);
const modeModale = ref<"add" | "edit">('add');

const unit = ref<'minute' | 'heure'>('minute');
const tempTime = ref(0);
const tempUnit = ref<'minute' | 'heure'>('minute');
const editIndex = ref<number | null>(null);
const allConnexion = ref<Connextion[]>([]);
const connextion = ref({ name: '', time: 0 });

const onAdd = (data: FormPayload) => {
  let seconds = data.unit === 'minute'
    ? data.time * 60
    : data.time * 3600;

  allConnexion.value.push({
    name: data.name,
    time: seconds,
    isRunning: false
  });

  showModale.value = false;
  resetForm()
};

const onUpdate = (data: FormPayload) => {
  if (editIndex.value === null) return;

  let seconds = data.unit === 'minute'
    ? data.time * 60
    : data.time * 3600;

  allConnexion.value[editIndex.value] = {
    ...allConnexion.value[editIndex.value],
    name: data.name,
    time: seconds
  };

  showModale.value = false;
};

const onEdit = (index: number) => {
  editIndex.value = index;
  modeModale.value = 'edit';
  showModale.value = true;

  connextion.value = {
    name: allConnexion.value[index].name,
    time: Math.floor(allConnexion.value[index].time / 60)
  };

  unit.value = 'minute';
};

const onShowModale = (mode: "add" | "edit") => {
  modeModale.value = mode;
  showModale.value = !showModale.value
}
const onPlusTime = (index: number) => {
  selectedIndex.value = index;
  showAddTimeModal.value = true;

  tempTime.value = 0;
  tempUnit.value = 'minute';
};
const confirmAddTime = () => {
  if (selectedIndex.value === null) return;

  let seconds = tempUnit.value === 'minute'
    ? tempTime.value * 60
    : tempTime.value * 3600;

  allConnexion.value[selectedIndex.value].time += seconds;

  closeAddTimeModal();
};
const closeAddTimeModal = () => {
  showAddTimeModal.value = false;
  selectedIndex.value = null;
  tempTime.value = 0;
};

const onPause = (index: number) => {
  allConnexion.value[index].isRunning = false;
};

const onStart = (index: number) => {
  allConnexion.value[index].isRunning = true;
};

const onDelete = (index: number) => {
  allConnexion.value.splice(index, 1);
};

const onClose = () => {
  showModale.value = false
  resetForm()
}
// 🔥 TIMER (clean + safe)
let interval: number;

onMounted(() => {
  interval = window.setInterval(() => {
    allConnexion.value.forEach(c => {
      if (c.time > 0 && c.isRunning) {
        c.time--;
      }
      if (c.time === 0 && c.isRunning) {
        ajouterAnnonce(c.name);
        c.isRunning = false
      }
    });
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});

const resetForm = () => {
  connextion.value = { name: '', time: 0 };
};

const activeClients = computed(() => {
  return allConnexion.value.filter(c => c.time > 0).length;
});
</script>