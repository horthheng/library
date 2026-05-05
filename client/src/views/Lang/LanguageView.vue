<template>
  <div class="bg-gray-100">
    <div class="p-4">
      <!-- Error message -->
      <transition name="fade">
        <div
          v-if="error"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        >
          <p>{{ error }}</p>
        </div>
      </transition>

      <!-- Notification -->
      <div
        v-if="notification.visible"
        :class="[
          'fixed bottom-4 right-4 z-50 max-w-xs rounded-xl shadow-lg border-l-4 p-3',
          notification.type === 'success'
            ? 'bg-green-50 border-green-500 text-green-700'
            : 'bg-red-50 border-red-500 text-red-700',
        ]"
      >
        <div class="flex items-center gap-2">
          <svg
            v-if="notification.type === 'success'"
            class="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else
            class="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p class="font-medium text-sm">{{ notification.message }}</p>
        </div>
      </div>

      <!-- Header -->
      <header
        class="bg-white shadow-sm rounded-xl mb-8 border-b border-gray-200 transition-all duration-300"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="transform hover:scale-[1.01] transition-transform duration-300">
              <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Library Collection
              </h1>
              <p class="text-gray-500 mt-1 text-base">Discover books by language</p>
            </div>
            <button
              @click="openLanguageModal()"
              class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span
                class="inline-block transition-transform duration-200 group-hover:rotate-90"
                >+</span
              >
              Add Language
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div
        class="bg-white shadow-sm border-b rounded-xl border-gray-200 transition-all duration-300"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <!-- Books Grid -->
            <div class="lg:col-span-3">
              <div class="mb-6 flex sm:flex-row items-center justify-between gap-3">
                <div class="text-center sm:text-left">
                  <h2 class="text-lg sm:text-2xl font-bold text-gray-900">
                    {{ selectedLanguage ? `Books in ${selectedLanguage}` : "All Books" }}
                  </h2>
                  <p class="text-gray-500 mt-1 transition-opacity duration-300">
                    {{ filteredBooks.length }}
                    {{ filteredBooks.length === 1 ? "book" : "books" }}
                  </p>
                </div>

                <!-- Search Bar -->
                <div class="w-full sm:w-auto flex-grow relative max-w-md">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search"
                    class="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm sm:py-2.5 sm:px-9 sm:text-base pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 transition-all duration-300"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.65 6.65a7.5 7.5 0 016.5 6.5z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Books Grid -->
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
              >
                <div
                  v-for="book in filteredBooks"
                  :key="book.id"
                  class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                >
                  <div
                    class="aspect-[2/3] sm:aspect-[3/4] bg-gray-100 relative overflow-hidden"
                  >
                    <img
                      v-if="book.cover_image_url"
                      :src="book.cover_image_url"
                      :alt="book.title || 'Book cover'"
                      class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      @error="handleImageError($event, book)"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-16 h-16 text-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <transition name="fade" mode="out-in">
                <div
                  v-if="
                    !loading.books &&
                    (!Array.isArray(filteredBooks) || filteredBooks.length === 0)
                  "
                  class="text-center py-20"
                >
                  <div class="mx-auto w-24 h-24 mb-6 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      class="w-full h-full"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 class="text-xl font-medium text-gray-700 mb-2">No books found</h3>
                  <p class="text-gray-500 max-w-md mx-auto">
                    {{
                      loading.books
                        ? "Loading books..."
                        : "Try adjusting your search or language filter."
                    }}
                  </p>
                </div>
              </transition>
            </div>

            <!-- Language Sidebar -->
            <div class="lg:col-span-1">
              <div
                class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-10 transition-all duration-300 hover:shadow-md"
              >
                <h3 class="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span>🌐</span>
                  Languages
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                  Total Languages: {{ Array.isArray(languages) ? languages.length : 0 }}
                </p>
                <div class="max-h-[500px] overflow-y-auto no-scrollbar space-y-2">
                  <div class="flex justify-between items-center">
                    <button
                      @click="selectedLanguage = null"
                      :class="[
                        'w-full text-left p-3 rounded-lg transition-all duration-300 flex justify-between items-center',
                        !selectedLanguage
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                          : 'hover:bg-gray-50 text-gray-700 hover:border-gray-300 border border-transparent',
                      ]"
                    >
                      <span>🌍 All Languages</span>
                    </button>
                    <button
                      v-if="selectedLanguage"
                      @click="selectedLanguage = null"
                      class="ml-2 text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 p-1"
                    >
                      Clear
                    </button>
                  </div>

                  <div v-if="Array.isArray(filteredLanguages)">
                    <div
                      v-for="language in filteredLanguages"
                      :key="language.id"
                      class="transition-all duration-300"
                    >
                      <div class="flex justify-between items-center">
                        <button
                          @click="selectedLanguage = language.name"
                          :class="[
                            'w-full text-left p-3 rounded-lg transition-all duration-300 border flex-grow flex items-center gap-2',
                            selectedLanguage === language.name
                              ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                              : 'hover:bg-gray-50 text-gray-700 hover:border-gray-300 border-transparent',
                          ]"
                        >
                          <svg
                            v-if="selectedLanguage === language.name"
                            class="h-4 w-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <div>
                            <div class="transition-colors duration-300">
                              {{ language.name || "Unknown Language" }}
                            </div>
                          </div>
                          <span
                            :class="[
                              'text-xs px-2 py-1 rounded-full transition-all duration-300',
                              selectedLanguage === language.name
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800',
                            ]"
                          >
                            {{ language.count || 0 }}
                          </span>
                        </button>
                        <div class="flex gap-1 ml-2">
                          <button
                            @click.stop="openLanguageModal(language)"
                            class="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300 p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            @click.stop="openDeleteConfirm(language.id)"
                            class="text-red-600 hover:text-red-800 text-sm transition-colors duration-300 p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Language Modal -->
      <transition name="modal">
        <div
          v-if="showLanguageModal"
          class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-300"
          @click.self="showLanguageModal = false"
        >
          <div
            class="bg-white rounded-xl p-6 w-96 max-w-[90vw] mx-4 transition-all duration-300"
            :class="showLanguageModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
          >
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
              {{ editingLanguage ? "Edit Language" : "Add Language" }}
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Language Name *</label
                >
                <input
                  v-model="languageForm.name"
                  placeholder=""
                  class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                  @keyup.enter="saveLanguage"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Country (Optional)</label
                >
                <input
                  v-model="languageForm.country"
                  placeholder=""
                  class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                  @keyup.enter="saveLanguage"
                />
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button
                @click="showLanguageModal = false"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                @click="saveLanguage"
                :disabled="!languageForm.name"
                :class="[
                  'px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95',
                  languageForm.name
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-400 cursor-not-allowed',
                ]"
              >
                {{ editingLanguage ? "Update" : "Create" }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Language</h3>
            <p class="text-gray-600 text-sm mb-4">
              Are you sure you want to delete this language? This action cannot be undone.
            </p>

            <div class="flex justify-center gap-4">
              <button
                @click="cancelDelete"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                @click="confirmDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from "@/services/Api/language";
import { getBooks } from "@/services/Api/book";

// ---------- Reactive States ----------
const books = ref([]);
const allLanguages = ref([]);
const loading = ref({ books: false, languages: false });
const error = ref(null);
const notification = ref({ visible: false, message: "", type: "" });

const selectedLanguage = ref(null);
const searchQuery = ref("");

const showLanguageModal = ref(false);
const editingLanguage = ref(null);
const languageForm = ref({ name: "", country: "" });
const showDeleteConfirm = ref(false);
const languageToDelete = ref(null);

// No placeholder image URL since we're using SVG fallback
const placeholderImage = null;

// ---------- Lifecycle ----------
let isMounted = true;
onUnmounted(() => {
  isMounted = false;
});

onMounted(() => {
  selectedLanguage.value = null;
  searchQuery.value = "";
  fetchInitialData();
});

// ---------- Fetch Functions ----------
const fetchInitialData = async (retries = 3) => {
  try {
    loading.value.books = true;
    loading.value.languages = true;

    const [booksRes, languagesRes] = await Promise.all([
      getBooks().catch((err) => {
        console.error("Failed to fetch books:", err.message);
        return { data: { books: [] } };
      }),
      getLanguages().catch((err) => {
        console.error("Failed to fetch languages:", err.message);
        return { data: [] };
      }),
    ]);

    if (!isMounted) return;

    // Map languages to a lookup object for faster access
    const languageMap = Array.isArray(languagesRes.data)
      ? languagesRes.data.reduce((map, lang) => {
          map[lang.id] = lang.name || "Unknown";
          return map;
        }, {})
      : {};

    // Map book data to include only required fields
    const bookData = booksRes.data.books || booksRes.data; // Handle { books: [...] } or [...]
    books.value = Array.isArray(bookData)
      ? bookData.map((book) => ({
          id: book?.id,
          title: book?.title || "Untitled Book",
          cover_image_url: book.cover_image_url || null, // Use null for missing images
          public_year: book?.public_year || "Unknown year",
          language: book?.Language?.name || languageMap[book?.language_id] || "Unknown",
        }))
      : [];

    allLanguages.value = Array.isArray(languagesRes.data) ? languagesRes.data : [];

    if (books.value.length === 0) {
      error.value = "No books found in the database.";
    }
    if (allLanguages.value.length === 0) {
      error.value = error.value
        ? `${error.value} No languages found in the database.`
        : "No languages found in the database.";
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      setTimeout(() => fetchInitialData(retries - 1), 2000);
    } else {
      error.value =
        "Failed to load data after multiple attempts. Please check your network or server status.";
      notification.value = { visible: true, message: error.value, type: "error" };
      setTimeout(() => {
        notification.value.visible = false;
      }, 3000);
      books.value = [];
      allLanguages.value = [];
    }
  } finally {
    if (isMounted) {
      loading.value.books = false;
      loading.value.languages = false;
    }
  }
};

// ---------- Computed Properties ----------
const languages = computed(() => {
  if (!Array.isArray(allLanguages.value)) return [];
  return allLanguages.value
    .map((lang) => ({
      id: lang?.id,
      name: lang?.name || "Unknown Language",
      country: lang?.country,
      count: Array.isArray(books.value)
        ? books.value.filter((b) => b?.language === lang?.name).length
        : 0,
      books: Array.isArray(books.value)
        ? books.value.filter((b) => b?.language === lang?.name)
        : [],
    }))
    .sort((a, b) => b.count - a.count);
});

const filteredLanguages = computed(() => {
  const searchTerm = searchQuery.value.toLowerCase();
  return languages.value.filter(
    (lang) => !searchTerm || lang.name.toLowerCase().includes(searchTerm)
  );
});

// ---------- Book Filtering ----------
const filterBook = (book) => {
  const searchTerm = searchQuery.value.toLowerCase();
  if (!searchTerm) return true;
  return (
    book?.title?.toLowerCase().includes(searchTerm) ||
    book?.language?.toLowerCase().includes(searchTerm)
  );
};

const filteredBooks = computed(() => {
  if (!Array.isArray(books.value)) return [];
  if (selectedLanguage.value) {
    const selectedLang = languages.value.find((l) => l.name === selectedLanguage.value);
    return selectedLang ? selectedLang.books.filter(filterBook) : [];
  }
  return books.value.filter(filterBook);
});

// ---------- Language Modal ----------
const openLanguageModal = (lang = null) => {
  editingLanguage.value = lang;
  languageForm.value = lang ? { ...lang } : { name: "", country: "" };
  showLanguageModal.value = true;
};

// ---------- Delete Modal ----------
const openDeleteConfirm = (id) => {
  languageToDelete.value = id;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  languageToDelete.value = null;
};

// ---------- Notification Handler ----------
const showNotification = (message, type) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3000);
};

