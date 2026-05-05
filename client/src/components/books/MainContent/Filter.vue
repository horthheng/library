<template>
  <!-- Mobile layout -->
  <div class="block sm:hidden mb-2">
    <!-- First row: Search and Category -->
    <div class="flex items-center gap-2 mb-2">
      <!-- Search -->
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Search books, authors, ISBN..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" />
      </div>

      <!-- Category -->
      <div class="relative flex-1 min-w-32">
        <select v-model="selectedCategory"
          class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name.toLowerCase()">{{ cat.name }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Second row: Status and Language -->
    <div class="flex items-center gap-2">
      <!-- Status -->
      <div class="relative flex-1 min-w-28">
        <select v-model="selectedStatus" @change="handleStatusChange"
          class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
          <option value="all">All Books</option>
          <option value="new">New Books</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Language -->
      <div class="relative flex-1 min-w-28">
        <select v-model="selectedLanguage"
          class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
          <option value="">All Languages</option>
          <option v-for="lang in languages" :key="lang.id" :value="lang.name.toLowerCase()">{{ lang.name }}</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Updated Tablet layout (single row with all filters) -->
  <div class="hidden sm:flex lg:hidden items-center gap-3 mb-2">
    <!-- Search -->
    <div class="relative flex-1 min-w-[180px]">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input v-model="searchQuery" type="text" placeholder="Search books, authors, ISBN..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" />
    </div>

    <!-- Category -->
    <div class="relative min-w-[120px]">
      <select v-model="selectedCategory"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name.toLowerCase()">{{ cat.name }}</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Status -->
    <div class="relative min-w-[110px]">
      <select v-model="selectedStatus" @change="handleStatusChange"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
        <option value="all">All Books</option>
        <option value="new">New Books</option>
        <option value="available">Available</option>
        <option value="limited">Limited</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Language -->
    <div class="relative min-w-[120px]">
      <select v-model="selectedLanguage"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 w-full">
        <option value="">All Languages</option>
        <option v-for="lang in languages" :key="lang.id" :value="lang.name.toLowerCase()">{{ lang.name }}</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Desktop layout (unchanged) -->
  <div class="hidden lg:flex flex-wrap items-center gap-4 mb-2">
    <!-- Search -->
    <div class="relative flex-1 min-w-64">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input v-model="searchQuery" type="text" placeholder="Search books, authors, ISBN..."
        class="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" />
    </div>

    <!-- Category -->
    <div class="relative">
      <select v-model="selectedCategory"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 min-w-40">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name.toLowerCase()">{{ cat.name }}</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Status -->
    <div class="relative">
      <select v-model="selectedStatus" @change="handleStatusChange"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 min-w-36">
        <option value="all">All Books</option>
        <option value="new">New Books</option>
        <option value="available">Available</option>
        <option value="limited">Limited</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Language -->
    <div class="relative">
      <select v-model="selectedLanguage"
        class="appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 min-w-36">
        <option value="">All Languages</option>
        <option v-for="lang in languages" :key="lang.id" :value="lang.name.toLowerCase()">{{ lang.name }}</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  languages: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:search', 'update:category', 'update:status', 'update:language']);

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('all');
const selectedLanguage = ref('');

const handleStatusChange = () => {
  emit('update:status', selectedStatus.value);
};

watch(searchQuery, (newVal) => {
  emit('update:search', newVal);
});

watch(selectedCategory, (newVal) => {
  emit('update:category', newVal);
});

watch(selectedLanguage, (newVal) => {
  emit('update:language', newVal);
});
</script>

<style scoped>
/* Additional custom styles if needed */
</style>