<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            class="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">Confirm Delete</h2>
      <p class="text-center text-gray-600 mb-8">
        Are you sure you want to delete
        <span v-if="isAllRecords" class="font-semibold text-red-600"
          >all borrowing history</span
        >
        <span v-else class="font-semibold text-red-600">this borrowing record</span>? This
        action cannot be undone.
      </p>
      <div class="flex justify-center gap-4">
        <button
          @click="$emit('confirm')"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Yes, Delete
        </button>
        <button
          @click="$emit('close')"
          class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isAllRecords: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["confirm", "close"]);
</script>
