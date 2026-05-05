<template>
  <div class="min-h-screen bg-gray-100 p-4 flex flex-col gap-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="max-w7xl mx-auto px-4 sm:px-10 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Authors</h1>
            <p class="text-gray-600 mt-2 text-base sm:text-lg">Manage your library's author collection</p>
          </div>
          <button @click="openAddDialog"
            class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-md"
            :disabled="isLoading">
            <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Author
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 pt-4 pb-4">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4">
        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
          <select v-model="selectedNationality"
            class="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-2 sm:py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-w-[160px] sm:min-w-[180px] transition-all duration-200">
            <option value="">All Nationalities</option>
            <option v-for="nation in nationalities" :key="nation" :value="nation">{{ nation }}</option>
          </select>

          <select v-model="viewMode" @change="onViewModeChange"
            class="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-2 sm:py-3 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200">
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>

        <!-- Search Bar -->
        <div class="w-full lg:w-96">
          <div class="relative">
            <svg
              class="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Search authors by name..."
              class="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200">
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class=" rounded-xl shadow-sm sm:shadow-md border border-transparent sm:border-gray-200  sm:px-6 py-4 transition-all duration-300 hover:shadow-none sm:hover:shadow-lg">
      <div class="flex flex-col lg:flex-row gap-6 sm:gap-8 px-4 pt-6 sm:pt-10 pb-10">
        <!-- Authors Grid/List -->
        <div class="flex-1">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div v-for="author in paginatedAuthors" :key="author.id"
              class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer group"
              @click="viewAuthorBooks(author)">

              <!-- Author Avatar -->
              <div
                class="flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 sm:mb-6 mx-auto group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300">
                <svg class="w-8 sm:w-10 h-8 sm:h-10 text-gray-600 group-hover:text-indigo-600" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <!-- Author Info -->
              <div class="text-center mb-4">
                <h3 class="font-semibold text-gray-900 text-lg sm:text-xl mb-2">{{ author.name }}</h3>
              </div>

              <!-- Stats -->
              <div class="flex justify-center mb-4">
                <div class="text-center">
                  <div class="text-2xl sm:text-3xl font-bold text-gray-900">{{ getAuthorBookCount(author.id) }}</div>
                  <div class="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium">Books Published
                  </div>
                </div>
              </div>

              <!-- Progress Indicator -->
              <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: Math.min(getAuthorBookCount(author.id) * 10, 100) + '%' }"></div>
              </div>

              <!-- Actions -->
              <div class="flex justify-center gap-3">
                <button @click.stop="editAuthor(author)"
                  class="p-2 sm:p-3 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  :disabled="isLoading">
                  <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click.stop="openDeleteConfirm(author.id)"
                  class="p-2 sm:p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  :disabled="isLoading">
                  <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination Controls for Grid View -->
          <div v-if="viewMode === 'grid' && totalPages > 1" class="mt-6 sm:mt-8 flex justify-center items-center gap-4">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              Previous
            </button>
            <span class="text-sm sm:text-base text-gray-600 font-medium px-4 sm:px-6">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              Next
            </button>
          </div>

          <!-- List View -->
          <div v-if="viewMode === 'list'" class="bg-white rounded-2xl shadow-md border border-gray-100">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Author
                  </th>
                  <th
                    class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Nationality
                  </th>
                  <th
                    class="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Books</th>
                  <th
                    class="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="author in paginatedAuthors" :key="author.id"
                  class="hover:bg-gray-50 cursor-pointer transition-all duration-200" @click="viewAuthorBooks(author)">
                  <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <svg class="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="ml-3 sm:ml-4">
                        <div class="text-sm sm:text-base font-semibold text-gray-900">{{ author.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-600">{{
                    author.nationality || 'Unknown' }}
                  </td>
                  <td
                    class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">
                    {{
                      getAuthorBookCount(author.id) }} books</td>
                  <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm sm:text-base font-medium">
                    <div class="relative inline-block">
                      <button @click.stop="toggleActionMenu(author.id)"
                        class="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                        :disabled="isLoading">
                        <svg class="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div v-if="activeActionMenu === author.id"
                        class="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 min-w-max">
                        <div class="py-1">
                          <button @click.stop="editAuthor(author)"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
                            :disabled="isLoading">
                            Edit
                          </button>
                          <button @click.stop="openDeleteConfirm(author.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                            :disabled="isLoading">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls for List View -->
          <div v-if="viewMode === 'list' && totalPages > 1" class="mt-6 sm:mt-8 flex justify-center items-center gap-4">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              Previous
            </button>
            <span class="text-sm sm:text-base text-gray-600 font-medium px-4 sm:px-6">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              Next
            </button>
          </div>
        </div>

        <!-- Sidebar Stats -->
        <div class="w-full lg:w-80 space-y-6">
          <!-- Overview Card -->
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l9-5-9-5-9 5 9 5z" />
              </svg>
              <div class="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-semibold">Overview</div>
            </div>
            <div class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Author Library</div>

            <!-- Circular Progress -->
            <div class="flex justify-center mb-4 sm:mb-6">
              <div class="relative w-24 sm:w-28 h-24 sm:h-28">
                <svg class="w-24 sm:w-28 h-24 sm:h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e2e8f0" stroke-width="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="url(#gradient)" stroke-width="8" fill="none"
                    stroke-linecap="round" :stroke-dasharray="251.2"
                    :stroke-dashoffset="251.2 - (authors.length / 100) * 251.2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#6366f1" />
                      <stop offset="100%" stop-color="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl sm:text-3xl font-bold text-gray-900">{{ authors.length }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Card -->
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div class="flex items-center gap-2 mb-4 sm:mb-5">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h11M9 21V3m12 7h-4m4 4h-4m-7 7v-4m0-4v-4" />
              </svg>
              <div class="text-lg sm:text-xl font-bold text-gray-900">Statistics</div>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <div class="bg-indigo-50 rounded-xl p-3 sm:p-4 flex items-center justify-between">
                <div>
                  <div class="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Books</div>
                  <div class="text-lg sm:text-xl font-bold text-gray-900">{{ totalBooks }}</div>
                </div>
                <svg class="w-5 sm:w-6 h-5 sm:h-6 text-indigo-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
                </svg>
              </div>
              <div class="bg-purple-50 rounded-xl p-3 sm:p-4 flex items-center justify-between">
                <div>
                  <div class="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-semibold">Authors</div>
                  <div class="text-lg sm:text-xl font-bold text-gray-900">{{ authors.length }}</div>
                </div>
                <svg class="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Actions Card -->
          <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div class="flex items-center gap-2 mb-4 sm:mb-5">
              <svg class="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <div class="text-lg sm:text-xl font-bold text-gray-900">Quick Actions</div>
            </div>
            <div class="space-y-3">
              <button @click="openAddDialog"
                class="w-full text-left px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 flex items-center gap-2"
                :disabled="isLoading">
                <svg class="w-4 sm:w-5 h-4 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Author
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Author Books Modal -->
    <div v-if="showBooksModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-100">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-8 py-4 sm:py-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl sm:text-2xl font-bold tracking-tight">{{ selectedAuthor?.name }}'s Books</h3>
              <p class="text-indigo-100 text-sm mt-2 font-medium">({{ authorBooks.length }} books)</p>
            </div>
            <button @click="closeBooksModal"
              class="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full p-2">
              <svg class="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content area -->
        <div class="p-4 sm:p-8 max-h-[calc(90vh-140px)] overflow-y-auto bg-gray-50/30">
          <!-- Empty state -->
          <div v-if="authorBooks.length === 0" class="text-center py-12 sm:py-16">
            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-20 sm:w-28 h-20 sm:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <svg class="w-10 sm:w-14 h-10 sm:h-14 text-indigo-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Books Found</h4>
            <p class="text-gray-500 max-w-md mx-auto text-sm sm:text-base">This author doesn't have any books in our
              collection yet.</p>
          </div>

          <!-- Books grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            <div v-for="book in authorBooks" :key="book.id"
              class="group bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-200 hover:-translate-y-1">
              <div class="flex items-start gap-3 sm:gap-4">
                <!-- Book cover -->
                <div
                  class="w-16 sm:w-20 h-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                  <img v-if="book.cover_image_url && book.cover_image_url !== ''" :src="book.cover_image_url"
                    :alt="book.title"
                    class="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError" />
                  <svg v-else class="w-8 sm:w-10 h-8 sm:h-10 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>

                <!-- Book details -->
                <div class="flex-1 min-w-0">
                  <h4
                    class="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {{ book.title }}
                  </h4>

                  <!-- Category badge -->
                  <span
                    class="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2 sm:mb-3">
                    {{ book.category?.name || 'Uncategorized' }}
                  </span>

                  <!-- Publication year -->
                  <div class="flex items-center text-xs sm:text-sm text-gray-500">
                    <svg class="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Published {{ book.public_year || 'Unknown' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Author Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900">{{ isEditing ? 'Edit Author' : 'Add New Author' }}</h3>
        </div>

        <form @submit.prevent="submitAuthor" class="p-4 sm:p-6 space-y-6">
          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Name</label>
            <input v-model="currentAuthor.name" type="text" required
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              :disabled="isLoading">
          </div>

          <div>
            <label class="block text-sm sm:text-base font-semibold text-gray-700 mb-2">Nationality</label>
            <input v-model="currentAuthor.nationality" type="text"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              :disabled="isLoading">
          </div>

          <div class="flex justify-end gap-4 pt-4 sm:pt-6">
            <button type="button" @click="closeAddEditDialog"
              class="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              :disabled="isLoading">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 font-medium">
              <span v-if="isLoading" class="animate-spin mr-2">⟳</span>
              {{ isEditing ? 'Update' : 'Add' }} Author
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
        <div class="text-center">
          <div
            class="w-12 sm:w-14 h-12 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <svg class="w-6 sm:w-7 h-6 sm:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Delete Author</h3>
          <p class="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Are you sure you want to delete this author? This
            action cannot be undone.</p>

          <div class="flex justify-center gap-4">
            <button @click="cancelDelete"
              class="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              :disabled="isLoading">
              Cancel
            </button>
            <button @click="confirmDelete"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              :disabled="isLoading">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification.visible" :class="[
      'fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 max-w-xs sm:max-w-sm rounded-xl shadow-lg border-l-4 p-3 sm:p-4',
      notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'
    ]">
      <div class="flex items-center gap-2 sm:gap-3">
        <svg v-if="notification.type === 'success'" class="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="w-4 sm:w-5 h-4 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p class="font-medium text-sm sm:text-base">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '@/services/Api/author';
import { getBooks } from '@/services/Api/book';

// Reactive data
const authors = ref([]);
const books = ref([]);
const searchQuery = ref('');
const selectedNationality = ref('');
const viewMode = ref('grid');
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = computed(() => viewMode.value === 'grid' ? 6 : 9); // 6 for grid, 9 for list

// Modal states
const showAddEditModal = ref(false);
const showDeleteConfirm = ref(false);
const showBooksModal = ref(false);
const isEditing = ref(false);
const activeActionMenu = ref(null); // Track which author's action menu is open

// Current data
const currentAuthor = ref({ id: null, name: '', nationality: '' });
const authorToDelete = ref(null);
const selectedAuthor = ref(null);

// Notification
const notification = ref({ visible: false, message: '', type: '' });

// Computed properties
const nationalities = computed(() => {
  const unique = [...new Set(authors.value.map(author => author.nationality).filter(n => n))];
  return unique.sort();
});

const filteredAuthors = computed(() => {
  let result = authors.value;

  if (selectedNationality.value) {
    result = result.filter(author => author.nationality === selectedNationality.value);
  }

  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase();
    result = result.filter(author =>
      author.name.toLowerCase().includes(keyword) ||
      (author.nationality && author.nationality.toLowerCase().includes(keyword))
    );
  }

  return result;
});

const paginatedAuthors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAuthors.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAuthors.value.length / itemsPerPage.value);
});

