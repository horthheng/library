<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  users: Array,
  roles: Array,
  selectedIds: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(['edit-user', 'delete-user', 'view-user', 'print-user', 'toggle-select', 'toggle-select-all']);

const openMenuId = ref(null);

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

// Compute the first letter of the email for each user
const getProfileInitial = (user) => {
  return user?.email?.charAt(0)?.toUpperCase() || '?';
};

// Compute whether a user has a valid profile image
const hasValidProfileImage = (user) => {
  const image = user?.profile_image || '';
  return image && (image.startsWith('http') || image.startsWith('data:image'));
};

// Computed: Check if all users on the current page are selected
const areAllSelected = computed(() => {
  return props.users.length > 0 && props.users.every(user => props.selectedIds.includes(user.id));
});

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const menus = document.querySelectorAll('.user-action-menu');
  const buttons = document.querySelectorAll('.user-action-button');

  let clickedInside = false;
  menus.forEach((menu) => {
    if (menu.contains(event.target)) clickedInside = true;
  });
  buttons.forEach((btn) => {
    if (btn.contains(event.target)) clickedInside = true;
  });

  if (!clickedInside) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Hide scrollbar for WebKit */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for Firefox */
.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
</style>

<template>
  <div class="bg-white border shadow-md overflow-hidden">
    <!-- Table Layout for Small Screens and Above (sm: 640px+) -->
    <div class="hidden sm:block overflow-x-auto no-scrollbar">
      <table class="w-full divide-y divide-gray-200 text-xs sm:text-sm">
        <thead class="bg-gray-50 text-left sticky top-0 z-10">
          <tr>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">
              <input type="checkbox" :checked="areAllSelected"
                @change="$emit('toggle-select-all', $event.target.checked)" />
            </th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Profile</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Email</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Phone</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Role</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Barcode</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">Barcode Image</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 whitespace-nowrap">QR Code</th>
            <th class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-gray-600 text-right whitespace-nowrap">Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <input type="checkbox" :checked="selectedIds.includes(user.id)"
                @change="$emit('toggle-select', user.id)" />
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-3">
              <div
                class="w-8 h-8 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center bg-indigo-500 text-white cursor-pointer shadow-sm"
                @click="$emit('view-user', user)">
                <img v-if="hasValidProfileImage(user)" :src="user.profile_image"
                  class="w-full h-full rounded-full object-cover" @error="user.profile_image = null" />
                <span v-else class="text-[10px] sm:text-xs md:text-base font-semibold">
                  {{ getProfileInitial(user) }}
                </span>
              </div>
              <span class="truncate max-w-[100px] sm:max-w-[150px] font-medium">{{ user.username }}</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 truncate max-w-[120px] sm:max-w-[200px]">{{ user.email }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap">{{ user.phone || '-' }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <span
                class="px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 whitespace-nowrap shadow-sm">
                {{ user.role?.name || 'User' }}
              </span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 whitespace-nowrap">{{ user.barcode || '-' }}</td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <img v-if="user.barcode_image" :src="user.barcode_image" class="h-8 sm:h-10 md:h-12 w-auto" />
              <span v-else>-</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3">
              <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-8 sm:h-10 md:h-12 w-auto" />
              <span v-else>-</span>
            </td>
            <td class="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right relative">
              <button @click="toggleMenu(user.id)"
                class="user-action-button p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 rounded transition">
                <span class="material-symbols-outlined text-base sm:text-lg md:text-xl">more_vert</span>
              </button>
              <div v-if="openMenuId === user.id"
                class="user-action-menu absolute right-0 mt-1 sm:mt-2 w-32 sm:w-36 md:w-40 bg-white border rounded shadow-md z-50">
                <button @click="$emit('view-user', user); openMenuId = null"
                  class="flex items-center w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-blue-500 text-[11px] sm:text-xs md:text-sm">
                  <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View User
                </button>
                <button @click="$emit('edit-user', user); openMenuId = null"
                  class="flex items-center w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-green-500 text-[11px] sm:text-xs md:text-sm">
                  <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit User
                </button>
                <button @click="$emit('delete-user', user.id); openMenuId = null"
                  class="flex items-center w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-red-500 text-[11px] sm:text-xs md:text-sm">
                  <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete User
                </button>
                <button v-if="$isDesktop" @click="$emit('print-user', user.id); openMenuId = null"
                  class="hidden lg:flex items-center w-full text-left px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-gray-100 text-gray-700 text-[11px] sm:text-xs md:text-sm">
                  <span class="material-symbols-outlined text-[14px] sm:text-[16px] md:text-[18px] mr-2">print</span>
                  Print User
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card Layout for Mobile (below 640px) -->
    <div class="block sm:hidden space-y-6">
      <div v-for="user in users" :key="user.id"
        class="border border-gray-300 shadow-md hover:shadow-lg transition-shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 rounded-full border flex items-center justify-center bg-indigo-500 text-white cursor-pointer shadow-sm"
              @click="$emit('view-user', user)">
              <img v-if="hasValidProfileImage(user)" :src="user.profile_image"
                class="w-full h-full rounded-full object-cover" @error="user.profile_image = null" />
              <span v-else class="text-sm font-semibold">
                {{ getProfileInitial(user) }}
              </span>
            </div>
            <div class="flex flex-col">
              <p class="text-lg font-semibold text-gray-800 truncate">{{ user.username }}</p>
              <p class="text-sm text-gray-500 truncate max-w-[200px]">{{ user.email }}</p>
            </div>
          </div>
          <div class="relative">
            <button @click="toggleMenu(user.id)" class="user-action-button p-1.5 hover:bg-gray-100 rounded transition">
              <span class="material-symbols-outlined text-lg">more_vert</span>
            </button>
            <div v-if="openMenuId === user.id"
              class="user-action-menu absolute right-0 mt-1 w-32 bg-white border rounded shadow-md z-50">
              <button @click="$emit('view-user', user); openMenuId = null"
                class="flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 text-blue-500 text-[11px]">
                <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View User
              </button>
              <button @click="$emit('edit-user', user); openMenuId = null"
                class="flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 text-green-500 text-[11px]">
                <svg class="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit User
              </button>
              <button @click="$emit('delete-user', user.id); openMenuId = null"
                class="flex items-center w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 text-[11px]">
                <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete User
              </button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex flex-col gap-1">
            <p class="font-medium text-gray-600">Phone</p>
            <p>{{ user.phone || '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-medium text-gray-600">Role</p>
            <p>{{ user.role?.name || 'User' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-medium text-gray-600">Birthday</p>
            <p>{{ user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : '-' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-medium text-gray-600">Barcode</p>
            <p>{{ user.barcode || '-' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-600">Barcode Image</p>
            <img v-if="user.barcode_image" :src="user.barcode_image" class="h-16 w-auto" />
            <span v-else>-</span>
          </div>
          <div>
            <p class="font-medium text-gray-600">QR Code</p>
            <img v-if="user.qr_code_image" :src="user.qr_code_image" class="h-16 w-auto" />
            <span v-else>-</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>