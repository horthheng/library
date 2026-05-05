<template>
  <div class="relative top-[90px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-4xl max-h-[80vh] overflow-y-auto no-scrollbar">
    <ModalHeader @edit-book="handleEditBook" @close-detail="handleCloseDetail" :selected-book="selectedBook" />
    <ModalContent v-if="selectedBook" :selected-book="selectedBook" :book-cover="bookCover" :book-title="bookTitle" :book-description="bookDescription" :category-name="categoryName" :language-name="languageName" :author-name="authorName" :author-biography="authorBiography" :author-nationality="authorNationality" :formatted-birth-date="formattedBirthDate" @open-full-image="openFullImage" />
    <LoadingState v-else />
    <FullImageModal v-if="showFullImage" :book-cover="bookCover" :book-title="bookTitle" @close-full-image="closeFullImage" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ModalHeader from './ModalHeader.vue';
import ModalContent from './ModalContent.vue';
import LoadingState from './LoadingState.vue';
import FullImageModal from './FullImageModal.vue';

defineProps({
  selectedBook: Object,
  bookCover: String,
  bookTitle: String,
  bookDescription: String,
  categoryName: String,
  languageName: String,
  authorName: String,
  authorBiography: String,
  authorNationality: String,
  formattedBirthDate: String,
  showFullImage: Boolean,
});

const emit = defineEmits(['edit-book', 'close-detail', 'open-full-image', 'close-full-image']);

const handleEditBook = (book) => {
  console.log('BookDetail: Emitting edit-book with book:', book);
  emit('edit-book', book);
};

const handleCloseDetail = () => {
  console.log('BookDetail: Emitting close-detail');
  emit('close-detail');
};

const openFullImage = () => {
  console.log('BookDetail: Emitting open-full-image');
  emit('open-full-image');
};

const closeFullImage = () => {
  console.log('BookDetail: Emitting close-full-image');
  emit('close-full-image');
};
</script>