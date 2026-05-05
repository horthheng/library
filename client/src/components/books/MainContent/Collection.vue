<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <Header :trashedBooksCount="trashedBooks.length"
      :show-trash="showTrash"
      @view-trash="$emit('view-trash')"
      @add-by-form="$emit('add-by-form')"
      @add-by-import="$emit('add-by-import')"
      @back-to-books="$emit('back-to-books')"
      @restore-book="$emit('restore-book', $event)"
      @permanently-delete-book="$emit('permanently-delete-book', $event)"
      />

      <Filter :categories="categories" :languages="languages" @update:search="$emit('update:search', $event)"
        @update:category="$emit('update:category', $event)" @update:status="$emit('update:status', $event)"
        @update:language="$emit('update:language', $event)" />
  </div>
</template>

<script setup>
import Header from './Header.vue';
import Filter from './Filter.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  languages: {
    type: Array,
    default: () => []
  },
  trashedBooks: {
    type: Array,
    default: () => []
  },
  showTrash: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'view-trash',
  'add-by-form',
  'add-by-import',
  'back-to-books',
  'restore-book',
  'permanently-delete-book',
  'update:search',
  'update:category',
  'update:status',
  'update:language'
]);
</script>