<template>
  <div class="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
    <button @click="$emit('close-full-image')"
      class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
      aria-label="Close full image">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="relative w-full h-full flex items-center justify-center">
      <img :src="bookCover" :alt="`${bookTitle} cover - full size`"
        class="w-auto h-[76vh] object-contain rounded-lg shadow-2xl cursor-pointer" @click="$emit('close-full-image')" />
    </div>
    <div class="text-white text-center opacity-80">
      <p class="text-sm">{{ bookTitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  bookCover: String,
  bookTitle: String,
});

defineEmits(['close-full-image']);
</script>