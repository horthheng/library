<template>
  <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
      <div class="flex items-center gap-2">
        <button @click="$emit('edit-book', selectedBook)"
          class="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 flex items-center justify-center group"
          aria-label="Edit book" :disabled="!selectedBook">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button @click="$emit('close-detail')"
          class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group"
          aria-label="Close details">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  selectedBook: Object,
});

defineEmits(['edit-book', 'close-detail']);
</script>