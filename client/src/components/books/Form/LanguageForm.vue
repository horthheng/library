<template>
  <div v-if="show" class="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div
      class="relative top-[110px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ language ? 'Edit Language' : 'Add New Language' }}
          </h2>
          <button @click="$emit('close')"
            class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <form @submit.prevent="submitLanguageForm" class="p-6">
        <div class="grid grid-cols-1 gap-6">
          <div class="form-group">
            <label class="form-label">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Name *
            </label>
            <input v-model.trim="languageForm.name" required type="text" class="form-input"
              placeholder="Enter language name" />
          </div>
          <div class="form-group">
            <label class="form-label">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h18M3 3v18M21 3v18M9 9h6m-6 6h6" />
              </svg>
              Country
            </label>
            <input v-model.trim="languageForm.country" type="text" class="form-input"
              placeholder="Enter country" />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting">{{ language ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ language ? 'Update Language' : 'Create Language' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { createLanguage, updateLanguage } from '@/services/Api/language';

const props = defineProps({
  show: Boolean,
  language: Object,
});

const emit = defineEmits(['close', 'submit']);

const isSubmitting = ref(false);
const languageForm = ref({
  name: '',
  country: '',
});

watch(() => props.language, (newLanguage) => {
  if (newLanguage) {
    languageForm.value = {
      name: newLanguage.name,
      country: newLanguage.country || '',
    };
  } else {
    languageForm.value = {
      name: '',
      country: '',
    };
  }
}, { immediate: true });

const submitLanguageForm = async () => {
  if (!languageForm.value.name.trim()) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Name is required',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }
  isSubmitting.value = true;
  try {
    const languageData = {
      name: languageForm.value.name,
      country: languageForm.value.country || null,
    };
    let res;
    if (props.language) {
      res = await updateLanguage(props.language.id, languageData);
    } else {
      res = await createLanguage(languageData);
    }
    const updatedLanguage = res.data.language || res.data;
    emit('submit', updatedLanguage);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      text: props.language
        ? 'Language updated successfully'
        : 'Language created successfully and selected',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error('Error saving language:', error, error.response?.data);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Error saving language',
      text: error.response?.data?.message || 'Please try again later.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400;
}

.form-input:focus {
  @apply shadow-lg;
}

.btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>