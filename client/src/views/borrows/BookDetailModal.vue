<!-- src/components/borrows/BookDetailModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Book Details</h2>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div class="bg-gray-50 p-8 flex items-center justify-center">
          <img
            v-if="book.book?.cover_image"
            :src="book.book.cover_image"
            alt="Book Cover"
            class="w-full max-w-xs h-96 object-cover rounded-xl shadow-lg"
          />
          <div
            v-else
            class="w-full max-w-xs h-96 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-xl"
          >
            No Cover Image
          </div>
        </div>
        <div class="p-8 space-y-6">
          <div>
            <h3 class="text-3xl font-bold text-blue-700 mb-2">{{ book.book?.title }}</h3>
            <p class="text-gray-600">Detailed borrowing information</p>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Author:</span>
              <span class="text-gray-900">{{ book.book?.author }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Category:</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ book.book?.category }}
              </span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Borrowed By:</span>
              <span class="text-blue-600 font-semibold">{{ book.user?.name }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Status:</span>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getItemStatus(book) === 'overdue' ? 'bg-red-100 text-red-800' : getItemStatus(book) === 'returned' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
                ]"
              >
                {{ getItemStatus(book) }}
              </span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Borrow Date:</span>
              <span class="text-gray-900">{{ formatDate(book.borrow_date) }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
              <span class="font-medium text-gray-600">Return Date:</span>
              <span class="text-gray-900">{{ formatDate(book.return_date) }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="font-medium text-gray-600">Days Left:</span>
              <span v-if="getItemStatus(book) === 'returned'" class="text-gray-500">-</span>
              <span v-else-if="getDaysLeft(book) < 0" class="text-red-600 font-semibold">
                {{ Math.abs(getDaysLeft(book)) }} days overdue
              </span>
              <span v-else class="text-green-600 font-semibold">{{ getDaysLeft(book) }} days left</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: Object,
  getItemStatus: Function,
  getDaysLeft: Function,
  formatDate: Function,
});

defineEmits(["close"]);
</script>