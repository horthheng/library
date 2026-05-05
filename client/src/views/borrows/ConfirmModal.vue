<!-- src/components/borrows/ConfirmModal.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m0-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">Confirm Return</h2>
      <p class="text-center text-gray-600 mb-8">
        Are you sure you want to mark this book as
        <span class="font-semibold text-green-600">Returned</span>?
      </p>
      <div class="flex justify-center gap-4">
        <button
          @click="$emit('confirm')"
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Yes, Return Book
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
defineEmits(["confirm", "close"]);
</script>