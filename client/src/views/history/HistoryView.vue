<template>
  <div class="max-w-8xl mx-auto p-2 sm:p-4 lg:p-4 min-h-screen">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 lg:mb-8 bg-white rounded-xl p-4 sm:p-6 lg:p-6 shadow-sm border border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-blue-600 flex-shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div>
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Borrowing History
            </h1>
            <p class="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
              Browse and manage your library's borrowing records
            </p>
          </div>
        </div>
        <button @click="clearFilters"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 flex items-center text-sm font-medium w-full sm:w-auto justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Filters
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- Search and Filter Bar -->
      <div class="bg-white p-4 sm:p-5 lg:p-5 rounded-t-xl border-b border-gray-200">
        <div class="flex flex-col gap-4">
          <!-- Search Input -->
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 lg:pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Search by title or author..."
              class="w-full pl-10 sm:pl-12 lg:pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-white text-gray-700 text-sm sm:text-base lg:text-base" />
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div class="relative flex-1 min-w-[120px]">
              <select v-model="categoryFilter"
                class="appearance-none w-full pl-3 sm:pl-4 lg:pl-4 pr-8 sm:pr-10 lg:pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div class="relative flex-1 min-w-[120px]">
              <select v-model="userFilter"
                class="appearance-none w-full pl-3 sm:pl-4 lg:pl-4 pr-8 sm:pr-10 lg:pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200">
                <option value="">All Borrowers</option>
                <option v-for="borrower in borrowers" :key="borrower" :value="borrower">
                  {{ borrower }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div class="relative min-w-[80px]">
              <select v-model="itemsPerPage"
                class="appearance-none w-full pl-3 sm:pl-4 lg:pl-4 pr-8 sm:pr-10 lg:pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm sm:text-base lg:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200">
                <option :value="0">All</option>
                <option :value="10">10</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Book List -->
      <div v-if="!isLoading && paginatedBooks.length"
        class="bg-white shadow-sm overflow-hidden rounded-xl transition-all duration-300">
        <!-- Table Header - Hidden on mobile -->
        <div
          class="bg-gray-50 px-4 sm:px-6 lg:px-6 py-4 sm:py-5 lg:py-5 rounded-t-xl border-b border-gray-200 hidden sm:block">
          <div
            class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 text-sm sm:text-base lg:text-base font-semibold text-gray-700">
            <div class="col-span-5 sm:col-span-5 lg:col-span-5 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Book
            </div>
            <div class="col-span-2 sm:col-span-2 lg:col-span-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Borrower
            </div>
            <div class="col-span-2 sm:col-span-2 lg:col-span-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category
            </div>
            <div class="col-span-1 sm:col-span-2 lg:col-span-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Return Date
            </div>
            <div class="col-span-1 sm:col-span-1 lg:col-span-1 flex items-center justify-end">
              Actions
            </div>
          </div>
        </div>

        <!-- Book Items -->
        <div>
          <div v-for="(book, index) in paginatedBooks" :key="book.id" :class="[
            'transition-all duration-300 cursor-pointer hover:bg-gray-50 relative overflow-hidden group',
            index !== paginatedBooks.length - 1 ? 'border-b border-gray-100' : '',
          ]" @click="openBookDetails(book)">
            <!-- Mobile Card View -->
            <div class="sm:hidden px-4 py-4">
              <div class="flex items-start">
                <div class="w-16 h-20 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                  <img :src="book.book_image" :alt="book.title" class="w-full h-full object-cover" loading="lazy" />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-semibold text-gray-900 text-base truncate">
                        {{ book.title }}
                      </h3>
                      <p class="text-sm truncate">
                        <span class="text-green-600">by {{ book.author }}</span>
                      </p>
                    </div>
                    <button @click.stop="openDeleteBookModal(book)"
                      class="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 flex-shrink-0 ml-2"
                      title="Delete book history">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p class="text-xs text-gray-500">Borrower</p>
                      <p class="text-sm font-medium text-blue-700 truncate">
                        {{ book.borrower || "—" }}
                      </p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Category</p>
                      <div class="mt-1">
                        <span :class="[
                          'inline-block px-2 py-1 rounded-full text-xs font-medium',
                          getCategoryStyle(book.category),
                        ]">
                          {{ book.category }}
                        </span>
                      </div>
                    </div>
                    <div class="col-span-2">
                      <p class="text-xs text-gray-500">Return Date</p>
                      <p class="text-sm font-medium text-gray-700">
                        {{ formatDate(book.return_date) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden sm:block px-4 sm:px-6 lg:px-6 py-4 sm:py-5 lg:py-5">
              <div class="grid grid-cols-12 gap-2 sm:gap-4 lg:gap-4 items-center">
                <!-- Book Image and Title Combined -->
                <div class="col-span-5 sm:col-span-5 lg:col-span-5">
                  <div class="flex items-center">
                    <div class="w-12 h-16 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                      <img :src="book.book_image" :alt="book.title" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div class="ml-4 min-w-0">
                      <h3
                        class="font-semibold text-gray-900 mb-1 line-clamp-1 text-base sm:text-lg lg:text-lg group-hover:text-gray-900 transition-colors duration-200">
                        {{ book.title }}
                      </h3>
                      <p class="text-sm truncate">
                        <span class="text-green-600">{{ book.author }}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Borrower -->
                <div class="col-span-2 sm:col-span-2 lg:col-span-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                      <span class="text-xs font-semibold text-gray-700">
                        {{ book.borrower ? book.borrower.charAt(0).toUpperCase() : '—' }}
                      </span>
                    </div>
                    <p class="text-sm sm:text-base lg:text-base text-gray-700 truncate">
                      {{ book.borrower || "—" }}
                    </p>
                  </div>
                </div>

                <!-- Category Badge -->
                <div class="col-span-2 sm:col-span-2 lg:col-span-2">
                  <span class="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                    {{ book.category }}
                  </span>
                </div>

                <!-- Return Date -->
                <div class="col-span-1 sm:col-span-2 lg:col-span-2">
                  <div class="flex items-center">
                    <div class="p-1.5 rounded-lg bg-gray-100 mr-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p class="text-sm sm:text-base lg:text-base text-gray-700 truncate">
                      {{ formatDate(book.return_date) }}
                    </p>
                  </div>
                </div>

                <!-- Delete Button -->
                <div class="col-span-1 sm:col-span-1 lg:col-span-1 flex justify-end">
                  <button @click.stop="openDeleteBookModal(book)"
                    class="p-2 rounded-full text-red-600 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                    title="Delete book history">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List Footer -->
        <div
          class="bg-gray-50 px-4 sm:px-6 lg:px-6 py-3 sm:py-4 lg:py-4 rounded-b-xl border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p class="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            Showing {{ paginatedBooks.length }} of {{ filteredBooks.length }} books
          </p>
          <div class="flex space-x-2">
            <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
              class="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="currentPage = currentPage + 1" :disabled="paginatedBooks.length < itemsPerPage"
              class="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification for Success/Error -->
    <transition enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform translate-y-2" enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2">
      <div v-if="message" :class="[
        'fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl shadow-lg p-6',
        messageType === 'success'
          ? 'bg-white border-l-4 border-green-500 text-green-800'
          : 'bg-white border-l-4 border-red-500 text-red-800',
      ]">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              messageType === 'success' ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg v-if="messageType === 'success'" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <p class="font-semibold">
              {{ messageType === "success" ? "Success" : "Error" }}
            </p>
            <p class="text-sm mt-1">{{ message }}</p>
          </div>
          <button @click="clearMessage" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="isLoading"
      class="text-center py-12 sm:py-16 lg:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 font-medium">Loading books...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && !paginatedBooks.length"
      class="text-center py-12 sm:py-16 lg:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-lg text-gray-500 font-medium">
        No books found matching your filters
      </p>
      <button @click="clearFilters"
        class="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 text-sm font-medium">
        Clear all filters
      </button>
    </div>

    <!-- Book Details Modal -->
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="selectedBook" class="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 lg:p-4 z-50"
        @click="closeBookDetails">
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
          @click.stop>
          <div
            class="flex items-center justify-between p-4 sm:p-6 lg:p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-gray-700" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Book Details
            </h2>
            <button @click="closeBookDetails"
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-white hover:bg-gray-100 rounded-full p-1">
              <X class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <div class="p-4 sm:p-6 lg:p-6">
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-6">
              <div class="flex-shrink-0 mx-auto sm:mx-0">
                <div class="relative">
                  <img :src="selectedBook.book_image" :alt="selectedBook.title"
                    class="w-24 h-32 sm:w-32 sm:h-44 lg:w-40 lg:h-56 object-cover rounded-lg border border-gray-200 shadow-sm"
                    loading="lazy" />
                  <div class="absolute -top-2 -right-2">
                    <span :class="[
                      'inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold',
                      selectedBook.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]">
                      <span :class="[
                        'w-2 h-2 rounded-full mr-1',
                        selectedBook.isAvailable ? 'bg-green-500' : 'bg-red-500',
                      ]"></span>
                      {{ selectedBook.isAvailable ? "Available" : "Borrowed" }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex-1 text-center sm:text-left">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {{ selectedBook.title }}
                </h1>
                <p class="text-base sm:text-lg lg:text-lg text-gray-600 mb-4">
                  {{ selectedBook.author }}
                </p>
                <div class="mb-4 inline-block">
                  <span :class="[
                    'inline-block px-3 py-1.5 rounded-full text-sm font-medium',
                    getCategoryStyle(selectedBook.category),
                  ]">
                    {{ selectedBook.category }}
                  </span>
                </div>
                <div class="mb-6 sm:mb-8 lg:mb-8">
                  <h3
                    class="text-base sm:text-lg lg:text-lg font-semibold text-gray-900 mb-3 flex items-center justify-center sm:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Description
                  </h3>
                  <p class="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {{ selectedBook.description || "No description available" }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 sm:mt-8 lg:mt-8">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h3 class="text-base sm:text-lg lg:text-lg font-semibold text-gray-900 flex items-center">
                  <History class="w-5 h-5 mr-2 text-gray-700" />
                  Borrowing History
                </h3>
                <button v-if="selectedBook.borrowHistory.length > 0" @click="showDeleteAllModal = true"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200 self-start sm:self-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete All History
                </button>
              </div>

              <div v-if="selectedBook.borrowHistory.filter((record) => record.status === 'returned').length > 0"
                class="border rounded-lg overflow-hidden shadow-sm">
                <!-- Mobile Table -->
                <div class="sm:hidden">
                  <div
                    v-for="(record, index) in selectedBook.borrowHistory.filter((record) => record.status === 'returned')"
                    :key="index" class="p-4 border-b border-gray-200 last:border-b-0">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="text-xs text-gray-500">Borrower</p>
                        <p class="text-sm font-medium text-gray-900">{{ record.user.name }}</p>
                      </div>
                      <button @click="openDeleteModal(record, selectedBook.id)"
                        class="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div class="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p class="text-xs text-gray-500">Borrowed</p>
                        <p class="text-sm text-gray-700">{{ formatDate(record.borrow_date) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Returned</p>
                        <p class="text-sm text-gray-700">{{ formatDate(record.return_date) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Librarian</p>
                        <p class="text-sm text-gray-700">{{ record.librarian.name }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Status</p>
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg class="-ml-0.5 mr-1 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Returned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desktop Table -->
                <table class="w-full text-sm hidden sm:block">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Borrower
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Borrowed
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Returned
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Librarian
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="(record, index) in selectedBook.borrowHistory.filter(
                      (record) => record.status === 'returned'
                    )" :key="index" class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">
                        {{ record.user.name }}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-600">
                        {{ formatDate(record.borrow_date) }}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-600">
                        {{ formatDate(record.return_date) }}
                      </td>
                      <td class="px-4 py-3 text-sm text-gray-600">
                        {{ record.librarian.name }}
                      </td>
                      <td class="px-4 py-3">
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Returned
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <button @click="openDeleteModal(record, selectedBook.id)"
                          class="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-150">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-center py-6 sm:py-8 lg:py-8 bg-gray-50 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm text-gray-500">
                  No returned borrowing history available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm Delete Modal for Single Record -->
    <ConfirmDeleteModal v-if="showDeleteModal" @confirm="confirmDeleteRecord" @close="closeDeleteModal" />
    <!-- Confirm Delete Modal for All Records -->
    <ConfirmDeleteModal v-if="showDeleteAllModal" :isAllRecords="true" @confirm="confirmDeleteAllRecords"
      @close="showDeleteAllModal = false" />
    <!-- Confirm Delete Book Modal -->
    <ConfirmDeleteModal v-if="showDeleteBookModal" :isBook="true" :bookTitle="pendingDeleteBook?.title"
      @confirm="confirmDeleteBookHistory" @close="closeDeleteBookModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { History, X } from "lucide-vue-next";
import { getBorrows, deleteBorrow } from "@/services/Api/borrow";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";

const books = ref([]);
const selectedBook = ref(null);
const isLoading = ref(false);
const message = ref(null);
const messageType = ref(null);
const searchQuery = ref("");
const categoryFilter = ref("");
const userFilter = ref("");
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const showDeleteBookModal = ref(false);
const pendingDeleteRecord = ref(null);
const pendingDeleteBookId = ref(null);
const pendingDeleteBook = ref(null);

const paginatedBooks = computed(() => {
  if (itemsPerPage.value === 0) return filteredBooks.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBooks.value.slice(start, end);
});

// Available categories (derived dynamically from data)
const categories = computed(() => {
  const uniqueCategories = new Set(
    books.value.map((book) => book.category).filter((category) => category)
  );
  return [...uniqueCategories].sort();
});

// Available borrowers (derived from data)
const borrowers = computed(() => {
  const uniqueBorrowers = new Set(
    books.value.map((book) => book.borrower).filter((borrower) => borrower !== "—")
  );
  return [...uniqueBorrowers].sort();
});

// Transform API data into book-centric structure
const transformApiData = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.error("Invalid API data: Expected an array, got:", apiData);
    return [];
  }

  const bookMap = new Map();

  apiData.forEach((record) => {
    const bookId =
      record.book?.id ||
      record.id ||
      "unknown-" + Math.random().toString(36).substr(2, 9);

    const bookData = {
      id: bookId,
      title: record.book?.title || "Unknown Title",
      author: record.book?.author || "Unknown Author",
      category: record.book?.category || "Uncategorized",
      book_image: record.book?.cover_image || "https://via.placeholder.com/150",
      description: record.book?.description || "No description available",
      borrower: record.user?.name || "—",
      return_date: record.return_date || null,
      borrowHistory: [],
      isAvailable: true,
    };

    if (!bookMap.has(bookId)) {
      bookMap.set(bookId, bookData);
    }

    bookMap.get(bookId).borrowHistory.push({
      id: record.id, // Store record ID for deletion
      user: { name: record.user?.name || "Unknown" },
      borrow_date: record.borrow_date || null,
      return_date: record.return_date || null,
      librarian: { name: record.librarian?.name || "Unknown" },
      status: record.status || "unknown",
    });
  });

  const booksArray = Array.from(bookMap.values()).map((book) => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    book.isAvailable = !latestRecord || latestRecord.status === "returned";
    book.borrower = latestRecord ? latestRecord.user.name : "—";
    book.return_date = latestRecord ? latestRecord.return_date : null;
    return book;
  });

  console.log("Transformed Books:", booksArray);
  return booksArray;
};

// Mock data for fallback
const mockData = [
  {
    id: 1,
    book: {
      id: 101,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Fiction",
      cover_image: "https://via.placeholder.com/150",
      description: "A classic American novel"
    },
    user: { name: "John Doe" },
    borrow_date: "2023-01-15",
    return_date: "2023-02-15",
    librarian: { name: "Jane Smith" },
    status: "returned"
  },
  {
    id: 2,
    book: {
      id: 102,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Fiction",
      cover_image: "https://via.placeholder.com/150",
      description: "A novel about racial injustice"
    },
    user: { name: "Alice Johnson" },
    borrow_date: "2023-02-01",
    return_date: "2023-03-01",
    librarian: { name: "Bob Brown" },
    status: "returned"
  }
];

// Fetch borrowing records
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await getBorrows();
    console.log("API Response:", response.data);
    books.value = transformApiData(response.data);
    console.log("Books Loaded:", books.value.length);
    console.log("Filtered Books:", filteredBooks.value.length);
    assignCategoryColors();
  } catch (err) {
    message.value =
      "Failed to load borrowing data. Please check if the server is running.";
    messageType.value = "error";
    books.value = transformApiData(mockData);
    assignCategoryColors();
  } finally {
    isLoading.value = false;
  }
});

