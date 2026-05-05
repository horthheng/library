<template>
  <div class="flex flex-row flex-nowrap items-center justify-between gap-2 sm:gap-3 mb-6">
    <div>
      <h2 class="text-base sm:text-xl font-semibold text-gray-800">Book Collection</h2>
      <p class="text-[10px] sm:text-sm text-gray-500 mt-1">Manage your library books</p>
    </div>

    <div class="flex flex-row flex-nowrap items-center gap-2 sm:gap-3">
      <div class="relative">
        <button @click="emitViewTrash"
          class="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-3 bg-gray-500 text-white rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-sm shadow-md hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative">
          Trash
          <span v-if="trashedBooksCount > 0"
            class="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-600 text-white text-[8px] sm:text-xs font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
            {{ trashedBooksCount }}
          </span>
        </button>
      </div>

      <div class="relative">
        <button @click="toggleDropdown"
          class="bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-3 transition-all duration-200 font-medium text-[10px] sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <svg class="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Book</span>
          <svg class="w-2.5 h-2.5 sm:w-4 sm:h-4 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div v-if="showDropdown"
          class="absolute right-0 mt-2 w-40 sm:w-56 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-xl z-50 overflow-hidden">
          <div class="py-1.5 sm:py-2">
            <button @click="handleAddByForm"
              class="w-full text-left px-2.5 sm:px-4 py-1.5 sm:py-3 text-gray-700 hover:bg-purple-50 transition-colors duration-150 flex items-center gap-1 sm:gap-3">
              <div class="w-5 h-5 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-2.5 h-2.5 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-[10px] sm:text-sm">By Form</div>
                <div class="text-[8px] sm:text-xs text-gray-500">Add book manually</div>
              </div>
            </button>
            <button @click="handleAddByImport"
              class="w-full text-left px-2.5 sm:px-4 py-1.5 sm:py-3 text-gray-700 hover:bg-purple-50 transition-colors duration-150 flex items-center gap-1 sm:gap-3">
              <div class="w-5 h-5 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-2.5 h-2.5 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-[10px] sm:text-sm">By Import</div>
                <div class="text-[8px] sm:text-xs text-gray-500">Import from file</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  trashedBooksCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['view-trash', 'add-by-form', 'add-by-import']);

const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const emitViewTrash = () => {
  emit('view-trash');
};

const handleAddByForm = () => {
  showDropdown.value = false;
  emit('add-by-form');
};

const handleAddByImport = () => {
  showDropdown.value = false;
  emit('add-by-import');
};
</script>