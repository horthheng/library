<template>
  <div class="bg-indigo-50 rounded-lg sm:rounded-2xl hover:shadow-md sm:hover:shadow-lg transition-all duration-300 border border-indigo-100 shadow-sm sm:shadow-md p-2 sm:p-6">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-lg sm:text-3xl font-bold text-indigo-700">{{ value }}</div>
        <div class="text-[8px] sm:text-sm text-indigo-500">{{ label }}</div>
      </div>
      <div class="text-indigo-500 bg-indigo-100 p-1 sm:p-3 rounded-full hidden sm:block">
        <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path :d="iconPath" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  iconPath: {
    type: String,
    required: true
  }
})
</script>