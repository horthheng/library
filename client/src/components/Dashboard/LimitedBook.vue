<template>
  <!-- Header Section -->
  <div class="flex items-center justify-between mb-8">
    <div class="flex items-center gap-3">
      <div class="w-2 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
      <!-- Smaller on mobile, normal on larger devices -->
      <h3 class="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
        Limited Availability
      </h3>
    </div>
    <button
      @click="goToLimitedBooks"
      class="group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
    >
      <span>View All</span>
      <svg
        class="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>

  <!-- Loading State -->
  <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <div v-for="n in 5" :key="n" class="animate-pulse">
      <div class="bg-gray-200 rounded-xl h-48 mb-3"></div>
      <div class="bg-gray-200 rounded h-4 mb-2"></div>
      <div class="bg-gray-200 rounded h-3 w-3/4"></div>
    </div>
  </div>

  <!-- Books Grid -->
  <div
    v-else-if="limitedBooks.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
  >
    <div
      v-for="(book, index) in limitedBooks"
      :key="book.id"
      class="group relative bg-white hover:bg-gray-50 transition-all duration-300 p-5 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-2"
      :style="{ animationDelay: `${index * 100}ms` }"
    >
      <!-- Book Cover -->
      <div class="relative w-full flex justify-center mb-4">
        <div class="relative">
          <img
            :src="book.cover_image_url"
            :alt="`${book.title} cover`"
            class="w-24 h-32 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            loading="lazy"
          />
          <!-- Overlay gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
        </div>

        <!-- Limited Stock Badge -->
        <div
          class="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
        >
          {{ book.quantity }} left
        </div>
      </div>

      <!-- Book Info -->
      <div class="flex-1 w-full">
        <h4
          class="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200"
        >
          {{ book.title }}
        </h4>
        <p class="text-xs text-gray-600 mb-3 font-medium">by {{ book.author.name }}</p>

        <!-- Status -->
        <div class="flex items-center justify-center gap-1">
          <div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <span class="text-xs text-amber-600 font-semibold">Limited Stock</span>
        </div>
      </div>

      <!-- Hover Effect -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-12">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        ></path>
      </svg>
    </div>
    <h4 class="text-lg font-semibold text-gray-900 mb-2">No Limited Books</h4>
    <p class="text-gray-600 text-sm">All books are currently well-stocked!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBooks, getAuthors } from '@/services/Api/book'

// Define types for better TypeScript support
interface Author {
  name: string
}

interface Book {
  id: string | number
  title: string
  author: Author
  cover_image_url: string
  quantity: number
}

// Reactive state - all declared at the top level as required by Vue Composition API
const books: Ref<Book[]> = ref([])
const authors: Ref<Author[]> = ref([])
const isLoading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)

// Router instance
const router = useRouter()

// Methods
const goToLimitedBooks = (): void => {
  router.push({ name: 'books', query: { status: 'limited' } })
}

const fetchBooks = async (): Promise<void> => {
  try {
    isLoading.value = true
    error.value = null

    const [booksRes, authorsRes] = await Promise.all([
      getBooks(),
      getAuthors(),
    ])

    books.value = booksRes.data.books
    authors.value.splice(0, authors.value.length, ...authorsRes.data)
    localStorage.setItem('authors', JSON.stringify(authors.value))
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = 'Failed to load books. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const limitedBooks = computed((): Book[] => {
  return books.value.filter(book => book.quantity === 1).slice(0, 5)
})

// Lifecycle hooks
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>