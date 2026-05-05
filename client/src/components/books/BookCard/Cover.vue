<template>
  <div class="flex-shrink-0">
    <div v-if="book.book_image_url || book.cover_image" class="w-20 h-auto shadow-md">
      <img
        :src="book.book_image_url || book.cover_image"
        :alt="book.title"
        :title="book.title"
        class="w-full h-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
        @error="$emit('image-error')"
        @load="$emit('image-load')"
      />
    </div>
    <div
      v-else
      class="w-16 h-20 rounded-lg shadow-md bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
    >
      <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
});

defineEmits(['image-error', 'image-load']);
</script>

<style scoped>
/* Inherit Tailwind styles from parent */
</style>