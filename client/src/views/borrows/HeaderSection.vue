<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Borrow Records</h1>
        <p class="text-gray-600">Track, filter, and manage all book borrowing activities</p>
      </div>
      <div class="flex flex-wrap gap-4">
        <div class="relative flex-1 max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="localSearch"
            type="text"
            placeholder="Search book title or borrower name..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  search: String
})

const emit = defineEmits(["update:search"])

const localSearch = ref(props.search) // local ref bound to input

// Watch localSearch and emit when it changes
watch(localSearch, (newVal) => {
  emit("update:search", newVal)
})

// Optional: sync localSearch if parent prop changes
watch(
  () => props.search,
  (newVal) => {
    if (newVal !== localSearch.value) {
      localSearch.value = newVal
    }
  }
)
</script>
