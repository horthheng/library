<script setup>
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

// Default avatar
const DEFAULT_AVATAR = '/defultImageProfile.png';

// Stores and router
const userStore = useUserStore();
const router = useRouter();
const language = ref('en');

// State
const mobileMenuOpen = ref(false);
const profileDropdownOpen = ref(false);
const dropdownRef = ref(null);

// Computed properties
const username = computed(() => userStore.user?.username || 'Guest');
const userEmail = computed(() => userStore.user?.email || 'N/A');
const userRole = computed(() => userStore.user?.role || '');
const isAdmin = computed(() => userRole.value === 'admin');
const canAccessSystem = computed(() => ['admin', 'librarian'].includes(userRole.value));
const canAccessWebsite = computed(() => ['user', 'librarian'].includes(userRole.value));

function isValidImage(v) {
  return typeof v === 'string' && v.trim() && v !== 'null' && v !== 'undefined';
}

// Profile image handling with localStorage fallback
const userProfileImage = computed(() => {
  const localImage = localStorage.getItem('profileImage');
  const backendImage = userStore.userProfile?.user?.profile_image;
  return isValidImage(backendImage) ? backendImage : isValidImage(localImage) ? localImage : DEFAULT_AVATAR;
});

// Fetch user profile and persist image in localStorage
async function loadUserProfile() {
  try {
    if (!userStore.isAuthenticated && localStorage.getItem('token')) {
      const isValid = await userStore.validateToken();
      if (!isValid) throw new Error('Token expired');
    } else if (!userStore.isAuthenticated) {
      router.push('/login');
      return;
    }

    const result = await userStore.fetchUserProfile();
    if (!result.success) throw new Error('Failed to fetch profile');

    // Persist profile image
    if (userStore.userProfile?.user?.profile_image) {
      localStorage.setItem('profileImage', userStore.userProfile.user.profile_image);
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Please login again.',
    });
    userStore.resetAuth();
    router.push('/login');
  }
}

// Lifecycle hooks
onMounted(() => {
  loadUserProfile();
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  profileDropdownOpen.value = false;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleProfileDropdown = (event) => {
  event.stopPropagation();
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeProfileDropdown = () => {
  profileDropdownOpen.value = false;
};

const handleOutsideClick = (event) => {
  if (profileDropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeProfileDropdown();
  }
};

const logout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    background: '#fff',
  });

  if (!result.isConfirmed) return;

  await userStore.logout();
  localStorage.removeItem('profileImage'); // clear cache
  mobileMenuOpen.value = false;
  profileDropdownOpen.value = false;
  router.push('/login');
};
</script>

<template>
  <nav class="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 lg:h-20">
        <!-- Logo -->
        <div class="flex items-center space-x-3 flex-shrink-0">
          <img src="/logo.png" alt="PNC Logo" class="h-12 w-12 object-contain">
          <div class="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PNC LIBRARY
          </div>
        </div>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
          <router-link to="/website" class="nav-link font-semibold">Home</router-link>
          <router-link to="/about-us" class="nav-link">About</router-link>
          <router-link to="/web-book" class="nav-link">Books</router-link>
          <router-link v-if="canAccessWebsite" to="/web-summary" class="nav-link">Summary</router-link>
          <router-link v-if="canAccessSystem" to="/dashboard" class="nav-link">System</router-link>
        </div>

        <!-- Desktop user profile -->
        <div class="hidden md:flex items-center space-x-4">
          <div class="relative" ref="dropdownRef">
            <button @click="toggleProfileDropdown"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:ring-blue-500 transition-all duration-200">
              <img
                :src="userProfileImage"
                alt="User Profile"
                class="h-10 w-10 rounded-full object-cover"
                @error="$event.target.src = DEFAULT_AVATAR"
              />
              <div class="flex flex-col text-left">
                <span class="text-sm lg:text-base font-medium text-gray-700">{{ username }}</span>
              </div>
            </button>
            <div v-if="profileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-2">
              <div class="px-4 py-2 text-1xl text-gray-700 bg-gray-50">
                <span class="font-semibold">{{ username }}</span>
              </div>
              <hr class="border-gray-200">
              <router-link to="/profile-web"
                class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                @click="closeProfileDropdown">
                <span class="material-symbols-outlined text-blue-600 mr-2">person</span>
                {{ language === "en" ? "View Profile" : "View Profile" }}
              </router-link>
              <button @click="logout" class="w-full text-left flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded">
                <span class="material-symbols-outlined mr-2">logout</span>
                {{ language === "en" ? "Logout" : "Logout" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
            <span class="sr-only">Open main menu</span>
            <svg :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }" class="md:hidden bg-white/98 backdrop-blur-lg border-t border-gray-200 transition-all duration-300">
      <div class="px-4 pt-3 pb-4 space-y-2">
        <router-link to="/website" class="mobile-nav-link font-semibold" @click="closeMobileMenu">Home</router-link>
        <router-link to="/about-us" class="mobile-nav-link" @click="closeMobileMenu">About</router-link>
        <router-link to="/web-book" class="mobile-nav-link" @click="closeMobileMenu">Books</router-link>
        <router-link v-if="canAccessWebsite" to="/web-summary" class="mobile-nav-link" @click="closeMobileMenu">Summary</router-link>
        <router-link v-if="canAccessSystem" to="/dashboard" class="mobile-nav-link" @click="closeMobileMenu">System</router-link>
      </div>
      <div class="px-4 pt-4 pb-6 border-t border-gray-200">
        <div class="flex items-center space-x-3 mb-3">
          <img :src="userProfileImage" alt="User Profile" class="h-10 w-10 rounded-full object-cover" @error="$event.target.src = DEFAULT_AVATAR" />
          <div class="flex flex-col">
            <span class="text-base font-semibold text-gray-800">{{ username }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">{{ userEmail }}</div>
          <hr class="border-gray-200">
          <router-link to="/profile-web" class="mobile-nav-link" @click="closeMobileMenu">Profile Detail</router-link>
          <button @click="logout" class="mobile-nav-link text-red-600 hover:text-red-700 hover:bg-red-50">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Desktop nav links */
.nav-link {
  @apply relative px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50/90 rounded-lg transition-all duration-300;
}

.nav-link.router-link-active {
  @apply text-blue-600 bg-blue-50/90;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  @apply w-4/5;
}

/* Mobile nav links */
.mobile-nav-link {
  @apply block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200;
}

.mobile-nav-link.router-link-active {
  @apply text-blue-600 bg-blue-50;
}
</style>