// Filtered books for search, filters, and only returned
const filteredBooks = computed(() => {
  let filtered = books.value;

  // Only include books with the latest record returned
  filtered = filtered.filter((book) => {
    const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
    return latestRecord && latestRecord.status === "returned";
  });

  // Apply search query filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter((book) => book.category === categoryFilter.value);
  }

  // Apply user filter
  if (userFilter.value) {
    filtered = filtered.filter((book) => book.borrower === userFilter.value);
  }

  return filtered;
});

// Clear filters
const clearFilters = () => {
  searchQuery.value = "";
  categoryFilter.value = "";
  userFilter.value = "";
  console.log("Filters cleared");
};

// Clear message
const clearMessage = () => {
  message.value = null;
  messageType.value = null;
};

// Modal controls
const openBookDetails = (book) => {
  selectedBook.value = book;
  document.body.style.overflow = "hidden";
};

const closeBookDetails = () => {
  selectedBook.value = null;
  document.body.style.overflow = "auto";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Open delete confirmation modal for single record
const openDeleteModal = (record, bookId) => {
  pendingDeleteRecord.value = record;
  pendingDeleteBookId.value = bookId;
  showDeleteModal.value = true;
};

// Close delete confirmation modal
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  pendingDeleteRecord.value = null;
  pendingDeleteBookId.value = null;
};

