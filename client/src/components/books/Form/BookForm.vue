<template>
  <div v-if="showForm" class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
    <div class="relative top-[110px] mx-auto bg-white rounded-xl w-full max-w-full sm:max-w-4xl">
      <!-- Form Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ form.id ? 'Edit Book' : 'Add New Book' }}</h2>
              <p class="text-sm text-gray-500">{{ form.id ? 'Update book information' : 'Fill in the details below' }}</p>
            </div>
          </div>
          <button @click="closeForm"
            class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center justify-center group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex justify-center mt-4">
          <div class="flex space-x-2">
            <div v-for="(step, index) in steps" :key="index" @click="goToStep(index)"
              class="cursor-pointer flex items-center">
              <div
                :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', currentStep >= index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600']">
                {{ index + 1 }}
              </div>
              <div v-if="index < steps.length - 1"
                :class="['w-8 h-1 mx-1', currentStep > index ? 'bg-blue-500' : 'bg-gray-200']"></div>
            </div>
          </div>
        </div>
      </div>
      <form @submit.prevent="validateAndSubmit" class="p-6">
        <div v-show="currentStep === 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            Basic Information
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Title *
              </label>
              <input v-model="form.title" required type="text" class="form-input" placeholder="Enter book title" />
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                ISBN
              </label>
              <input v-model="form.isbn" type="text" class="form-input" placeholder="978-0-123456-78-9" />
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Quantity *
              </label>
              <input v-model="form.quantity" required type="number" min="1" class="form-input" placeholder="4" />
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Publication Year
              </label>
              <select v-model="form.public_year" class="form-input">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>
        </div>
        <div v-show="currentStep === 1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            Additional Information
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                From *
              </label>
              <input v-model="form.donated_by" type="text" class="form-input" placeholder="Donor name" />
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Author *
              </label>
              <div class="flex items-center gap-2">
                <select v-model="form.AuthorId" required class="form-input flex-1">
                  <option disabled value="">Select Author</option>
                  <option value="add-new-author" class="text-blue-500 font-semibold">+ Add New Author</option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.name }}
                  </option>
                </select>
                <button v-if="form.AuthorId && form.AuthorId !== 'add-new-author'"
                  @click="openAuthorForm(form.AuthorId)" type="button"
                  class="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center gap-1"
                  title="Edit Selected Author">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category *
              </label>
              <div class="flex items-center gap-2">
                <select v-model="form.CategoryId" required class="form-input flex-1">
                  <option disabled value="">Select Category</option>
                  <option value="add-new-category" class="text-blue-500 font-semibold">+ Add New Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <button v-if="form.CategoryId && form.CategoryId !== 'add-new-category'"
                  @click="openCategoryForm(form.CategoryId)" type="button"
                  class="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center gap-1"
                  title="Edit Selected Category">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Language *
              </label>
              <div class="flex items-center gap-2">
                <select v-model="form.language_id" required class="form-input flex-1">
                  <option disabled value="">Select Language</option>
                  <option value="add-new-language" class="text-blue-500 font-semibold">+ Add New Language</option>
                  <option v-for="language in languages" :key="language.id" :value="language.id">
                    {{ language.name }}
                  </option>
                </select>
                <button v-if="form.language_id && form.language_id !== 'add-new-language'"
                  @click="openLanguageForm(form.language_id)" type="button"
                  class="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm flex items-center gap-1"
                  title="Edit Selected Language">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="currentStep === 2">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            Description and Cover
          </h3>
          <div class="grid grid-cols-1 gap-6">
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </label>
              <textarea v-model="form.description" rows="3" class="form-input resize-none"
                placeholder="Enter book description..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cover Image
              </label>
              <div class="file-upload-area">
                <input type="file" @change="handleFile" class="file-input" accept="image/*" id="cover-image" />
                <label for="cover-image" class="file-upload-label">
                  <div class="file-upload-content">
                    <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm font-medium text-gray-700">Click to upload cover image</p>
                  </div>
                </label>
              </div>
              <div v-if="previewImage" class="mt-4">
                <img :src="previewImage" alt="Preview" class="w-40 h-auto object-cover rounded-lg border" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
          <button v-if="currentStep > 0" @click="prevStep" type="button"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div v-else></div>
          <div class="flex gap-3">
            <button v-if="currentStep < steps.length - 1" @click="nextStep" type="button" class="btn-primary">
              Next
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button v-else type="submit" class="btn-primary" :disabled="isSubmitting">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ form.id ? 'Update Book' : 'Create Book' }}
            </button>
          </div>
        </div>
      </form>
      <AuthorForm
        :show="showAuthorForm"
        :author="editingAuthor"
        @close="closeAuthorForm"
        @submit="handleAuthorSubmit"
      />
      <CategoryForm
        :show="showCategoryForm"
        :category="editingCategory"
        @close="closeCategoryForm"
        @submit="handleCategorySubmit"
      />
      <LanguageForm
        :show="showLanguageForm"
        :language="editingLanguage"
        @close="closeLanguageForm"
        @submit="handleLanguageSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Swal from 'sweetalert2';