// ---------- CRUD Operations ----------
const saveLanguage = async () => {
  if (!languageForm.value.name) return;

  try {
    if (editingLanguage.value) {
      const response = await updateLanguage(editingLanguage.value.id, languageForm.value);
      const index = allLanguages.value.findIndex(
        (l) => l?.id === editingLanguage.value?.id
      );
      if (index !== -1) allLanguages.value[index] = response.data;
      showNotification("Language updated successfully", "success");
    } else {
      const response = await createLanguage(languageForm.value);
      allLanguages.value = [response.data, ...allLanguages.value];
      showNotification("Language added successfully", "success");
    }

    showLanguageModal.value = false;
    editingLanguage.value = null;
    languageForm.value = { name: "", country: "" };
  } catch (err) {
    showNotification("Failed to save language. Please try again.", "error");
    console.error("Save language error:", err.message);
  }
};

const confirmDelete = async () => {
  try {
    const deletedLang = allLanguages.value.find((l) => l?.id === languageToDelete.value)
      ?.name;
    const languageBooksCount = books.value.filter((b) => b?.language === deletedLang)
      .length;
    if (languageBooksCount > 0) {
      showNotification("Cannot delete language with associated books", "error");
      return;
    }
    await deleteLanguage(languageToDelete.value);
    allLanguages.value = allLanguages.value.filter(
      (l) => l?.id !== languageToDelete.value
    );

    if (selectedLanguage.value === deletedLang) selectedLanguage.value = null;
    showNotification("Language deleted successfully", "success");
  } catch (err) {
    showNotification("Failed to delete language. Please try again.", "error");
    console.error("Delete language error:", err.message);
  } finally {
    showDeleteConfirm.value = false;
    languageToDelete.value = null;
  }
};

// ---------- Image Error Handler ----------
const handleImageError = (e, book) => {
  book.cover_image_url = null; // Set to null to trigger SVG fallback
  e.target.classList.add("hidden"); // Hide the broken image element
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar but keep scroll functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
