<template>
  <div class="bg-gray-100">
    <div class="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4 py-4 space-y-5">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-600 rounded-lg">
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Book Categories</h1>
              <p class="text-gray-500 text-sm mt-1">
                Organize and manage your book inventory
              </p>
            </div>
          </div>
          <button
            @click="openAddDialog"
            class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Category</span>
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-blue-600 rounded-lg">
              <svg
                class="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ stats.totalCategories }}
              </div>
              <p class="text-sm text-gray-500 mt-1">Total Categories</p>
            </div>
          </div>
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 rounded-full bg-blue-600 transition-all duration-300"
              :style="{ width: Math.min((stats.totalCategories / 50) * 100, 100) + '%' }"
            ></div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-blue-500 rounded-lg">
              <svg
                class="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2m5 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2"
                />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">{{ stats.totalItems }}</div>
              <p class="text-sm text-gray-500 mt-1">Total Items</p>
            </div>
          </div>
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 rounded-full bg-blue-500 transition-all duration-300"
              :style="{ width: Math.min((stats.totalItems / 500) * 100, 100) + '%' }"
            ></div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-purple-500 rounded-lg">
              <svg
                class="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ stats.avgItemsPerCategory }}
              </div>
              <p class="text-sm text-gray-500 mt-1">Avg per Category</p>
            </div>
          </div>
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 rounded-full bg-purple-500 transition-all duration-300"
              :style="{
                width: Math.min((stats.avgItemsPerCategory / 100) * 100, 100) + '%',
              }"
            ></div>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-2.5 bg-amber-500 rounded-lg">
              <svg
                class="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ stats.lowStockCategories }}
              </div>
              <p class="text-sm text-gray-500 mt-1">Low Stock Alert</p>
            </div>
          </div>
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 rounded-full bg-amber-500 transition-all duration-300"
              :style="{
                width: Math.min((stats.lowStockCategories / 20) * 100, 100) + '%',
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Controls and Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <!-- Search and controls -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="relative flex-1 max-w-md">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search categories..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
              />
            </div>
            <div class="flex items-center gap-3">
              <label class="text-gray-600 text-sm font-medium">Show:</label>
              <select
                v-model="perPage"
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Responsive Table Container -->
        <div v-if="paginatedCategories.length > 0" class="overflow-x-auto">
          <!-- Mobile Card View -->
          <div class="sm:hidden divide-y divide-gray-200">
            <div
              v-for="(category, index) in paginatedCategories"
              :key="category.id"
              class="p-4 hover:bg-gray-50 transition duration-200"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-600 rounded-lg">
                    <svg
                      class="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ category.name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      #{{ String(index + 1).padStart(3, "0") }}
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    :class="getStockStatusClass(category.qty)"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    <span
                      class="w-2 h-2 rounded-full mr-1.5"
                      :class="getStockStatusDot(category.qty)"
                    ></span>
                    {{ getStockStatusLabel(category.qty) }}
                  </span>
                </div>
              </div>

              <p
                v-if="category.description"
                class="text-sm text-gray-600 mb-3 line-clamp-2"
              >
                {{ category.description }}
              </p>
              <p v-else class="text-sm text-gray-400 italic mb-3">No description</p>

              <div class="flex justify-between items-center">
                <div class="text-sm">
                  <span class="text-gray-600">Quantity:</span>
                  <span class="font-medium text-gray-900 ml-1">{{ category.qty }}</span>
                </div>

                <div class="relative">
                  <button
                    @click.stop="toggleActionMenu(category.id)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
                  >
                    <svg
                      class="h-5 w-5 text-gray-500 hover:text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                      />
                    </svg>
                  </button>
                  <div
                    v-if="activeActionMenu === category.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 divide-y divide-gray-100"
                  >
                    <button
                      @click="viewCategory(category)"
                      class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <svg
                        class="h-4 w-4 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Details
                    </button>
                    <button
                      @click="openEditDialog(category)"
                      class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                    >
                      <svg
                        class="h-4 w-4 mr-2 text-blue-600"
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
                      Edit Category
                    </button>
                    <button
                      @click="openDeleteDialog(category.id)"
                      class="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                    >
                      <svg
                        class="h-4 w-4 mr-2"
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
                      Delete Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Desktop Table View -->
        <table class="min-w-full divide-y divide-gray-200 hidden sm:table">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                #
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="(category, index) in paginatedCategories"
              :key="category.id"
              class="hover:bg-gray-50 transition duration-200"
            >
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-medium text-gray-900">
                  {{ index + 1 }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-600 rounded-lg">
                    <svg
                      class="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ category.name }}
                    </div>
                    <div class="text-xs text-gray-500">Category Item</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p v-if="category.description" class="text-sm text-gray-600 line-clamp-2">
                  {{ category.description }}
                </p>
                <p v-else class="text-sm text-gray-400 italic">No description</p>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="text-sm font-medium text-gray-900">{{ category.qty }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="getStockStatusClass(category.qty)"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <span
                    class="w-2 h-2 rounded-full mr-1.5"
                    :class="getStockStatusDot(category.qty)"
                  ></span>
                  {{ getStockStatusLabel(category.qty) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center relative">
                <button
                  @click.stop="toggleActionMenu(category.id)"
                  class="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  <svg
                    class="h-5 w-5 text-gray-500 hover:text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M10 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                    />
                  </svg>
                </button>
                <div
                  v-if="activeActionMenu === category.id"
                  class="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 divide-y divide-gray-100"
                >
                  <button
                    @click="viewCategory(category)"
                    class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <svg
                      class="h-4 w-4 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                  <button
                    @click="openEditDialog(category)"
                    class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    <svg
                      class="h-4 w-4 mr-2 text-blue-600"
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
                    Edit Category
                  </button>
                  <button
                    @click="openDeleteDialog(category.id)"
                    class="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                  >
                    <svg
                      class="h-4 w-4 mr-2"
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
                    Delete Category
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-blue-600 rounded-lg">
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="!isEditing"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ isEditing ? "Edit Category" : "Create New Category" }}
              </h3>
              <p class="text-gray-500 text-sm mt-1">
                {{ isEditing ? "Update category details" : "Add a new category" }}
              </p>
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Category Name <span class="text-red-500">*</span></label
              >
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter category name"
                class="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                required
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                placeholder="Enter category description (optional)"
                class="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label for="qty" class="block text-sm font-medium text-gray-700"
                >Initial Quantity <span class="text-red-500">*</span></label
              >
              <input
                id="qty"
                v-model.number="form.qty"
                type="number"
                min="0"
                placeholder="0"
                class="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                disabled
                required
              />
            </div>
            <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                {{ isEditing ? "Update Category" : "Create Category" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Modal -->
      <div
        v-if="showViewModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="p-3 bg-blue-600 rounded-lg">
              <svg
                class="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Category Details</h3>
              <p class="text-gray-500 text-sm mt-1">View category information</p>
            </div>
          </div>
          <div v-if="viewedCategory" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-600">Category ID</label>
                <span class="mt-1 text-sm font-medium text-gray-900"
                  >#{{ String(viewedCategory.id).padStart(3, "0") }}</span
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">Status</label>
                <span
                  :class="getStockStatusClass(viewedCategory.qty)"
                  class="inline-flex items-center mt-1 px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <span
                    class="w-2 h-2 rounded-full mr-1.5"
                    :class="getStockStatusDot(viewedCategory.qty)"
                  ></span>
                  {{ getStockStatusLabel(viewedCategory.qty) }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Category Name</label>
              <p class="mt-1 text-sm font-medium text-gray-900">
                {{ viewedCategory.name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600">Description</label>
              <p
                class="mt-1 text-sm text-gray-600"
                :class="{ 'italic text-gray-400': !viewedCategory.description }"
              >
                {{ viewedCategory.description || "No description provided" }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"
                >Current Quantity</label
              >
              <div class="flex items-center gap-4 mt-2">
                <span class="text-lg font-semibold text-gray-900">{{
                  viewedCategory.qty
                }}</span>
                <div class="flex-1">
                  <div class="h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      :style="{
                        width: Math.min((viewedCategory.qty / 100) * 100, 100) + '%',
                      }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Inventory Level</p>
                </div>
              </div>
            </div>
            <div class="flex justify-end pt-6 border-t border-gray-200">
              <button
                @click="closeViewModal"
                class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmDialog
        v-if="showConfirmDialog"
        :isAllRecords="false"
        @confirm="confirmDelete"
        @close="closeDeleteDialog"
      />

      <!-- Notification Toast -->
      <transition name="fade">
        <div
          v-if="message"
          :class="[
            'fixed bottom-6 right-6 z-50 w-full max-w-sm flex items-start justify-between gap-4 px-5 py-4 rounded-lg shadow-xl border-l-4',
            messageType === 'success'
              ? 'bg-green-100 border-green-600 text-green-700'
              : 'bg-red-50 border-red-600 text-red-700',
          ]"
        >
          <div class="mt-1">
            <svg
              v-if="messageType === 'success'"
              class="w-6 h-6 text-green-600"
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
            <svg
              v-else
              class="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold">
              {{ messageType === "success" ? "Success" : "Error" }}
            </p>
            <p class="text-sm">{{ message }}</p>
          </div>
          <button
            @click="message = ''"
            class="text-xl font-bold leading-none hover:opacity-60 text-gray-400"
          >
            &times;
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import {
  getCategory,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from "@/services/Api/category";
import ConfirmDialog from "./ConfirmDialog.vue";

const message = ref("");
const messageType = ref("success");
// Reactive data
const categories = ref([]);
const searchQuery = ref("");
const perPage = ref("10");
const showModal = ref(false);
const showViewModal = ref(false);
const showConfirmDialog = ref(false);
const isEditing = ref(false);
const activeActionMenu = ref(null);
const editId = ref(null);
const viewedCategory = ref(null);
const form = ref({
  name: "",
  description: "",
  qty: 0,
});
const deleteCategoryId = ref(null);

// Fetch categories from API
async function fetchCategories() {
  try {
    const res = await getCategory();
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

onMounted(() => {
  fetchCategories();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Handle click outside to close action menu
function handleClickOutside(event) {
  const menu = event.target.closest(".absolute.right-6.mt-2");
  if (!menu) {
    activeActionMenu.value = null;
  }
}

// Computed properties
const filteredCategories = computed(() =>
  categories.value.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const paginatedCategories = computed(() =>
  filteredCategories.value.slice(0, parseInt(perPage.value))
);

const stats = computed(() => {
  const totalCategories = categories.value.length;
  const totalItems = categories.value.reduce((sum, cat) => sum + cat.qty, 0);
  const avgItemsPerCategory =
    totalCategories > 0 ? Math.round(totalItems / totalCategories) : 0;
  const lowStockCategories = categories.value.filter((cat) => cat.qty < 10).length;

  return {
    totalCategories,
    totalItems,
    avgItemsPerCategory,
    lowStockCategories,
  };
});

// API-integrated Methods
async function submitNewCategory() {
  const exists = categories.value.some(
    (cat) => cat.name.trim().toLowerCase() === form.value.name.trim().toLowerCase()
  );

  if (exists) {
    showToast("Category name already exists.", "error");
    return;
  }

  try {
    const response = await apiCreateCategory(form.value);
    categories.value.push(response.data); // assuming API returns the created object
    closeModal();
    showToast("Category created successfully.", "success");
  } catch (err) {
    console.error("Create failed:", err);
    showToast("Failed to create category.", "error");
  }
}

async function updateCategory() {
  try {
    const response = await apiUpdateCategory(editId.value, form.value);
    const index = categories.value.findIndex((c) => c.id === editId.value);
    if (index !== -1) {
      categories.value[index] = response.data;
    }
    closeModal();
    showToast("Category updated successfully.", "success");
  } catch (err) {
    console.error("Update failed:", err);
    showToast("Failed to update category.", "error");
  }
}

async function deleteCategory(id) {
  try {
    await apiDeleteCategory(id);
    categories.value = categories.value.filter((c) => c.id !== id);
    showToast("Category deleted successfully.", "success");
  } catch (err) {
    console.error("Delete failed:", err);
    showToast("Failed to delete category.", "error");
  }
}

function openDeleteDialog(id) {
  deleteCategoryId.value = id;
  showConfirmDialog.value = true;
  activeActionMenu.value = null;
}

async function confirmDelete() {
  if (deleteCategoryId.value) {
    await deleteCategory(deleteCategoryId.value);
    showConfirmDialog.value = false;
    deleteCategoryId.value = null;
  }
}

function closeDeleteDialog() {
  showConfirmDialog.value = false;
  deleteCategoryId.value = null;
}

function showToast(msg, type = "success") {
  message.value = msg;
  messageType.value = type;

  // Auto dismiss after 3 seconds
  setTimeout(() => {
    message.value = "";
  }, 3000);
}

// UI Handling
function openAddDialog() {
  showModal.value = true;
  isEditing.value = false;
  editId.value = null;
  form.value = { name: "", description: "", qty: 0 };
}

function openEditDialog(category) {
  showModal.value = true;
  isEditing.value = true;
  editId.value = category.id;
  form.value = { ...category };
  activeActionMenu.value = null;
}

function closeModal() {
  showModal.value = false;
  form.value = { name: "", description: "", qty: 0 };
  editId.value = null;
  isEditing.value = false;
}

function viewCategory(category) {
  viewedCategory.value = { ...category };
  showViewModal.value = true;
  activeActionMenu.value = null;
}

function closeViewModal() {
  viewedCategory.value = null;
  showViewModal.value = false;
}

function toggleActionMenu(id) {
  activeActionMenu.value = activeActionMenu.value === id ? null : id;
}

function handleSubmit() {
  if (isEditing.value) {
    updateCategory();
  } else {
    submitNewCategory();
  }
}

// Stock Status Utilities
function getStockStatusLabel(qty) {
  if (qty === 0) return "Out of Stock";
  if (qty < 10) return "Low Stock";
  if (qty < 50) return "In Stock";
  return "High Stock";
}

function getStockStatusClass(qty) {
  if (qty === 0) return "bg-red-100 text-red-800";
  if (qty < 10) return "bg-amber-100 text-amber-800";
  if (qty < 50) return "bg-green-100 text-green-800";
  return "bg-blue-100 text-blue-800";
}

function getStockStatusDot(qty) {
  if (qty === 0) return "bg-red-500";
  if (qty < 10) return "bg-amber-500";
  if (qty < 50) return "bg-green-500";
  return "bg-blue-500";
}
</script>
