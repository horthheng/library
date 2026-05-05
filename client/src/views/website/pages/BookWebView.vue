<template>
  <section class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Animated background elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30"></div>
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>

    <div class="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
      <!-- Parent Wrapper -->
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
        
        <!-- Image Grid -->
        <div class="flex justify-center">
          <div class="grid grid-cols-2 gap-6 max-w-md">
            <div class="space-y-6">
              <div class="relative group">
                <div class="absolute -inset-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img src="../../../../public/b3.avif"
                    alt="Featured Book Cover"
                    class="relative rounded-2xl shadow-xl w-full h-64 object-cover border-2 border-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl" />
              </div>
              <div class="relative group">
                <div class="absolute -inset-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img src="../../../../public/lib.avif"
                    alt="Featured Book Cover"
                    class="relative rounded-2xl shadow-xl w-full h-64 object-cover border-2 border-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl" />
              </div>
            </div>
            <div class="space-y-6 pt-12">
              <div class="relative group">
                <div class="absolute -inset-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img src="../../../../public/b1.avif"
                    alt="Featured Book Cover"
                    class="relative rounded-2xl shadow-xl w-full h-64 object-cover border-2 border-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl" />
              </div>
              <div class="relative group">
                <div class="absolute -inset-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img src="../../../../public/b2.avif"
                    alt="Featured Book Cover"
                    class="relative rounded-2xl shadow-xl w-full h-64 object-cover border-2 border-slate-200 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl" />
              </div>
            </div>
          </div>
        </div>

        <!-- Text Content -->
        <div class="text-center md:text-left space-y-8 max-w-2xl mx-auto">
          <div class="space-y-6">
            <h1 class="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight">
              A place to discover your
              <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Next Masterpiece</span>
            </h1>
            <p class="text-xl text-slate-700 font-medium leading-relaxed">
              Authors can display their literary works, and readers can discover and purchase books that resonate with them.
            </p>
          </div>

          <p class="text-lg text-slate-600 leading-relaxed">
            Explore our curated collection of literary masterpieces, carefully selected for every reader's journey. Dive into captivating stories, expand your knowledge, and find new adventures.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-gradient-to-br from-white via-slate-50 to-blue-50 py-16 md:py-24 relative">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-blue-50/20"></div>
    
    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
      <div class="grid gap-16 lg:grid-cols-2 items-start">
        <!-- Author Info -->
        <div class="space-y-10">
          <div class="space-y-8">
            <div class="relative">
              <h2 class="text-5xl font-bold text-slate-900 tracking-tight leading-tight pb-4">
                About the 
                <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Author
                </span>
              </h2>
              <div class="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            </div>
            
            <div class="space-y-6 text-slate-700 leading-relaxed text-lg">
                <p class="first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:leading-none">
                Discover the creative mind behind these captivating stories. Each author brings their unique perspective and storytelling mastery to create unforgettable reading experiences that resonate with readers across generations.
                </p>
                <p class="text-slate-600">
                Learn more about their journey, the inspiration behind their books, and the profound impact they've made on readers around the world through their compelling narratives.
                </p>
            </div>
          </div>
          
          <!-- Category Tags -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-slate-600 uppercase tracking-wider">Genres & Categories</h3>
            <div class="flex flex-wrap gap-3">
                <span class="animate-fade-in-up bg-white/80 backdrop-blur-sm border border-slate-200 text-blue-700 px-4 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 group">
                <span class="group-hover:scale-110 transition-transform duration-200 inline-block">
                    Fiction
                </span>
                </span>
                <span class="animate-fade-in-up bg-white/80 backdrop-blur-sm border border-slate-200 text-blue-700 px-4 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 group">
                <span class="group-hover:scale-110 transition-transform duration-200 inline-block">
                    Adventure
                </span>
                </span>
                <span class="animate-fade-in-up bg-white/80 backdrop-blur-sm border border-slate-200 text-blue-700 px-4 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 group">
                <span class="group-hover:scale-110 transition-transform duration-200 inline-block">
                    Inspiration
                </span>
                </span>
                <span class="animate-fade-in-up bg-white/80 backdrop-blur-sm border border-slate-200 text-blue-700 px-4 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 group">
                <span class="group-hover:scale-110 transition-transform duration-200 inline-block">
                    Drama
                </span>
                </span>
            </div>
          </div>
        </div>
        
        <!-- Books Section -->
        <div class="space-y-10">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Title + subtitle -->
            <div class="space-y-2">
                <!-- Desktop text -->
                <h2 class="hidden md:block text-4xl font-bold text-slate-900 tracking-tight">
                More by 
                </h2>
                <p class="hidden md:block text-slate-600">
                Explore their complete collection
                </p>
                <!-- Mobile text -->
                <h2 class="md:hidden text-2xl font-bold text-slate-900 tracking-tight">
                Featured Collection
                </h2>
                <p class="md:hidden text-slate-600">
                Handpicked books across all genres
                </p>
            </div>
                <!-- Filter + View All -->
                <div class="flex flex-row sm:flex-row items-stretch sm:items-center gap-3">
                <!-- Filter -->
                <div class="relative flex-1">
                    <select v-model="selectedAuthor" @change="filterBooksByAuthor"
                    class="appearance-none border border-slate-300 rounded-xl px-6 py-3 pr-12 text-sm bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-slate-400 transition-all duration-200 cursor-pointer w-full">
                    <option value="" class="bg-white text-slate-700">All Authors</option>
                    <option v-for="author in authors" :key="author.id" :value="author.name" class="bg-white text-slate-700">
                        {{ author.name }}
                    </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 9l-7 7-7-7"></path>
                    </svg>
                    </div>
                </div>
                <!-- View All -->
                <button @click="showAll = true"
                    class="group flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200 w-auto">
                    View All
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </button>
                </div>
            </div>
            
          <!-- Book Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <div v-for="(book, index) in filteredAuthorBooks.slice(0, 8)" 
                 :key="book.id"
                 :style="{ animationDelay: `${index * 150}ms` }"
                 class="animate-fade-in-up group cursor-pointer bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-200 hover:border-blue-300"
                 @click="openBookModal(book)">
              <div class="relative aspect-[3/4] overflow-hidden">
                <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                     :alt="`Cover of ${book.title}`" 
                     class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div class="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-slate-200">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- All Books Modal -->
  <Teleport to="body">
    <div v-if="showAll" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
         @click.self="showAll = false">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in border border-slate-200">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-3xl font-bold text-slate-900">
            All Books by {{ selectedAuthor || 'Our Authors' }}
          </h3>
          <button @click="showAll = false"
                  class="text-slate-600 hover:text-slate-900 text-2xl font-bold w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-200">
            ×
          </button>
        </div>
        <div class="no-scrollbar overflow-y-auto max-h-[70vh] pr-4">
          <div v-if="filteredAuthorBooks.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <div v-for="book in filteredAuthorBooks" :key="book.id"
                 class="group cursor-pointer bg-white/80 backdrop-blur-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
                 @click="openBookModal(book)">
              <div class="aspect-[3/4] overflow-hidden">
                <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                     :alt="`Cover of ${book.title}`" 
                     class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16">
            <div class="text-slate-400 text-6xl mb-4">📚</div>
            <p class="text-slate-600 text-lg">No books found for this author.</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <section class="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 sm:py-20 relative">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20"></div>
    
    <div class="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
    <!-- Heading -->
    <div class="space-y-1">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Featured Collection</h2>
        <p class="text-base sm:text-lg text-slate-600">Handpicked books across all genres</p>
    </div>
    <!-- Filter + View All -->
    <div class="flex flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <!-- Category Select -->
        <div class="relative flex-1">
        <select v-model="selectedCategory" @change="filterBooksByCategory"
                class="appearance-none border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 hover:border-slate-400 transition-all duration-200 w-full">
            <option value="" class="bg-white text-slate-700">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.name" class="bg-white text-slate-700">
            {{ category.name }}
            </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </div>
        </div>
        <!-- View All Button -->
        <button @click="showFeaturedAll = true"
                class="text-sm text-blue-600 font-semibold hover:text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 w-auto">
        View All →
        </button>
    </div>
    </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div v-for="book in filteredBooks.slice(0, 5)" :key="book.id"
             class="group cursor-pointer bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-200 hover:border-blue-300"
             @click="openBookModal(book)">
          <div class="space-y-4">
            <div class="aspect-[3/4] overflow-hidden">
              <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                   :alt="`Cover of ${book.title}`" 
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- All Featured Books Modal -->
  <Teleport to="body">
    <div v-if="showFeaturedAll" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
         @click.self="showFeaturedAll = false">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-[95%] md:w-[60%] max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in border border-slate-200">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-3xl font-bold text-slate-900">Featured Collection</h3>
          <button @click="showFeaturedAll = false"
                  class="text-slate-600 hover:text-slate-900 text-2xl font-bold w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-200">
            ×
          </button>
        </div>
        <div class="overflow-y-auto max-h-[70vh] pr-4 no-scrollbar">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            <div v-for="book in filteredBooks" :key="book.id"
                 class="group cursor-pointer bg-white/80 backdrop-blur-sm overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
                 @click="openBookModal(book)">
              <div class="aspect-[3/4] overflow-hidden">
                <img :src="book.cover_image_url || '/placeholder.svg?height=400&width=300'"
                     :alt="`Cover of ${book.title}`" 
                     class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Book Details Modal -->
  <Teleport to="body">
    <div v-if="showBookModal" 
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
         @click.self="showBookModal = false">
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl animate-slide-in border border-slate-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900">Book Details</h2>
          <button @click="showBookModal = false"
                  class="text-slate-600 hover:text-slate-900 text-2xl font-bold w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-200">
            ×
          </button>
        </div>
        <!-- Modal Content -->
        <div class="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div class="flex flex-col lg:flex-row">
            <!-- Book Cover Section -->
            <div class="lg:w-2/5 p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
              <div class="sticky top-8">
                <div class="relative group max-w-sm mx-auto">
                  <div class="absolute -inset-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img :src="selectedBookForModal?.cover_image_url || '/placeholder.svg?height=600&width=400'"
                       :alt="`${selectedBookForModal?.title || 'Book'} Cover`"
                       class="relative w-full rounded-2xl shadow-2xl border-2 border-slate-200 group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <!-- Book Details Section -->
            <div class="lg:w-3/5 p-8 space-y-8">
              <!-- Title and Author -->
              <div class="space-y-4">
                <div class="text-sm text-slate-600 font-medium uppercase tracking-wider">
                  ISBN: {{ selectedBookForModal?.isbn || 'Not Available' }}
                </div>
                <h1 class="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {{ selectedBookForModal?.title || 'Book Title' }}
                </h1>
                <div class="flex flex-wrap gap-4 text-lg">
                  <p class="text-blue-600 font-semibold">
                    By {{ selectedBookForModal?.author?.name || selectedBookForModal?.authorName || 'Unknown Author' }}
                  </p>
                  <p class="text-slate-600">
                    Donated by {{ selectedBookForModal?.donated_by || 'Anonymous' }}
                  </p>
                </div>
              </div>
              <!-- Book Info Grid -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <span class="text-sm font-semibold text-slate-600 uppercase tracking-wider">Quantity</span>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 font-bold text-slate-900 border border-slate-200">
                    {{ selectedBookForModal?.quantity || 'N/A' }}
                  </div>
                </div>
                <div class="space-y-2">
                  <span class="text-sm font-semibold text-slate-600 uppercase tracking-wider">Published</span>
                  <div class="bg-slate-50 rounded-xl px-4 py-3 font-bold text-slate-900 border border-slate-200">
                    {{ selectedBookForModal?.public_year || 'Unknown' }}
                  </div>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4">
                <button class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {{ selectedBookForModal?.language?.name || 'Language' }}
                </button>
                <button class="flex-1 bg-slate-100 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 border border-slate-200">
                  {{ selectedBookForModal?.category?.name || 'Category' }}
                </button>
              </div>
              <!-- Description -->
              <div class="space-y-4 pt-6 border-t border-slate-200">
                <h3 class="text-xl font-bold text-slate-900">Description</h3>
                <div class="prose prose-slate max-w-none">
                  <p class="text-slate-700 leading-relaxed text-lg">
                    {{ selectedBookForModal?.description || 'No description available for this book. Discover what makes this title special by exploring its pages and joining the community of readers who have experienced its story.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Star } from 'lucide-vue-next';
import { getBooks, getAuthors, getCategories, getLanguages } from '@/services/Api/book';
import Swal from 'sweetalert2';

// Reactive state for modals and filters
const showAll = ref(false);
const showFeaturedAll = ref(false);
const showBookModal = ref(false);
const selectedCategory = ref('');
const selectedAuthor = ref('');
const selectedBook = ref(null);
const selectedBookForModal = ref(null);
const quantity = ref(1);

// Reactive state for data fetching
const books = ref([]);
const authors = ref([]);
const categories = ref([]);
const languages = ref([]);
const author = ref({ name: '', biography: '', profile_image_url: '' });
const reviews = ref([]);
const bookInventory = ref([]);
const featuredBooks = ref([]);

// Normalize author names to handle inconsistencies
const normalizeAuthorName = (name) => {
    if (!name) return '';
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
};

// Computed property for filtered books by category
const filteredBooks = computed(() => {
    if (!selectedCategory.value) {
        return featuredBooks.value;
    }
    return featuredBooks.value.filter(book =>
        book.category?.name?.toLowerCase() === selectedCategory.value.toLowerCase()
    );
});

// Computed property for filtered books by author
const filteredAuthorBooks = computed(() => {
    if (!selectedAuthor.value) {
        return books.value;
    }
    const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
    const filtered = books.value.filter(book => {
        const authorName = normalizeAuthorName(book.author?.name || book.authorName || '');
        return authorName === normalizedSelectedAuthor;
    });
    return filtered;
});

// Computed property for selected author details
const selectedAuthorDetails = computed(() => {
    if (!selectedAuthor.value) return { name: '', profile_image_url: '', readers: 0, biography: '', categories: [] };
    const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
    const author = authors.value.find(a => normalizeAuthorName(a.name) === normalizedSelectedAuthor);
    return author || { name: selectedAuthor.value, profile_image_url: '', readers: 0, biography: '', categories: [] };
});

// Fetch all necessary data from the API
const fetchBooks = async () => {
    try {
        const [booksRes, authorsRes, categoriesRes, languagesRes] = await Promise.all([
            getBooks(),
            getAuthors(),
            getCategories(),
            getLanguages(),
        ]);
        books.value = (booksRes.data.books || []).map(book => ({
            ...book,
            authorName: normalizeAuthorName(book.author?.name || book.authorName),
            author: book.author ? { ...book.author, name: normalizeAuthorName(book.author.name) } : book.author,
            cover_image_url: book.bookUrl || book.cover_image_url || '/placeholder.svg?height=400&width=300',
            description: book.description || 'No description available.',
            categories: book.categories || ['Unknown'],
            reviews: book.reviews || 0,
            isbn: book.isbn || 'Unknown',
            price: book.price || 14.99,
            tags: book.tags || ['Unknown'],
        }));
        
        authors.value = (authorsRes.data || []).map(author => ({
            ...author,
            name: normalizeAuthorName(author.name),
            profile_image_url: author.profile_image_url || '/placeholder.svg?height=40&width=40',
            readers: author.readers || 0,
            biography: author.biography || 'This author has not provided a biography yet.',
            categories: author.categories || ['Fiction', 'Adventure', 'Inspiration'],
        }));
        
        categories.value = categoriesRes.data || [];
        languages.value = languagesRes.data || [];
        localStorage.setItem('books', JSON.stringify(books.value));
        localStorage.setItem('authors', JSON.stringify(authors.value));
        localStorage.setItem('categories', JSON.stringify(categories.value));
        if (authors.value.length > 0) {
            author.value = authors.value[0];
            selectedAuthor.value = author.value.name;
            selectedBook.value = books.value.find(book =>
                normalizeAuthorName(book.author?.name || book.authorName) === normalizeAuthorName(author.value.name)
            ) || null;
        }
        featuredBooks.value = books.value.slice(0, 15).map(book => ({
            ...book,
            category: categories.value.find(cat => cat.id === book.CategoryId) || { name: 'Unknown' },
        }));
        bookInventory.value = books.value.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author || { name: book.authorName || 'Unknown' },
            qty: book.quantity || 0,
            lang: book.language || { name: 'Unknown' },
            available: book.available !== undefined ? book.available : true,
            coverUrl: book.cover_image_url,
        }));
    } catch (err) {
        console.error('Failed to fetch data:', err);
        const cachedBooks = localStorage.getItem('books');
        const cachedAuthors = localStorage.getItem('authors');
        const cachedCategories = localStorage.getItem('categories');
        if (cachedBooks) books.value = JSON.parse(cachedBooks);
        if (cachedAuthors) authors.value = JSON.parse(cachedAuthors);
        if (cachedCategories) categories.value = JSON.parse(cachedCategories);
        if (selectedAuthor.value && books.value.length > 0) {
            selectedBook.value = books.value.find(book =>
                normalizeAuthorName(book.author?.name || book.authorName) === normalizeAuthorName(selectedAuthor.value)
            ) || null;
        }
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: 'Failed to fetch data',
            text: 'Please try again later.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    }
};

