<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h3 class="text-2xl font-bold text-gray-900">Update Borrow Record</h3>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="validateAndSubmit" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
          <input
            v-model="form.book_name"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            readonly
            placeholder="e.g., សុទ្ធិ"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">User Name</label>
          <input
            v-model="form.user_name"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            readonly
            placeholder="e.g., Horth"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
          <input
            v-model="form.return_date"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500': formErrors.return_date }"
            @input="formErrors.return_date = ''"
          />
          <p v-if="formErrors.return_date" class="text-red-600 text-sm mt-1">{{ formErrors.return_date }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="form.status"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="{ 'border-red-500': formErrors.status }"
            @input="formErrors.status = ''"
          >
            <option value="" disabled>Select status</option>
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <p v-if="formErrors.status" class="text-red-600 text-sm mt-1">{{ formErrors.status }}</p>
        </div>
        <div v-if="formError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{{ formError }}</div>
        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            :disabled="loading"
          >
            {{ loading ? "Updating..." : "Update Record" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  form: Object,
  statusOptions: Array,
  formError: String,
});

const emit = defineEmits(["submit", "close"]);

const formErrors = ref({});
const loading = ref(false);

function validateAndSubmit() {
  formErrors.value = {};

  if (!props.form.return_date) {
    formErrors.value.return_date = "Return date is required.";
    return;
  }
  if (!props.form.status) {
    formErrors.value.status = "Status is required.";
    return;
  }

  loading.value = true;
  emit("submit", props.form);
  loading.value = false;
}

watch(
  () => props.formError,
  (newError) => {
    if (newError) {
      formErrors.value.general = newError;
    } else {
      formErrors.value.general = "";
    }
  }
);

watch(
  () => props.form,
  () => {
    formErrors.value = {};
  },
  { deep: true }
);
</script>