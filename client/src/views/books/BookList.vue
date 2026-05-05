<template>
  <div>
    <Notification :notification="notification" />

    <div class="max-w-8xl mx-auto sm:px-4 lg:px-1 py-4 space-y-2 flex flex-col gap-4">
      <!-- Header -->
      <div class="bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-2xl mx-4 overflow-hidden relative shadow-lg">
        <BookManagerHeader @add-by-form="handleAddByForm" @add-by-import="handleAddByImport" />
      </div>

      <!-- Book Overview Stats res done -->
      <div class="px-4 mt-6 mb-8">
        <BookStatsCards :total-books="totalBooks" :available-books="availableBooks"
          :unavailable-books="unavailableBooks" :categories="categories" />
      </div>

      <!-- Trash View -->
      <div v-if="showTrash" class="px-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Trashed Books</h2>
          <button @click="showTrash = false" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Books
          </button>
        </div>
        <div v-if="trashedBooks.length === 0" class="text-center py-12">
          <EmptyState title="Trash Empty" message="No books in trash" />
        </div>
        <div v-else class="grid grid-cols-2 grid gap-4">
          <div v-for="book in trashedBooks" :key="book.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out">

            <div class="p-4">
              <div class="flex items-start gap-8">
                <div class="flex-shrink-0">
                  <div v-if="book.cover_image_url && book.cover_image_url !== ''" class="w-20 h-28 shadow-md">
                    <img :src="book.cover_image_url" :alt="book.title" :title="book.title"
                      class="w-full h-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                      @error="handleImageError" @load="handleImageLoad" />
                  </div>
                  <div v-else
                    class="w-20 h-28 rounded-lg shadow-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg class="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                  </div>
                </div>

                <div class="flex-1 flex flex-col justify-between h-full">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 text-lg leading-tight mb-1 mt-1 line-clamp-2">
                        {{ book.title }}
                      </h3>
                      <p class="text-gray-600 text-sm mb-2">
                        Author: {{ book.author?.name || 'Unknown Author' }}
                      </p>
                      <p class="text-gray-500 text-sm mb-3 description">
                        {{ book.description && book.description.length > 180 ? book.description.slice(0, 70) + ' ...' :
                          book.description || 'N/A' }}
                      </p>
                    </div>
                    <div class="relative ml-2" data-action-menu>
                      <button @click.stop="toggleActionMenu(book.id)"
                        class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                      <Transition name="fade-slide">
                        <div v-if="openActionMenu === book.id"
                          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <div class="py-2">
                            <button @click.stop="restoreBook(book.id)"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 4v5h5m-5 0l8 8m0 0l-8 8m8-8H4" />
                              </svg>
                              Restore
                            </button>
                            <button @click.stop="permanentlyDeleteBook(book.id)"
                              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Delete Permanently
                            </button>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 mb-4">
                    <span v-if="book.category?.name"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ book.category.name }}
                    </span>
                    <span v-if="book.language?.name"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-gray-800">
                      {{ book.language.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="px-4 mb-6">
        <Collection :categories="categories" :languages="languages" :trashed-books="trashedBooks"
          :show-trash="showTrash" @view-trash="viewTrash" @add-by-form="handleAddByForm"
          @add-by-import="handleAddByImport" @back-to-books="showTrash = false" @restore-book="restoreBook"
          @permanently-delete-book="permanentlyDeleteBook" @update:search="searchQuery = $event"
          @update:category="selectedCategory = $event" @update:status="onStatusChange"
          @update:language="selectedLanguage = $event" />
      </div>

      <!-- Book Cards -->
      <div v-if="!showTrash" class="px-4 pb-10">
        <div class="grid gap-4">

          <div v-for="book in filteredBooks" :key="book.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
            @click="viewBook(book)">
            <div class="p-4">
              <div class="flex items-start gap-8">
                <!-- Book Cover -->
                <div class="flex-shrink-0">
                  <div v-if="book.cover_image_url && book.cover_image_url !== ''" class="w-20 h-28 shadow-md">
                    <img :src="book.cover_image_url" :alt="book.title" :title="book.title"
                      class="w-full h-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
                      @error="handleImageError" @load="handleImageLoad" />
                  </div>
                  <div v-else
                    class="w-20 h-28 rounded-lg shadow-md bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg class="w-10 h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                  </div>
                </div>

                <!-- Book Info, Action Menu & Badges -->
                <div class="flex-1 flex flex-col justify-between h-full">
                  <!-- Book Title, Author, Description + Action Menu -->
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 text-lg leading-tight mb-1 mt-1 line-clamp-2">
                        {{ book.title }}
                      </h3>
                      <p class="text-gray-600 text-sm mb-2">
                        Author: {{ book.author?.name || 'Unknown Author' }}
                      </p>

                      <!-- Hide description only on mobile devices (sm:hidden) -->
                      <p class="sm:hidden md:block text-gray-500 text-sm mb-3 description">
                        {{ book.description && book.description.length > 180 ? book.description.slice(0, 70) + ' ...' :
                          book.description || 'N/A' }}
                      </p>
                    </div>

                    <!-- Action Menu -->
                    <div class="relative ml-2" data-action-menu>
                      <button @click.stop="toggleActionMenu(book.id)"
                        class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                      <Transition name="fade-slide">
                        <div v-if="openActionMenu === book.id"
                          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <div class="py-2">
                            <button @click="viewBook(book.id)"
                              class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200">
                              <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            <!-- Edit Button -->
                            <button @click.stop="openForm(book)"
                              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                              <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Book
                            </button>

                            <!-- Delete Button -->
                            <button @click.stop="confirmDeleteBook(book.id)"
                              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                              <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Book
                            </button>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <!-- Badges and Availability -->
                  <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span v-if="book.category?.name"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ book.category.name }}
                      </span>
                      <span v-if="book.language?.name"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-gray-800">
                        {{ book.language.name }}
                      </span>
                    </div>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300"
                      :class="{
                        'bg-green-100 text-green-800': getBookStatus(book.quantity) === 'available',
                        'bg-yellow-100 text-yellow-800': getBookStatus(book.quantity) === 'limited',
                        'bg-red-100 text-red-800': getBookStatus(book.quantity) === 'unavailable'
                      }">
                      <div class="w-1.5 h-1.5 rounded-full mr-1.5 transition-colors duration-300" :class="{
                        'bg-green-400': getBookStatus(book.quantity) === 'available',
                        'bg-yellow-400': getBookStatus(book.quantity) === 'limited',
                        'bg-red-400': getBookStatus(book.quantity) === 'unavailable'
                      }"></div>
                      {{ getBookStatus(book.quantity).charAt(0).toUpperCase() + getBookStatus(book.quantity).slice(1) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredBooks.length === 0" class="text-center py-12">
            <EmptyState title="No Results" message="No books match your criteria" buttonText="Add New Book"
              @add-book="handleAddByForm" />
          </div>
        </div>
      </div>

      <!-- Book Detail Modal -->
      <div v-if="showDetail" class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
        <BookDetail :selected-book="selectedBook" :book-cover="bookCover" :book-title="bookTitle"
          :book-description="bookDescription" :category-name="categoryName" :language-name="languageName"
          :author-name="authorName" :author-biography="authorBiography" :author-nationality="authorNationality"
          :formatted-birth-date="formattedBirthDate" :show-full-image="showFullImage" @edit-book="handleEditBook"
          @close-detail="closeDetail" @open-full-image="openFullImage" @close-full-image="closeFullImage" />
      </div>

      <!-- Book Form -->
      <div style="position: absolute; top: 100px; width: 100%; z-index: 1000;">
        <BookForm :show-form="showForm" :form="form" :authors="authors" :categories="categories" :languages="languages"
          :preview-image="previewImage" @close-form="closeForm" @submit-form="submitForm" @handle-file="handleFile"
          @author-updated="handleAuthorUpdate" @category-updated="handleCategoryUpdate"
          @language-updated="handleLanguageUpdate" @update-form="handleFormUpdate" />
      </div>

      <!-- Import Book Modal -->
      <div style="position: absolute; top: 100px; width: 100%; z-index: 1000;">
        <ImportBook :show="showImportModal" @close="closeImportModal" @submit="handleImportSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import Swal from 'sweetalert2';
import BookForm from '@/components/books/Form/BookForm.vue';
import ImportBook from '@/components/books/Form/ImportBook.vue';
import BookManagerHeader from '@/components/books/headers/BookManagerHeader.vue';
import BookStatsCards from '@/components/books/stats/BookStatsCards.vue';
import Collection from '@/components/books/MainContent/Collection.vue';
import BookDetail from '@/components/books/BookDetail/collection.vue';
import Notification from '@/components/books/Notification/Notification.vue';
import EmptyState from '@/components/books/EmptyState.vue';
import { getBooks, getCategories, getLanguages, getAuthors, createBook as apiCreateBook, updateBook, deleteBook, importBooks } from '@/services/Api/book';

// Reactive State
const books = ref([]);
const authors = reactive([]);
const categories = reactive([]);
const languages = reactive([]);
const trashedBooks = ref([]); // Store trashed books
const showForm = ref(false);
const showImportModal = ref(false);
const showDetail = ref(false);
const showFullImage = ref(false);
const showTrash = ref(false); // Toggle trash view
const openActionMenu = ref(null);
const selectedBook = ref(null);
const form = reactive({
  id: null,
  title: '',
  isbn: '',
  quantity: 4,
  cover_image: null,
  donated_by: '',
  public_year: new Date().getFullYear(),
  description: '',
  available: true,
  AuthorId: '',
  CategoryId: '',
  language_id: '',
});
const imageFile = ref(null);
const previewImage = ref(null);
const updateFromDetail = ref(false);
const notification = ref({
  visible: false,
  message: '',
  type: '',
});
const showDropdown = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedLanguage = ref('');
const filterType = ref('all');



// Computed Properties
const totalBooks = computed(() => books.value.length);
const availableBooks = computed(() => books.value.filter(book => getBookStatus(book.quantity) === 'available').length);
const unavailableBooks = computed(() => books.value.filter(book => {
  const status = getBookStatus(book.quantity);
  return status === 'limited' || status === 'unavailable';
}).length);

const bookTitle = computed(() => selectedBook.value?.title || 'N/A');
const bookDescription = computed(() => selectedBook.value?.description || 'No description available');
const bookCover = computed(() => selectedBook.value?.cover_image_url && selectedBook.value?.cover_image_url !== '' ? selectedBook.value.cover_image_url : null);
const authorName = computed(() => selectedBook.value?.author?.name || 'N/A');
const authorBiography = computed(() => selectedBook.value?.author?.biography || 'No biography available');
const authorNationality = computed(() => selectedBook.value?.author?.nationality || 'N/A');
const categoryName = computed(() => selectedBook.value?.category?.name || 'N/A');
const languageName = computed(() => selectedBook.value?.language?.name || 'N/A');
const formattedBirthDate = computed(() => selectedBook.value?.author?.birth_date
  ? new Date(selectedBook.value.author.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  : 'N/A'
);

// Filtered Books
const filteredBooks = computed(() => {
  let filtered = books.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      book =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.name?.toLowerCase().includes(q) ||
        book.isbn?.toLowerCase().includes(q)
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      book => book.category?.name.toLowerCase() === selectedCategory.value.toLowerCase()
    );
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(
      book => book.language?.name.toLowerCase() === selectedLanguage.value.toLowerCase()
    );
  }

  switch (filterType.value) {
    case 'new':
      return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    case 'available':
      return filtered.filter(book => getBookStatus(book.quantity) === 'available');
    case 'limited':
      return filtered.filter(book => getBookStatus(book.quantity) === 'limited');
    case 'unavailable':
      return filtered.filter(book => getBookStatus(book.quantity) === 'unavailable');
    default:
      return filtered;
  }
});

// Utility Functions
const getRelationalData = (book) => {
  console.log('getRelationalData for book:', { id: book.id, AuthorId: book.AuthorId, CategoryId: book.CategoryId, language_id: book.language_id });
  const author = authors.find(a => String(a.id) == String(book.AuthorId));
  const category = categories.find(c => String(c.id) == String(book.CategoryId));
  const language = languages.find(l => String(l.id) == String(book.language_id));

  console.log('Found relational data:', { author, category, language });

  return {
    author: author || { name: 'Unknown Author' },
    category: category || { name: 'Unknown Category' },
    language: language || { name: 'Unknown Language' },
  };
};

const getBookStatus = (quantity) => {
  const qty = Number(quantity);
  if (qty >= 2) return 'available';
  if (qty === 1) return 'limited';
  return 'unavailable';
};

const showNotification = (message, type) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3000);
};