// Open delete confirmation modal for book
const openDeleteBookModal = (book) => {
  pendingDeleteBook.value = book;
  showDeleteBookModal.value = true;
};

// Close delete book confirmation modal
const closeDeleteBookModal = () => {
  showDeleteBookModal.value = false;
  pendingDeleteBook.value = null;
};

// Confirm delete single borrowing record
const confirmDeleteRecord = async () => {
  try {
    isLoading.value = true;
    message.value = null;
    messageType.value = null;

    await deleteBorrow(pendingDeleteRecord.value.id);

    message.value = "Borrowing record deleted successfully.";
    messageType.value = "success";

    // Update books state by removing the deleted record
    books.value = books.value.map((book) => {
      if (book.id === pendingDeleteBookId.value) {
        book.borrowHistory = book.borrowHistory.filter(
          (r) => r.id !== pendingDeleteRecord.value.id
        );

        const latestRecord = book.borrowHistory[book.borrowHistory.length - 1];
        book.isAvailable = !latestRecord || latestRecord.status === "returned";
        book.borrower = latestRecord ? latestRecord.user.name : "—";
        book.return_date = latestRecord ? latestRecord.return_date : null;
      }
      return book;
    });

    // If the deleted record was the only one, close the modal
    if (selectedBook.value && selectedBook.value.borrowHistory.length === 0) {
      closeBookDetails();
    }
  } catch (err) {
    message.value = "Failed to delete borrowing record. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
    closeDeleteModal();
  }
};

