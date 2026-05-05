<template>
  <div class="min-h-screen py-8 px-4 mt-10 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <!-- Loading -->
      <div v-if="isLoading" class="bg-white rounded-2xl shadow-xl p-8 text-center backdrop-blur-sm">
        <div class="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-600 font-medium">Loading your profile...</p>
      </div>

      <!-- Profile View -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
        <!-- Profile Header -->
        <div class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div class="relative flex flex-col lg:flex-row items-center gap-8">
            <!-- Profile Image with Edit -->
            <div class="relative group">
              <div class="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm">
                <div class="w-full h-full rounded-full border-4 border-white shadow-2xl flex items-center justify-center bg-slate-100 overflow-hidden">
                  <img
                    v-if="hasValidProfileImage"
                    :src="currentImage"
                    alt="Profile"
                    class="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                    @error="$event.target.src = DEFAULT_AVATAR"
                  />
                  <span v-else class="text-4xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full h-full w-full flex items-center justify-center">
                    {{ profileInitial }}
                  </span>
                </div>
              </div>

              <!-- Edit overlay -->
              <button
                class="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition"
                @click="openFilePicker"
              >
                Change
              </button>

              <!-- Status indicator -->
              <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300"
                :class="userStore.userProfile?.isOnline ? 'bg-emerald-500' : 'bg-slate-400'">
                <div class="w-2 h-2 rounded-full bg-white"></div>
              </div>

              <!-- Hidden file input -->
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileChange" />
            </div>

            <!-- User info -->
            <div class="text-center lg:text-left flex-1 space-y-4">
              <h1 class="text-3xl lg:text-4xl font-bold text-white mb-2">{{ userStore.userProfile?.user?.username || 'Unknown User' }}</h1>
              <p class="text-blue-100 text-lg font-medium mb-4 break-words">{{ userStore.userProfile?.user?.email || 'Not provided' }}</p>

              <!-- Status Badge -->
              <div class="flex justify-center lg:justify-start">
                <span
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/10"
                  :class="userStore.userProfile?.isOnline ? 'bg-emerald-500/20 text-emerald-100' : 'bg-slate-500/20 text-slate-200'">
                  <div class="w-2 h-2 rounded-full" :class="userStore.userProfile?.isOnline ? 'bg-emerald-300' : 'bg-slate-300'"></div>
                  {{ userStore.userProfile?.isOnline ? 'Active Now' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Save/Cancel Buttons -->
        <div v-if="previewImage" class="flex justify-center gap-4 mt-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
            :disabled="isSaving"
            @click="saveProfileImage"
          >
            {{ isSaving ? 'Saving...' : 'Save Image' }}
          </button>
          <button
            class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
            :disabled="isSaving"
            @click="previewImage = null"
          >
            Cancel
          </button>
        </div>

        <!-- Profile Details -->
        <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Personal Info Card -->
          <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <h2 class="text-xl font-bold text-slate-800 mb-4">Personal Information</h2>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span>Date of Birth:</span>
                <span>{{ userStore.userProfile?.user?.date_of_birth ? new Date(userStore.userProfile.user.date_of_birth).toLocaleDateString() : 'Not provided' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Phone:</span>
                <span>{{ userStore.userProfile?.user?.phone || 'Not provided' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Role:</span>
                <span>{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</span>
              </div>
            </div>
          </div>

          <!-- Account Status Card -->
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-slate-200/50 hover:shadow-lg transition-all duration-300">
            <h2 class="text-xl font-bold text-slate-800 mb-4">Account Status</h2>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span>Account Status:</span>
                <span class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full">
                <div class="bg-emerald-500 h-2 rounded-full w-full"></div>
              </div>
              <div class="flex justify-between">
                <span>Profile Completion:</span>
                <span>85%</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- end profile view -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

const userStore = useUserStore();
const DEFAULT_AVATAR = '/defultImageProfile.png';

const previewImage = ref(null);
const isLoading = ref(true);
const fileInput = ref(null);
const isSaving = ref(false);

const profileInitial = computed(() =>
  userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?'
);

const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || '';
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'));
});

const currentImage = computed(() =>
  previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || DEFAULT_AVATAR
);

onMounted(async () => {
  isLoading.value = true;
  try {
    const profileResult = await userStore.fetchUserProfile();
    if (!profileResult.success || !userStore.userProfile?.user) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Profile Error',
        text: 'No user data found. Please log in again.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '300px',
        padding: '0.5em 1em',
        background: '#fff',
      });
      return;
    }
  } catch (err) {
    console.error('Failed to load user profile:', err);
  } finally {
    isLoading.value = false;
  }
});

const openFilePicker = () => {
  fileInput.value?.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File',
      text: 'Please upload an image file.',
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const saveProfileImage = async () => {
  if (!fileInput.value?.files[0]) return;

  const file = fileInput.value.files[0];
  const formData = new FormData();
  formData.append('profile_image', file);

  try {
    isSaving.value = true;
    const res = await userStore.updateUserProfileImage(formData);
    if (res.success) {
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile image was updated successfully!',
      });
      previewImage.value = null;
      await userStore.fetchUserProfile();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: res.message || 'Something went wrong.',
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not upload profile image.',
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