// Persist trashed book IDs to localStorage
const saveTrashedBooks = () => {
  localStorage.setItem('trashedBooks', JSON.stringify(trashedBooks.value));
};

// Load trashed book IDs from localStorage
const loadTrashedBooks = () => {
  const stored = localStorage.getItem('trashedBooks');
  return stored ? JSON.parse(stored) : [];
};

// Event Handlers
const handleImageLoad = () => {
  console.log('Image loaded successfully');
};

const handleImageError = (event) => {
  console.log('Image failed to load, switching to SVG fallback');
  event.target.style.display = 'none'; // Hide the broken image
  event.target.parentElement.nextElementSibling.style.display = 'flex'; // Show the SVG fallback
};

const toggleActionMenu = (id) => {
  openActionMenu.value = openActionMenu.value === id ? null : id;
};

const handleActionMenuClickOutside = (event) => {
  const actionMenus = document.querySelectorAll('[data-action-menu]');
  let clickedInside = false;
  actionMenus.forEach(menu => {
    if (menu.contains(event.target)) {
      clickedInside = true;
    }
  });
  if (!clickedInside) {
    openActionMenu.value = null;
  }
};

const handleDropdownClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

const handleAddByForm = () => {
  showDropdown.value = false;
  openForm();
};

const handleAddByImport = () => {
  showDropdown.value = false;
  showImportModal.value = true;
};