import AuthorForm from './AuthorForm.vue';
import CategoryForm from './CategoryForm.vue';
import LanguageForm from './LanguageForm.vue';

const props = defineProps({
  showForm: Boolean,
  form: Object,
  authors: Array,
  categories: Array,
  languages: Array,
  previewImage: String,
});

const emit = defineEmits([
  'closeForm',
  'submitForm',
  'handleFile',
  'authorUpdated',
  'categoryUpdated',
  'languageUpdated',
  'updateForm',
]);

const steps = ['Basic Information', 'Additional Information', 'Description & Cover'];
const currentStep = ref(0);
const isSubmitting = ref(false);
const showAuthorForm = ref(false);
const editingAuthor = ref(null);
const showCategoryForm = ref(false);
const editingCategory = ref(null);
const showLanguageForm = ref(false);
const editingLanguage = ref(null);

// Generate years array
const currentYear = new Date().getFullYear();
const years = ref([]);
for (let year = currentYear; year >= 1900; year--) {
  years.value.push(year);
}

const validateAndSubmit = () => {
  if (currentStep.value !== steps.length - 1) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'warning',
      title: 'Incomplete Form',
      text: 'Please complete all steps before submitting.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  const requiredFields = [
    { field: 'title', label: 'Title' },
    { field: 'quantity', label: 'Quantity' },
    { field: 'AuthorId', label: 'Author' },
    { field: 'CategoryId', label: 'Category' },
    { field: 'language_id', label: 'Language' },
  ];

  const missingFields = requiredFields.filter(
    ({ field }) => !props.form[field] || props.form[field] === ''
  );
  if (missingFields.length > 0) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Missing Required Fields',
      text: `Please fill in: ${missingFields.map((f) => f.label).join(', ')}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  if (props.form.quantity && props.form.quantity < 1) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Quantity must be at least 1',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  if (props.form.public_year && props.form.public_year > currentYear) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: `Publication year cannot be later than ${currentYear}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  isSubmitting.value = true;
  emit('submitForm');
  isSubmitting.value = false;
};

const openAuthorForm = (authorId) => {
  if (authorId && authorId !== 'add-new-author') {
    const authorToEdit = props.authors.find((a) => a.id === authorId);
    editingAuthor.value = authorToEdit || null;
  } else {
    editingAuthor.value = null;
  }
  showAuthorForm.value = true;
};

const handleAuthorSubmit = (updatedAuthor) => {
  emit('authorUpdated', updatedAuthor);
  emit('updateForm', { AuthorId: updatedAuthor.id });
  closeAuthorForm();
};

const closeAuthorForm = () => {
  showAuthorForm.value = false;
  editingAuthor.value = null;
};

const openCategoryForm = (categoryId) => {
  if (categoryId && categoryId !== 'add-new-category') {
    const categoryToEdit = props.categories.find((c) => c.id === categoryId);
    editingCategory.value = categoryToEdit || null;
  } else {
    editingCategory.value = null;
  }
  showCategoryForm.value = true;
};

const handleCategorySubmit = (updatedCategory) => {
  emit('categoryUpdated', updatedCategory);
  emit('updateForm', { CategoryId: updatedCategory.id });
  closeCategoryForm();
};

const closeCategoryForm = () => {
  showCategoryForm.value = false;
  editingCategory.value = null;
};

const openLanguageForm = (languageId) => {
  if (languageId && languageId !== 'add-new-language') {
    const languageToEdit = props.languages.find((l) => l.id === languageId);
    editingLanguage.value = languageToEdit || null;
  } else {
    editingLanguage.value = null;
  }
  showLanguageForm.value = true;
};

const handleLanguageSubmit = (updatedLanguage) => {
  emit('languageUpdated', updatedLanguage);
  emit('updateForm', { language_id: updatedLanguage.id });
  closeLanguageForm();
};

const closeLanguageForm = () => {
  showLanguageForm.value = false;
  editingLanguage.value = null;
};

const closeForm = () => {
  currentStep.value = 0;
  emit('closeForm');
};

const handleFile = (event) => {
  const file = event.target.files[0];
  if (!file) {
    emit('handleFile', { target: { files: [] } });
    return;
  }
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'Invalid file type',
      text: 'Only JPEG, PNG, or GIF images are allowed.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'File too large',
      text: 'Maximum file size is 5MB.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }
  emit('handleFile', event);
};

const goToStep = (index) => {
  currentStep.value = index;
};

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

watch(() => props.form.AuthorId, (newVal) => {
  if (newVal === 'add-new-author') {
    openAuthorForm(null);
    emit('updateForm', { AuthorId: '' });
  }
});

watch(() => props.form.CategoryId, (newVal) => {
  if (newVal === 'add-new-category') {
    openCategoryForm(null);
    emit('updateForm', { CategoryId: '' });
  }
});

watch(() => props.form.language_id, (newVal) => {
  if (newVal === 'add-new-language') {
    openLanguageForm(null);
    emit('updateForm', { language_id: '' });
  }
});

watch(() => props.showForm, (newVal) => {
  if (newVal) currentStep.value = 0;
});
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>