// Confirm delete all borrowing records
const confirmDeleteAllRecords = async () => {
  try {
    isLoading.value = true;
    message.value = null;
    messageType.value = null;

    // Get all record IDs for the selected book
    const recordIds = selectedBook.value.borrowHistory.map((record) => record.id);

    // Delete each record
    await Promise.all(recordIds.map((id) => deleteBorrow(id)));

    message.value = "All borrowing history deleted successfully.";
    messageType.value = "success";

    // Update books state by removing all borrow history for the book
    books.value = books.value.map((book) => {
      if (book.id === selectedBook.value.id) {
        book.borrowHistory = [];
        book.isAvailable = true;
        book.borrower = "—";
        book.return_date = null;
      }
      return book;
    });

    // Close the modal as the borrowing history is now empty
    closeBookDetails();
  } catch (err) {
    message.value = "Failed to delete borrowing history. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
    showDeleteAllModal.value = false;
  }
};

// Confirm delete book history
const confirmDeleteBookHistory = async () => {
  try {
    isLoading.value = true;
    message.value = null;
    messageType.value = null;

    // Get all record IDs for the selected book
    const recordIds = pendingDeleteBook.value.borrowHistory.map((record) => record.id);

    // Delete each record
    await Promise.all(recordIds.map((id) => deleteBorrow(id)));

    message.value = "Book borrowing history deleted successfully.";
    messageType.value = "success";

    // Update books state by removing all borrow history for the book
    books.value = books.value.map((book) => {
      if (book.id === pendingDeleteBook.value.id) {
        book.borrowHistory = [];
        book.isAvailable = true;
        book.borrower = "—";
        book.return_date = null;
      }
      return book;
    });

    // Close the modal
    closeDeleteBookModal();
  } catch (err) {
    message.value = "Failed to delete book borrowing history. Please try again.";
    messageType.value = "error";
  } finally {
    isLoading.value = false;
  }
};

const predefinedColors = [
  "bg-gray-100 text-gray-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-yellow-100 text-yellow-800",
];

const categoryColors = {};

// Assign colors to categories
const assignCategoryColors = () => {
  const uniqueCategories = [
    ...new Set(books.value.map((b) => b.category).filter(Boolean)),
  ];

  uniqueCategories.forEach((cat, index) => {
    categoryColors[cat.toLowerCase()] = predefinedColors[index % predefinedColors.length];
  });
};

// Updated getCategoryStyle
const getCategoryStyle = (category) => {
  if (!category) return "bg-gray-100 text-gray-800";
  return categoryColors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
};
</script>

<style scoped>
/* Ensure table scrolling is smooth */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar for modal */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Line clamp for text overflow */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Adjust modal for very small screens */
@media (max-width: 400px) {
  .text-xs {
    font-size: 0.65rem;
  }

  .text-sm {
    font-size: 0.75rem;
  }
}
</style>