const closeImportModal = () => {
  showImportModal.value = false;
};

const handleImportSubmit = ({ books: newBooks, newCategories, newAuthors, newLanguages }) => {
  // Add imported books to the beginning of the books array
  books.value.unshift(
    ...newBooks.map(book => ({
      ...book,
      cover_image_url: book.cover_image || null,
      // Add relational data if needed
      category: newCategories.find(c => c.id === book.CategoryId)?.name || book.category_name,
      author: newAuthors.find(a => a.id === book.AuthorId)?.name || book.author_name,
      language: newLanguages.find(l => l.id === book.language_id)?.name || book.language_name,
    }))
  );
};


const viewBook = (book) => {
  console.log('Viewing book:', book);
  selectedBook.value = { ...book, ...getRelationalData(book), cover_image_url: book.cover_image_url && book.cover_image_url !== '' ? book.cover_image_url : null };
  showDetail.value = true;
  openActionMenu.value = null;
  updateFromDetail.value = false;
};

const closeDetail = () => {
  console.log('Closing detail modal, showDetail:', showDetail.value);
  showDetail.value = false;
  selectedBook.value = null;
  showFullImage.value = false;
};

const openFullImage = () => {
  console.log('Opening full image');
  showFullImage.value = true;
};

const closeFullImage = () => {
  console.log('Closing full image');
  showFullImage.value = false;
};

