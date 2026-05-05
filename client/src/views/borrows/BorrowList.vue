<template>
  <div class="bg-gray-100">
    <div class="p-4">
      <HeaderSection v-model:search="search" />
      <StatsCards :borrow-data="borrowData" :get-item-status="getItemStatus" />
      <BorrowTable
        :filtered-borrow-data="filteredBorrowData"
        :categories="categories"
        :current-page="currentPage"
        :limit="limit"
        :limit-options="limitOptions"
        :selected-status="selectedStatus"
        :selected-category="selectedCategory"
        :total-filtered-items="totalFilteredItems"
        :total-pages="totalPages"
        :open-dropdown="openDropdown"
        :get-item-status="getItemStatus"
        :format-date="formatDate"
        @update:current-page="currentPage = $event"
        @update:limit="limit = $event"
        @update:selected-status="updateSelectedStatus($event)"
        @update:selected-category="selectedCategory = $event"
        @toggle-dropdown="toggleDropdown"
        @show-book="handleShow"
        @confirm-return="confirmReturn"
        @update-record="openUpdateModal"
        @delete-record="handleDelete"
        @add-borrow="showModal = true"
        @exportBorrowDataToExcel="exportBorrowDataToExcel"
        @exportBorrowDataToPDF="exportBorrowDataToPDF"
      />
      <BookDetailModal
        v-if="showBookDetail"
        :book="selectedBook"
        :get-item-status="getItemStatus"
        :get-days-left="getDaysLeft"
        :format-date="formatDate"
        @close="showBookDetail = false"
      />
      <AddBorrowModal
        v-if="showModal"
        v-model="addForm"
        @submit="submitAddBorrow"
        @close="showModal = false"
      />
      <UpdateBorrowModal
        v-if="showUpdateModal"
        :form="updateForm"
        :statusOptions="statusOptions"
        :formError="formError"
        @submit="submitUpdate"
        @close="closeUpdateModal"
      />
      <ConfirmModal
        v-if="showConfirmModal"
        @confirm="handleConfirmReturn"
        @close="showConfirmModal = false"
      />
      <ToastNotification
        v-if="message"
        :message="message"
        :message-type="messageType"
        @close="message = ''"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderSection from "./HeaderSection.vue";
import StatsCards from "./StatsCards.vue";
import BorrowTable from "./BorrowTable.vue";
import BookDetailModal from "./BookDetailModal.vue";
import AddBorrowModal from "./AddBorrowModal.vue";
import UpdateBorrowModal from "./UpdateBorrowModal.vue";
import ConfirmModal from "./ConfirmModal.vue";
import ToastNotification from "./ToastNotification.vue";
import { useBorrowManagement } from "@/composables/useBorrowManagement";

const route = useRoute();
const router = useRouter();

const {
  borrowData,
  booksData,
  search,
  limit,
  limitOptions,
  currentPage,
  selectedStatus,
  selectedCategory,
  showModal,
  showBookDetail,
  showUpdateModal,
  showConfirmModal,
  openDropdown,
  selectedBook,
  addForm,
  updateForm,
  statusOptions,
  formError,
  message,
  messageType,
  categories,
  filteredBorrowData,
  totalFilteredItems,
  totalPages,
  fetchBorrowData,
  fetchBooksData,
  getItemStatus,
  getDaysLeft,
  formatDate,
  toggleDropdown,
  handleShow,
  openUpdateModal,
  closeUpdateModal,
  submitUpdate,
  submitAddBorrow,
  handleDelete,
  confirmReturn,
  handleConfirmReturn,
  exportBorrowDataToExcel,
  exportBorrowDataToPDF,
} = useBorrowManagement();

// Function to update selectedStatus and sync with query parameter
const updateSelectedStatus = (value) => {
  console.log("Updating selectedStatus:", value);
  selectedStatus.value = value;
  router.replace({
    name: "borrows",
    query: { ...route.query, status: value || undefined, limit: limit.value },
  });
};

// Function to update selectedCategory and sync with query parameter
const updateSelectedCategory = (value) => {
  console.log("Updating selectedCategory:", value);
  selectedCategory.value = value;
  router.replace({
    name: "borrows",
    query: { ...route.query, category: value || undefined, limit: limit.value },
  });
};

// Read query parameters on mount
onMounted(async () => {
  await Promise.all([fetchBorrowData(), fetchBooksData()]);
  console.log("Initial booksData:", booksData.value);
  const { status, limit: queryLimit } = route.query;
  console.log("Query params on mount:", { status, limit: queryLimit });
  if (status && ["borrowed", "overdue", "returned"].includes(status)) {
    selectedStatus.value = status;
  }
  if (queryLimit && ["10", "30", "50", "all"].includes(queryLimit)) {
    limit.value = queryLimit;
  }
});

// Reset currentPage when filters change
watch([selectedCategory, selectedStatus, search, limit], () => {
  console.log("Filters changed:", {
    selectedCategory: selectedCategory.value,
    selectedStatus: selectedStatus.value,
    search: search.value,
    limit: limit.value,
  });
  currentPage.value = 1;
  router.replace({
    name: "borrows",
    query: {
      status: selectedStatus.value || undefined,
      category: selectedCategory.value || undefined,
      limit: limit.value,
    },
  });
});

// Adjust currentPage if it exceeds totalPages
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal;
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
</style>
