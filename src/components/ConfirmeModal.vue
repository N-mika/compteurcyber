<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('update:modelValue', false)"
      ></div>

      <!-- Box -->
      <div class="relative bg-white w-[90%] max-w-md rounded-xl shadow-lg p-5">

        <h2 class="text-lg font-semibold text-gray-800">
          {{ title }}
        </h2>

        <p class="text-gray-600 mt-2">
          {{ message }}
        </p>

        <div class="flex justify-end gap-2 mt-5">

          <button
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Non
          </button>

          <button
            @click="$emit('confirm')"
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Oui
          </button>

        </div>

      </div>

    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: "Confirmation"
  },
  message: {
    type: String,
    default: "Voulez-vous vraiment continuer ?"
  }
})

defineEmits(["update:modelValue", "confirm"])
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>