const handleEditBook = (book) => {
  console.log('Editing book:', book);
  closeDetail();
  openForm(book);
  updateFromDetail.value = true;
};

const openForm = (book = null) => {
  console.log('Opening form with book:', book);
  showForm.value = true;
  openActionMenu.value = null;

  if (book) {
    form.id = book.id;
    form.title = book.title || '';
    form.isbn = book.isbn || '';
    form.quantity = book.quantity || 4;
    form.cover_image = null;
    form.donated_by = book.donated_by || '';
    form.public_year = book.public_year || new Date().getFullYear();
    form.description = book.description || '';
    form.available = book.quantity > 0;
    form.AuthorId = book.AuthorId || '';
    form.CategoryId = book.CategoryId || '';
    form.language_id = book.language_id || '';
    previewImage.value = book.cover_image_url && book.cover_image_url !== '' ? book.cover_image_url : null;
  } else {
    form.id = null;
    form.title = '';
    form.isbn = '';
    form.quantity = 4;
    form.cover_image = null;
    form.donated_by = '';
    form.public_year = new Date().getFullYear();
    form.description = '';
    form.available = true;
    form.AuthorId = '';
    form.CategoryId = '';
    form.language_id = '';
    previewImage.value = null;
  }
  imageFile.value = null;
};

