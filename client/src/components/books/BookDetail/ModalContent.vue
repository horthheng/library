<template>
  <div class="p-6 overflow-y-auto" style="flex-grow: 1;">
    <div class="flex flex-col md:flex-row gap-8"> <!-- changed lg:flex-row → md:flex-row -->
      <!-- Book Cover -->
      <div class="flex-shrink-0">
        <div class="relative group cursor-pointer" @click="$emit('open-full-image')" title="Click to view full image">
          <img :src="bookCover" :alt="`${bookTitle} cover`"
            class="w-64 md:w-72 lg:w-80 h-auto rounded-xl object-cover shadow-lg border border-gray-200 transition-transform duration-300 group-hover:scale-105" />
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300 flex items-center justify-center">
            <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Book Information -->
      <div class="flex-1 space-y-6 over-flow">
        <!-- Title and Description -->
        <div class="space-y-3 w-full max-w-full">
          <h3 class="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{{ bookTitle }}</h3>
          <p class="text-gray-600 text-lg md:text-base leading-relaxed break-all
         md:max-h-32 md:overflow-y-auto md:pr-2 no-scrollbar">
            {{ bookDescription }}
          </p>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{{ categoryName }}</span>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{{ languageName }}</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{{ selectedBook.public_year ||
            'N/A' }}</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{{ selectedBook.quantity || 0
          }}</span>
        </div>

        <!-- Book Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Author</span>
              <p class="text-gray-900 font-medium text-base">{{ authorName }}</p>
            </div>
            <div>
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">ISBN</span>
              <p class="text-gray-900 font-mono">{{ selectedBook.isbn || 'N/A' }}</p>
            </div>
            <div v-if="selectedBook.donated_by">
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">From</span>
              <p class="text-gray-900 font-medium text-base">{{ selectedBook.donated_by }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nationality</span>
              <p class="text-gray-900 font-medium text-base">{{ authorNationality }}</p>
            </div>
            <div>
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Publication Year</span>
              <p class="text-gray-900 font-medium text-base">{{ selectedBook.public_year || 'N/A' }}</p>
            </div>
            <div>
              <span class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Language</span>
              <p class="text-gray-900 font-medium text-base">{{ languageName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  selectedBook: Object,
  bookCover: String,
  bookTitle: String,
  bookDescription: String,
  categoryName: String,
  languageName: String,
  authorName: String,
  authorBiography: String,
  authorNationality: String,
  formattedBirthDate: String,
});

defineEmits(['open-full-image']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}

.no-scrollbar {
  -ms-overflow-style: none;
  /* IE/Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>