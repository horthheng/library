<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 cursor-pointer"
    @click="$emit('view-book', book)"
  >
    <div class="p-4">
      <div class="flex items-start gap-8">
        <Cover
          :book="book"
          @image-error="$emit('image-error')"
          @image-load="$emit('image-load')"
        />
        <Meta
          :book="book"
          :open-action-menu="openActionMenu"
          @toggle-action-menu="$emit('toggle-action-menu', $event)"
          @open-form="$emit('open-form', $event)"
          @confirm-delete="$emit('confirm-delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Cover from './Cover.vue';
import Meta from './Meta.vue';

defineProps({
  book: {
    type: Object,
    required: true,
  },
  openActionMenu: {
    type: [Number, String, null],
    default: null,
  },
});

defineEmits(['view-book', 'image-error', 'image-load', 'toggle-action-menu', 'open-form', 'confirm-delete']);
</script>

<style scoped>
/* Inherit Tailwind styles from parent */
</style>