const closeForm = () => {
  console.log('Closing form');
  showForm.value = false;
  Object.assign(form, {
    id: null,
    title: '',
    isbn: '',
    quantity: 4,
    cover_image: null,
    donated_by: '',
    public_year: new Date().getFullYear(),
    description: '',
    available: true,
    AuthorId: '',
    CategoryId: '',
    language_id: '',
  });
  imageFile.value = null;
  previewImage.value = null;
};

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  } else {
    imageFile.value = null;
    previewImage.value = null;
  }
};

const handleAuthorUpdate = (updatedAuthor) => {
  const index = authors.findIndex(a => String(a.id) == String(updatedAuthor.id));
  if (index !== -1) {
    authors.splice(index, 1, updatedAuthor);
  } else {
    authors.push(updatedAuthor);
  }
  localStorage.setItem('authors', JSON.stringify(authors));
  if (selectedBook.value && String(selectedBook.value.AuthorId) == String(updatedAuthor.id)) {
    selectedBook.value = {
      ...selectedBook.value,
      author: updatedAuthor,
    };
  }
  if (!form.id && updatedAuthor.id) {
    form.AuthorId = updatedAuthor.id;
  }
};

const handleCategoryUpdate = (updatedCategory) => {
  const index = categories.findIndex(c => String(c.id) == String(updatedCategory.id));
  if (index !== -1) {
    categories.splice(index, 1, updatedCategory);
  } else {
    categories.push(updatedCategory);
  }
  localStorage.setItem('categories', JSON.stringify(categories));
  if (selectedBook.value && String(selectedBook.value.CategoryId) == String(updatedCategory.id)) {
    selectedBook.value = {
      ...selectedBook.value,
      category: updatedCategory,
    };
  }
  if (!form.id && updatedCategory.id) {
    form.CategoryId = updatedCategory.id;
  }
};

const handleLanguageUpdate = (updatedLanguage) => {
  const index = languages.findIndex(l => String(l.id) == String(updatedLanguage.id));
  if (index !== -1) {
    languages.splice(index, 1, updatedLanguage);
  } else {
    languages.push(updatedLanguage);
  }
  localStorage.setItem('languages', JSON.stringify(languages));
  if (selectedBook.value && String(selectedBook.value.language_id) == String(updatedLanguage.id)) {
    selectedBook.value = {
      ...selectedBook.value,
      language: updatedLanguage,
    };
  }
  if (!form.id && updatedLanguage.id) {
    form.language_id = updatedLanguage.id;
  }
};

const handleFormUpdate = (updates) => {
  Object.assign(form, updates);
};