const totalBooks = computed(() => books.value.length);

const authorBooks = computed(() => {
  if (!selectedAuthor.value) return [];
  return books.value.filter(book => String(book.AuthorId) === String(selectedAuthor.value.id));
});

// Methods
const getAuthorBookCount = (authorId) => {
  return books.value.filter(book => String(book.AuthorId) === String(authorId)).length;
};

const fetchAuthors = async () => {
  try {
    isLoading.value = true;
    const res = await getAuthors();
    authors.value = res.data.map(author => ({
      ...author,
      nationality: author.nationality || 'N/A',
    }));
  } catch (err) {
    showNotification('Failed to fetch authors', 'error');
    console.error('Error fetching authors:', err);
  } finally {
    isLoading.value = false;
  }
};

const fetchBooks = async () => {
  try {
    isLoading.value = true;
    const res = await getBooks();
    books.value = (res.data.books || res.data).map(book => ({
      ...book,
      cover_image_url: book.cover_image_url && book.cover_image_url !== '' ? book.cover_image_url : null,
    }));
  } catch (err) {
    showNotification('Failed to fetch books', 'error');
    console.error('Error fetching books:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleImageError = (event) => {
  console.log('Image failed to load, switching to SVG fallback');
  event.target.style.display = 'none';
  const svg = event.target.nextElementSibling;
  if (svg) svg.style.display = 'block';
};

const viewAuthorBooks = async (author) => {
  selectedAuthor.value = author;
  if (books.value.length === 0) {
    await fetchBooks();
  }
  showBooksModal.value = true;
};

const closeBooksModal = () => {
  showBooksModal.value = false;
  selectedAuthor.value = null;
};

const openAddDialog = () => {
  currentAuthor.value = { id: null, name: '', nationality: '' };
  isEditing.value = false;
  showAddEditModal.value = true;
};

const editAuthor = (author) => {
  currentAuthor.value = {
    id: author.id,
    name: author.name,
    nationality: author.nationality || '',
  };
  isEditing.value = true;
  showAddEditModal.value = true;
  activeActionMenu.value = null; // Close the action menu
};

const closeAddEditDialog = () => {
  showAddEditModal.value = false;
  currentAuthor.value = { id: null, name: '', nationality: '' };
};

const submitAuthor = async () => {
  try {
    isLoading.value = true;
    const payload = {
      name: currentAuthor.value.name,
      nationality: currentAuthor.value.nationality || null,
    };

    if (isEditing.value) {
      await updateAuthor(currentAuthor.value.id, payload);
      showNotification('Author updated successfully', 'success');
      authors.value = authors.value.map(author =>
        String(author.id) === String(currentAuthor.value.id) ? { ...author, ...payload } : author
      );
    } else {
      const res = await createAuthor(payload);
      authors.value.push({ ...res.data, nationality: res.data.nationality || 'N/A' });
      showNotification('Author added successfully', 'success');
    }

    closeAddEditDialog();
  } catch (error) {
    showNotification(`Failed to ${isEditing.value ? 'update' : 'add'} author`, 'error');
    console.error('Failed to submit author:', error.response?.data || error);
  } finally {
    isLoading.value = false;
  }
};

const openDeleteConfirm = (id) => {
  authorToDelete.value = id;
  showDeleteConfirm.value = true;
  activeActionMenu.value = null; // Close the action menu
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  authorToDelete.value = null;
};

const confirmDelete = async () => {
  try {
    isLoading.value = true;
    const authorBooksCount = getAuthorBookCount(authorToDelete.value);
    if (authorBooksCount > 0) {
      showNotification('Cannot delete author with associated books', 'error');
      return;
    }
    await deleteAuthor(authorToDelete.value);
    authors.value = authors.value.filter(author => String(author.id) !== String(authorToDelete.value));
    showNotification('Author deleted successfully', 'success');
    // Adjust currentPage if necessary after deletion
    if (currentPage.value > totalPages.value && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    showNotification('Failed to delete author', 'error');
    console.error('Failed to delete author:', error);
  } finally {
    isLoading.value = false;
    showDeleteConfirm.value = false;
    authorToDelete.value = null;
  }
};

const toggleActionMenu = (authorId) => {
  activeActionMenu.value = activeActionMenu.value === authorId ? null : authorId;
};

const closeActionMenu = (event) => {
  if (activeActionMenu.value !== null && !event.target.closest('.action-menu')) {
    activeActionMenu.value = null;
  }
};

const showNotification = (message, type) => {
  notification.value = { visible: true, message, type };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3000);
};

const onViewModeChange = () => {
  currentPage.value = 1; // Reset to page 1 when switching view modes
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// ESC Key Handler
const handleEsc = (event) => {
  if (event.key === 'Escape') {
    if (showBooksModal.value) {
      closeBooksModal();
    } else if (showAddEditModal.value) {
      closeAddEditDialog();
    } else if (showDeleteConfirm.value) {
      cancelDelete();
    } else if (activeActionMenu.value !== null) {
      activeActionMenu.value = null; // Close any open action menu
    }
  }
};

// Lifecycle Hooks
onMounted(() => {
  console.log('Component mounted, viewMode:', viewMode.value);
  console.log('Checking localStorage for viewMode:', localStorage.getItem('viewMode'));
  viewMode.value = 'grid'; // Force grid view on mount
  console.log('viewMode set to:', viewMode.value);
  fetchAuthors();
  fetchBooks();
  window.addEventListener('keydown', handleEsc);
  document.addEventListener('click', closeActionMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc);
  document.removeEventListener('click', closeActionMenu);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.group:hover .group-hover\:text-indigo-600 {
  color: #4f46e5;
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Ensure action menu doesn't overflow on small screens */
.action-menu {
  max-width: 100%;
  right: 0;
}

/* Responsive adjustments for action menu */
@media (max-width: 640px) {
  .action-menu {
    width: 36vw;
    /* Adjust width for smaller screens */
    right: 0;
  }
}
</style>