// Open book details modal
const openBookModal = (book) => {
    selectedBookForModal.value = book;
    showBookModal.value = true;
    quantity.value = 1;
};

// Filter books by selected category
const filterBooksByCategory = () => {
    // Filtering is handled by the computed filteredBooks property
};

// Filter books by selected author
const filterBooksByAuthor = () => {
    if (selectedAuthor.value) {
        const normalizedSelectedAuthor = normalizeAuthorName(selectedAuthor.value);
        selectedBook.value = books.value.find(book =>
            normalizeAuthorName(book.author?.name || book.authorName) === normalizedSelectedAuthor
        ) || null;
    } else {
        selectedBook.value = books.value[0] || null;
    }
};

// Lifecycle hooks
onMounted(() => {
    fetchBooks();
});
</script>

<style scoped>
/* Hide scrollbar but keep scroll functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Enhanced animations and transitions */
.animate-slide-in {
    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideIn {
    from {
        transform: translateY(30px) scale(0.95);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

/* Custom scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 8px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Enhanced typography */
.first-letter\:text-5xl::first-letter {
    font-size: 3rem;
}
.first-letter\:font-bold::first-letter {
    font-weight: 700;
}
.first-letter\:text-blue-600::first-letter {
    color: #2563eb;
}
.first-letter\:float-left::first-letter {
    float: left;
}
.first-letter\:mr-3::first-letter {
    margin-right: 0.75rem;
}
.first-letter\:mt-1::first-letter {
    margin-top: 0.25rem;
}

/* Prose styling for description */
.prose {
    max-width: none;
}
.prose p {
    margin-bottom: 1rem;
}

/* Enhanced shadow utilities */
.shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .text-7xl {
        font-size: 3.5rem;
    }
    
    .text-6xl {
        font-size: 3rem;
    }
    
    .text-5xl {
        font-size: 2.5rem;
    }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>