const viewTrash = () => {
  showTrash.value = true;
  showDetail.value = false;
  showForm.value = false;
  showImportModal.value = false;
  openActionMenu.value = null;
};

const restoreBook = async (bookId) => {
  const book = trashedBooks.value.find(b => String(b.id) == String(bookId));
  if (book) {
    books.value.unshift(book);
    trashedBooks.value = trashedBooks.value.filter(b => String(b.id) != String(bookId));
    saveTrashedBooks();
    showNotification('Book restored successfully.', 'success');
    openActionMenu.value = null;
  }
};

const permanentlyDeleteBook = async (bookId) => {
  const result = await Swal.fire({
    title: 'Confirm Permanent Deletion',
    text: 'This book will be permanently deleted. This action cannot be undone.',
    icon: 'warning',
    iconColor: '#f87171',
    showCancelButton: true,
    confirmButtonText: 'Delete Permanently',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-xl shadow-lg bg-white p-6',
      title: 'text-lg font-semibold text-gray-900',
      htmlContainer: 'text-sm text-gray-600 mt-1 leading-tight',
      confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium',
      cancelButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium mr-4',
      icon: 'animate-pulse',
      actions: 'mt-3 flex justify-end gap-2',
    },
  });

  if (result.isConfirmed) {
    try {
      await deleteBook(bookId);
      trashedBooks.value = trashedBooks.value.filter(book => String(book.id) != String(bookId));
      saveTrashedBooks();
      showNotification('Book permanently deleted.', 'success');
    } catch (err) {
      console.error('Error permanently deleting book:', err, err.response?.data);
      showNotification(err.response?.data?.message || 'Failed to delete the book.', 'error');
    }
  }
  openActionMenu.value = null;
};

const confirmDeleteBook = async (bookId) => {
  console.log('Confirming deletion for book ID:', bookId);
  const result = await Swal.fire({
    title: 'Confirm Deletion',
    text: 'This book will be moved to trash. You can restore it later.',
    icon: 'warning',
    iconColor: '#f87171',
    showCancelButton: true,
    confirmButtonText: 'Move to Trash',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-xl shadow-lg bg-white p-6',
      title: 'text-lg font-semibold text-gray-900',
      htmlContainer: 'text-sm text-gray-600 mt-1 leading-tight',
      confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium',
      cancelButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium mr-4',
      icon: 'animate-pulse',
      actions: 'mt-3 flex justify-end gap-2',
    },
  });

  if (result.isConfirmed) {
    console.log('Moving book to trash with ID:', bookId);
    const book = books.value.find(b => String(b.id) == String(bookId));
    if (book) {
      trashedBooks.value.push({ ...book });
      books.value = books.value.filter(book => String(book.id) != String(bookId));
      saveTrashedBooks();
      showNotification('Book moved to trash.', 'success');
    }
  }
  openActionMenu.value = null;
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
        formData.append(key, form[key]);
      }
    }

    if (imageFile.value) {
      formData.append('cover_image', imageFile.value);
    }

    console.log('FormData entries:', [...formData.entries()]);

    let bookWithRelations;
    if (form.id) {
      const res = await updateBook(form.id, formData);
      const updatedBook = res.data.book || res.data;
      console.log('Update response:', updatedBook);
      bookWithRelations = {
        ...updatedBook,
        cover_image_url: imageFile.value
          ? `${updatedBook.cover_image_url}?t=${Date.now()}`
          : updatedBook.cover_image_url && updatedBook.cover_image_url !== '' ? updatedBook.cover_image_url : null,
        ...getRelationalData(updatedBook),
      };

      const index = books.value.findIndex(book => String(book.id) == String(form.id));
      if (index !== -1) {
        books.value[index] = bookWithRelations;
      }

      if (updateFromDetail.value) {
        selectedBook.value = bookWithRelations;
        showDetail.value = true;
      }

      showNotification('The book has been updated successfully.', 'success');
    } else {
      const res = await apiCreateBook(formData);
      const newBook = res.data.book || res.data;
      console.log('Create response:', newBook);
      bookWithRelations = {
        ...newBook,
        cover_image_url: newBook.cover_image_url && newBook.cover_image_url !== '' ? newBook.cover_image_url : null,
        ...getRelationalData(newBook),
      };

      books.value.unshift(bookWithRelations);
      showNotification('The book has been added successfully.', 'success');
    }

    setTimeout(() => {
      closeForm();
    }, 500);
  } catch (err) {
    console.error('Error submitting form:', err, err.response?.data);
    const errorMessage = err.response?.data?.message || 'Failed to save book. Please check the form and try again.';
    showNotification(errorMessage, 'error');
  }
};

