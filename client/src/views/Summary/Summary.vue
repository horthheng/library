<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Professional Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Reading Summaries</h1>
        <p class="text-gray-600">Manage and review student reading assignments</p>
      </div>

      <!-- Enhanced Search and Filter Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <!-- Search Input -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Search by student name"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Year Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Show In Year</label>
            <select v-model="selectedYear"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">Years</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Month Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Show In Month</label>
            <select v-model="selectedMonth"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">Months</option>
              <option v-for="month in availableMonths" :key="month" :value="month">
                {{ month }}
              </option>
            </select>
          </div>

          <!-- Class Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Show In Class</label>
            <select v-model="selectedClass"
              class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">Classes</option>
              <option v-for="cls in availableClasses" :key="cls" :value="cls">
                {{ cls }}
              </option>
            </select>
          </div>
        </div>

        <!-- Sort Buttons -->
        <div class="flex flex-wrap gap-3">
          <button @click="sortBy('Student_Name')"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': sortKey === 'Student_Name' }">
            Sort by Name
            <span v-if="sortKey === 'Student_Name'" class="ml-2">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button @click="sortBy('Book_Title')"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': sortKey === 'Book_Title' }">
            Sort by Book
            <span v-if="sortKey === 'Book_Title'" class="ml-2">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
          <button @click="sortBy('Student_Year')"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 'bg-blue-50 border-blue-300 text-blue-700': sortKey === 'Student_Year' }">
            Sort by Year
            <span v-if="sortKey === 'Student_Year'" class="ml-2">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Professional Table -->
      <div v-if="filteredSummaries.length" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Book Title
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Label</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in paginatedSummaries" :key="item.id"
                class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  PNC - {{ item.Student_ID }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.Student_Name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.Student_Class }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ item.Student_Year }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div class="truncate" :title="item.Book_Title">
                    {{ item.Book_Title }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {{ item.Book_Label }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                  <button @click.stop="toggleDropdown(item.id)"
                    class="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z">
                      </path>
                    </svg>
                  </button>
                  <div v-if="activeDropdown === item.id"
                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button @click.stop="openDetailsModal(item)"
                      class="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors">
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
                      </svg>
                      View Details
                    </button>
                    <button @click.stop="confirmDelete(item.id)"
                      class="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 focus:outline-none transition-colors">
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>
          <!-- Pagination -->
          <div v-if="filteredSummaries.length" class="mt-6 bg-white  shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="text-sm text-gray-600">
                Showing {{ paginatedSummaries.length }} of {{ filteredSummaries.length }} summaries
              </div>
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700">Items per page:</label>
                <select v-model="itemsPerPage"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option v-for="size in [25, 50, 75, 100, 125, 150]" :key="size" :value="size">
                    {{ size }}
                  </option>
                </select>
                <div class="flex gap-2">
                  <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50">
                    Previous
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50">
                    Next
                  </button>
                </div>
                <span class="text-sm text-gray-600">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Loading State -->
      <div v-else-if="isLoading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent">
          </div>
          <p class="mt-4 text-lg text-gray-600">Loading summaries...</p>
        </div>
      </div>

      <!-- Enhanced Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-red-200 p-12">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <p class="text-lg text-red-600 mb-4">{{ error }}</p>
          <button @click="fetchSummary"
            class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
            Try Again
          </button>
        </div>
      </div>

      <!-- Enhanced Empty State -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
          </div>
          <p class="text-lg text-gray-600">No summaries found</p>
          <p class="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      </div>

      <!-- Enhanced Details Modal -->
      <div v-if="selectedSummary" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 "
        @click="closeDetailsModal">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar" @click.stop>
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Summary Details</h2>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p class="text-gray-900">PNC - {{ selectedSummary.Student_ID }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <p class="text-gray-900">{{ selectedSummary.Student_Name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {{ selectedSummary.Student_Class }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {{ selectedSummary.Student_Year }}
                </span>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                <p class="text-gray-900">{{ selectedSummary.Book_Title }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Book Label</label>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {{ selectedSummary.Book_Label }}
                </span>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p class="text-gray-900">{{ formatDate(selectedSummary.createdAt) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Summary</label>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-gray-900 leading-relaxed">{{ selectedSummary.Summary }}</p>
              </div>
            </div>
          </div>
          <div class="p-6 border-t border-gray-200 flex justify-end">
            <button @click="closeDetailsModal"
              class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="closeDeleteConfirm">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full" @click.stop>
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
                  </path>
                </svg>
              </div>
            </div>
            <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Confirm Delete</h2>
            <p class="text-gray-600 text-center mb-6">Are you sure you want to delete this summary? This action cannot
              be undone.</p>
            <div class="flex gap-3">
              <button @click="closeDeleteConfirm"
                class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                Cancel
              </button>
              <button @click="deleteSummaryItem"
                class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getSummary, deleteSummary } from '@/services/Api/summary';

// Data and state
const summary = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const selectedYear = ref('');
const selectedMonth = ref('');
const selectedClass = ref('');
const sortKey = ref('Student_Name');
const sortOrder = ref('asc');
const selectedSummary = ref(null);
const activeDropdown = ref(null);
const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(25);

// Fetch data
const fetchSummary = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getSummary();
    summary.value = response.data.summaries || response.data;
  } catch (err) {
    error.value = 'Failed to load summaries. Please try again.';
    console.error('Error fetching summary:', err);
  } finally {
    isLoading.value = false;
  }
};

// Get unique years, months, and classes for filter dropdowns
const availableYears = computed(() => {
  const years = [...new Set(summary.value.map(item => item.Student_Year))];
  return years.sort();
});

const availableMonths = computed(() => {
  const months = [...new Set(summary.value.map(item => {
    const date = new Date(item.createdAt);
    return date.toLocaleString('en-US', { month: 'short' });
  }))].filter(month => month); // Filter out undefined/null
  return months.sort();
});

const availableClasses = computed(() => {
  const classes = [...new Set(summary.value.map(item => item.Student_Class))];
  return classes.sort();
});

// Enhanced computed property for filtered and sorted summaries
const filteredSummaries = computed(() => {
  let result = [...summary.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.Student_Name.toLowerCase().includes(query) ||
        item.Book_Title.toLowerCase().includes(query)
    );
  }

  // Filter by year
  if (selectedYear.value) {
    result = result.filter(item => item.Student_Year === selectedYear.value);
  }

  // Filter by month
  if (selectedMonth.value) {
    result = result.filter(item => {
      const date = new Date(item.createdAt);
      return date.toLocaleString('en-US', { month: 'short' }) === selectedMonth.value;
    });
  }

  // Filter by class
  if (selectedClass.value) {
    result = result.filter(item => item.Student_Class === selectedClass.value);
  }

  // Sort by key and order
  result.sort((a, b) => {
    const valueA = a[sortKey.value];
    const valueB = b[sortKey.value];
    if (typeof valueA === 'string') {
      return sortOrder.value === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA;
  });

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredSummaries.value.length / itemsPerPage.value));
const paginatedSummaries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSummaries.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Reset to page 1 when filters or items per page change
watch([searchQuery, selectedYear, selectedMonth, selectedClass, itemsPerPage], () => {
  currentPage.value = 1;
});

// Toggle sort order or set new sort key
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

// Dropdown and Modal functions
const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const openDetailsModal = (item) => {
  selectedSummary.value = item;
  activeDropdown.value = null;
};

const closeDetailsModal = () => {
  selectedSummary.value = null;
};

// Delete functions
const confirmDelete = (id) => {
  itemToDelete.value = id;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
};

const deleteSummaryItem = async () => {
  if (!itemToDelete.value) return;
  try {
    await deleteSummary(itemToDelete.value);
    summary.value = summary.value.filter(item => item.id !== itemToDelete.value);
    closeDeleteConfirm();
    // Adjust page if current page becomes empty
    if (paginatedSummaries.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (err) {
    error.value = 'Failed to delete summary. Please try again.';
    console.error('Error deleting summary:', err);
  }
};

// Close dropdown and modal on outside click
const handleClickOutside = (event) => {
  if (!event.target.closest('button[role="menu"]') && !event.target.closest('.modal-content')) {
    activeDropdown.value = null;
    selectedSummary.value = null;
    showDeleteConfirm.value = false;
  }
};

// Format date to "Mon, Day, Year"
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}, ${day}, ${year}`;
};

onMounted(() => {
  fetchSummary();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Hide scrollbar for all browsers */
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}


/* Enhanced transitions and animations */
tr {
  transition: all 0.2s ease-in-out;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>