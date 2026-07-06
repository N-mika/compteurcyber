<template>
  <div class="h-screen flex relative flex-col gap-4">
    <!-- Header -->
    <div class="bg-primary text-white p-4 rounded-tl-lg rounded-tr-lg flex justify-between items-center">
      <h1 class="text-xl font-bold">Cyber WaZaux Manager</h1>
      <div class="text-lg">
        Clients actifs :
        <span class="font-bold text-green-400">
          {{ activeClients }}
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-4 px-4 flex-1">
      <!-- Controle -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-800 items-end">

        <!-- SEARCH -->
        <div class="flex gap-2 items-center w-full">
          <label class="whitespace-nowrap">Rechercher :</label>

          <input type="text" v-model="search" placeholder="Rechercher un client..."
            class="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <!-- PRICE -->
        <div class="flex gap-2 items-center w-full">
          <label class="whitespace-nowrap">Prix/min :</label>

          <input type="number" v-model="price" placeholder="Prix par minute"
            class="w-full md:w-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <!-- ACTIONS -->
        <div class="flex flex-wrap gap-2 md:justify-end lg:justify-end w-full">

          <button @click="onShowModaleConfirmeModal()"
            class="flex items-center gap-2 px-4 py-2 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            <Trash2 />
            <span class="hidden sm:inline">Tous effacer</span>
          </button>

          <button @click="arreterAnnonce"
            class="flex items-center gap-2 px-4 py-2 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
            <VolumeX />
            <span class="hidden sm:inline">Arrêter</span>
          </button>

          <button @click="onShowModale('add')"
            class="flex items-center gap-2 px-4 py-2 font-bold bg-primary text-white rounded-xl hover:bg-primary/80 transition">
            <PlusCircle />
            <span class="hidden sm:inline">Ajouter</span>
          </button>

        </div>

      </div>
      <div
        class="grid grid-cols-1 h-[65vh] md:h-[80vh] dashboard overflow-auto  px-4 py-2 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
        <Card v-for="(connexion, index) in allConnexionFiltred" :key="index" :price="price" :connexion="connexion"
          :index="index" @onDelete="onDelete" @onEdit="onEdit" @onPause="onPause" @onPlusTime="onPlusTime"
          @onStart="onStart" />
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
      <Forme :showModale="showModale" @close="onClose" :modelValue="connextion" :unit="unit" :mode="modeModale"
        @submit="(data) => modeModale === 'add' ? onAdd(data) : onUpdate(data)" />
      <ConfirmeModal v-model="showDeleteDialog" title="Suppression"
        message="Voulez-vous vraiment supprimer tous les clients ? Cette action est irréversible."
        @confirm="onDeleteAll" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Forme, { type FormPayload } from './components/Forme.vue';
import { ajouterAnnonce, arreterAnnonce } from './fonction.ts';
import Card from './components/Card.vue';
import { PlusCircle, Trash2, VolumeX } from '@lucide/vue';
import ConfirmeModal from './components/ConfirmeModal.vue';

export type Connextion = {
  name: string,
  time: number, // s
  isRunning: boolean,
  totalTime: number,
  // price: number
}
const showAddTimeModal = ref(false);
const selectedIndex = ref<number | null>(null);
const showModale = ref<boolean>(false);
const modeModale = ref<"add" | "edit">('add');

const unit = ref<'minute' | 'heure'>('minute');
const tempTime = ref(0);
const tempUnit = ref<'minute' | 'heure'>('minute');
const editIndex = ref<number | null>(null);
const allConnexion = ref<Connextion[]>([]);
const connextion = ref<Connextion>({ name: '', time: 0, isRunning: false, totalTime: 0 });
const price = ref<number>(0);
const search = ref<string>('');
const showDeleteDialog = ref<boolean>(false);

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // enlève les accents
allConnexion.value = [
  // { isRunning: false, name: "Mika", time: 60, totalTime: 60 },
]
const allConnexionFiltred = computed(() => {
  const query = normalize(search.value.trim());

  if (!query) return allConnexion.value;

  return allConnexion.value.filter(({ name }) =>
    normalize(name).includes(query)
  );
});

const onAdd = (data: FormPayload) => {
  let seconds = data.unit === 'minute'
    ? data.time * 60
    : data.time * 3600;

  allConnexion.value.push({
    name: data.name,
    time: seconds,
    isRunning: false,
    totalTime: seconds,
    // price: data.time * price.value
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
    time: seconds,
    totalTime: seconds,
    // price: allConnexion.value[editIndex.value].price + (seconds / 60) * price.value
  };

  showModale.value = false;
};

const onEdit = (index: number) => {
  editIndex.value = index;
  modeModale.value = 'edit';
  showModale.value = true;

  connextion.value = {
    ...allConnexion.value[index],
    name: allConnexion.value[index].name,
    totalTime: allConnexion.value[index].totalTime + allConnexion.value[index].time,
    time: Math.floor(allConnexion.value[index].time / 60),
    // price: allConnexion.value[index].price + (allConnexion.value[index].time / 60) * price.value
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
  allConnexion.value[selectedIndex.value].totalTime += seconds;
  // allConnexion.value[selectedIndex.value].price += (seconds / 60) * price.value;
  closeAddTimeModal();
};
const closeAddTimeModal = () => {
  showAddTimeModal.value = false;
  selectedIndex.value = null;
  tempTime.value = 0;
};
const onShowModaleConfirmeModal = () => {
  showDeleteDialog.value = true
}
const onDeleteAll = () => {
  allConnexion.value = []
  showDeleteDialog.value = false
}
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
  connextion.value = { name: '', time: 0, isRunning: false, totalTime: 0 };
};

const activeClients = computed(() => {
  return allConnexion.value.filter(c => c.time > 0).length;
});
</script>