const onStatusChange = (status) => {
  filterType.value = status;
};

// Fetch Data
const fetchBooks = async () => {
  try {
    const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
      getBooks(),
      getAuthors(),
      getCategories(),
      getLanguages(),
    ]);
    console.log('Fetched data:', {
      books: booksRes.data.books || booksRes.data,
      authors: authorsRes.data,
      categories: categoriesRes.data,
      languages: languagesRes.data,
    });

    authors.splice(0, authors.length, ...authorsRes.data);
    categories.splice(0, categories.length, ...categoriesRes.data);
    languages.splice(0, languages.length, ...languagesRes.data);

    const allBooks = booksRes.data.books || booksRes.data;
    const trashedBookIds = loadTrashedBooks().map(book => String(book.id));

    // Filter out trashed books and populate trashedBooks
    books.value = allBooks
      .filter(book => !trashedBookIds.includes(String(book.id)))
      .map(book => ({
        ...book,
        cover_image_url: book.cover_image_url && book.cover_image_url !== '' ? book.cover_image_url : null,
        ...getRelationalData(book),
      }));
    trashedBooks.value = allBooks
      .filter(book => trashedBookIds.includes(String(book.id)))
      .map(book => ({
        ...book,
        cover_image_url: book.cover_image_url && book.cover_image_url !== '' ? book.cover_image_url : null,
        ...getRelationalData(book),
      }));

    localStorage.setItem('authors', JSON.stringify(authors));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('languages', JSON.stringify(languages));
  } catch (err) {
    console.error('Failed to fetch data:', err);
    const cachedAuthors = localStorage.getItem('authors');
    const cachedCategories = localStorage.getItem('categories');
    const cachedLanguages = localStorage.getItem('languages');

    if (cachedAuthors) {
      authors.splice(0, authors.length, ...JSON.parse(cachedAuthors));
    }
    if (cachedCategories) {
      categories.splice(0, categories.length, ...JSON.parse(cachedCategories));
    }
    if (cachedLanguages) {
      languages.splice(0, languages.length, ...JSON.parse(cachedLanguages));
    }
    showNotification('Failed to fetch data. Please try again later.', 'error');
  }
};

// ESC Key Handler
const handleEsc = (event) => {
  if (event.key === 'Escape') {
    if (showDetail.value) {
      closeDetail();
    } else if (showForm.value) {
      closeForm();
    } else if (showImportModal.value) {
      closeImportModal();
    } else if (showTrash.value) {
      showTrash.value = false;
    }
    openActionMenu.value = null;
    showDropdown.value = false;
  }
};

// Lifecycle Hooks
onMounted(() => {
  fetchBooks();
  const clickHandler = (event) => {
    handleActionMenuClickOutside(event);
    handleDropdownClickOutside(event);
  };
  window.addEventListener('click', clickHandler);
  window.addEventListener('keydown', handleEsc);
  console.log('Mounted: ESC key listener added');
});

onBeforeUnmount(() => {
  const clickHandler = (event) => {
    handleActionMenuClickOutside(event);
    handleDropdownClickOutside(event);
  };
  window.removeEventListener('click', clickHandler);
  window.removeEventListener('keydown', handleEsc);
  console.log('Unmounted: ESC key listener removed');
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>