<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  show: Boolean,
  user: Object,
});

const emits = defineEmits(['close']);

const userStore = useUserStore();
const isLoadingLoans = ref(false);
const isLoadingInterests = ref(false);


</script>

<template>
  <div v-if="show"
    class="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-300">
    <!-- Modal Container -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4">
      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-8 rounded-2xl bg-gradient-to-b from-gray-50/30 to-white">
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 min-h-full">
          <!-- Left Column: Profile + Barcode/QR (stacked on mobile, side-by-side on tablet/desktop) -->
          <div class="sm:col-span-4 flex flex-col space-y-4 sm:space-y-6">
            <div class="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
              <div class="flex flex-col items-center text-center">
                <div
                  class="w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-xl mb-2">
                  <img v-if="user.profile_image" :src="user.profile_image" alt="Profile"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-12 sm:w-16 h-12 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg sm:text-2xl font-bold text-gray-900">{{ user.username }}</h3>
              </div>

              <!-- Barcode & QR -->
              <div class="mt-4 sm:mt-6 flex flex-col gap-2 items-center">
                <div class="flex flex-col gap-2 items-center">
                  <span class="text-xs sm:text-sm font-medium text-gray-600">Barcode</span>
                  <img v-if="user.barcode_image" :src="user.barcode_image" class="h-16 sm:h-20 w-auto" />
                  <span v-else class="text-gray-400 text-xs sm:text-sm">No Barcode</span>
                </div>
                <div class="flex flex-col gap-2 items-center">
                  <span class="text-xs sm:text-sm font-medium text-gray-600">QR Code</span>
                  <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-16 sm:h-20 w-auto" />
                  <span v-else class="text-gray-400 text-xs sm:text-sm">No QR Code</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Basic Info + Additional Info (stacked on mobile, side-by-side on tablet/desktop) -->
          <div class="sm:col-span-8 flex flex-col space-y-4 sm:space-y-6 relative">
            <!-- Close button -->
            <button @click="$emit('close')"
              class="absolute top-4 sm:top-6 right-4 sm:right-7 text-indigo-600 hover:text-indigo-800 p-1 rounded-full border border-indigo-200 bg-indigo-50 text-sm font-medium transition-all duration-200">
              <svg class="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Basic Info Section -->
            <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mt-10 sm:mt-12">
              <h4 class="text-base sm:text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs sm:text-sm font-medium text-gray-600">Username</span>
                    <span class="text-sm sm:text-base text-gray-900 font-semibold bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">{{ user.username }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs sm:text-sm font-medium text-gray-600">Phone</span>
                    <span class="text-sm sm:text-base text-gray-900 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">{{ user.phone || '-' }}</span>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs sm:text-sm font-medium text-gray-600">Email</span>
                    <span class="text-sm sm:text-base text-gray-900 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg break-all">{{ user.email || 'N/A' }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs sm:text-sm font-medium text-gray-600">Role</span>
                    <span class="text-sm sm:text-base bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium">{{ user.role?.name || user.Role?.name || 'User' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Info Section -->
            <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
              <h4 class="text-base sm:text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Additional Information
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div class="flex flex-col gap-1">
                  <span class="text-xs sm:text-sm font-medium text-gray-600">Date of Birth</span>
                  <span class="text-sm sm:text-base text-gray-900 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg inline-block w-fit">{{ user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-' }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs sm:text-sm font-medium text-gray-600">Barcode</span>
                  <span class="text-sm sm:text-base text-gray-900 bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg inline-block w-fit">{{ user.barcode || '-' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>