<template>
  <div v-if="show" class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div
      class="relative top-[110px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Import Books</h2>
              <p class="text-sm text-gray-500">Upload an Excel file to add multiple books</p>
            </div>
          </div>
          <button @click="$emit('close')" aria-label="Close modal"
            class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="submitImport" class="p-6">
        <div class="grid grid-cols-1 gap-6">
          <div class="form-group">
            <label class="form-label" for="import-file">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Upload Excel File *
            </label>
            <div class="file-upload-area">
              <input type="file" @change="handleFile" class="file-input" accept=".xlsx,.xls" id="import-file"
                required />
              <label for="import-file" class="file-upload-label">
                <div class="file-upload-content">
                  <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V12" />
                  </svg>
                  <p class="text-sm font-medium text-gray-700">
                    {{ fileName || 'Click to upload an Excel file' }}
                  </p>
                </div>
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Upload an Excel file with columns: title, isbn, quantity, donated_by, public_year, description, available,
              category_name, author_name, language_name, cover_image (optional)
            </p>
            <button type="button" @click="downloadSampleExcel"
              class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-700 hover:text-white transition-all duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Sample Excel
            </button>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
            Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="isSubmitting || !file">
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg class="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"></circle>
                <path d="M4 12a8 8 0 018-8v8z" class="opacity-75"></path>
              </svg>
              Importing...
            </span>
            <span v-else>Import</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import ApiService from '@/services/axios';

const props = defineProps({
  show: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'submit']);

const file = ref(null);
const fileName = ref('');
const isSubmitting = ref(false);

const handleFile = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      showToast('error', 'Invalid file type', 'Please upload an Excel file (.xlsx or .xls).');
      resetFile();
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast('error', 'File too large', 'Maximum file size is 5MB.');
      resetFile();
      return;
    }
    file.value = selectedFile;
    fileName.value = selectedFile.name;
  } else {
    resetFile();
  }
};

const resetFile = () => {
  file.value = null;
  fileName.value = '';
  const input = document.getElementById('import-file');
  if (input) input.value = '';
};

const showToast = (icon, title, text = '') => {
  Swal.fire({
    toast: true,
    position: 'bottom-end',
    icon,
    title,
    text,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
};

const submitImport = async () => {
  if (!file.value) {
    showToast('error', 'No file selected', 'Please select an Excel file to import.');
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('file', file.value);

    const response = await ApiService.post('/books/import-book', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { warnings, message, data } = response.data;

    // Use Sets to collect unique names for categories, authors, and languages
    const uniqueCategories = new Set();
    const uniqueAuthors = new Set();
    const uniqueLanguages = new Set();

    // Extract new relational data from warnings and deduplicate
    warnings?.forEach(warning => {
      if (warning.includes('New category')) {
        const match = warning.match(/Row \d+: New category '(.+)' created\./);
        if (match) uniqueCategories.add(match[1]);
      } else if (warning.includes('New author')) {
        const match = warning.match(/Row \d+: New author '(.+)' created\./);
        if (match) uniqueAuthors.add(match[1]);
      } else if (warning.includes('New language')) {
        const match = warning.match(/Row \d+: New language '(.+)' created\./);
        if (match) uniqueLanguages.add(match[1]);
      }
    });

    // Convert Sets to arrays of objects
    const newCategories = Array.from(uniqueCategories).map(name => ({ name }));
    const newAuthors = Array.from(uniqueAuthors).map(name => ({ name }));
    const newLanguages = Array.from(uniqueLanguages).map(name => ({ name }));

    // Handle warnings
    if (warnings && warnings.length > 0) {
      const coverImageWarnings = warnings.filter(w => w.includes('No cover image provided'));
      const otherWarnings = warnings.filter(w => !w.includes('No cover image provided'));
      if (coverImageWarnings.length > 0) {
        showToast('warning', 'Import Successful', 'Please update cover images later.');
      }
      if (otherWarnings.length > 0) {
        showToast('warning', 'Import Warning', otherWarnings.join('\n'));
      }
    } else {
      showToast('success', 'Success', message || 'Books imported successfully.');
    }

    // Emit books and relational data
    emit('submit', { books: data, newCategories, newAuthors, newLanguages });
    emit('close');
    resetFile();
  } catch (error) {
    console.error('Error importing books:', error);

    const warnings = error.response?.data?.warnings || [];
    const importedBooks = error.response?.data?.data || [];

    // Show warnings if any
    if (warnings.some(w => w.includes('No cover image provided'))) {
      showToast('warning', 'Import Successful', 'Please update cover images later.');
      emit('submit', { books: importedBooks, newCategories: [], newAuthors: [], newLanguages: [] });
    } else if (warnings.length > 0) {
      showToast('warning', 'Import Warning', warnings.join('\n'));
      emit('submit', { books: importedBooks, newCategories: [], newAuthors: [], newLanguages: [] });
    }

    emit('close');
    resetFile();
  } finally {
    isSubmitting.value = false;
  }
};

const downloadSampleExcel = async () => {
  try {
    const response = await ApiService.get('/books/sample-excel', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_books_import.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading sample Excel:', error);
    showToast('error', 'Error downloading sample', error.response?.data?.message || 'Failed to download sample Excel file.');
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

.file-upload-area {
  @apply relative;
}

.file-input {
  @apply absolute inset-0 w-full h-full opacity-0 cursor-pointer;
}

.file-upload-label {
  @apply block w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50;
}

.file-upload-content {
  @apply flex flex-col items-center justify-center text-center;
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