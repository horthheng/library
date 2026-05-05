<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

// Access the user store and router
const userStore = useUserStore();
const router = useRouter();

// Computed properties to reactively access store data
const userRole = computed(() => userStore.user?.role || '');
const canAccessSystem = computed(() => ['admin', 'librarian'].includes(userRole.value));
const canAccessWebsite = computed(() => ['user', 'librarian'].includes(userRole.value));

// Initialize user state on mount
onMounted(async () => {
  console.log('Nav component mounted. isAuthenticated:', userStore.isAuthenticated, 'user:', userStore.user, 'token:', userStore.token);
  if (!userStore.isAuthenticated && localStorage.getItem('token')) {
    try {
      const isValid = await userStore.validateToken();
      console.log('Token validation result:', isValid);
      if (!isValid) {
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
        });
        userStore.resetAuth();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while validating your session. Please log in again.',
      });
      userStore.resetAuth();
      router.push('/login');
    }
  } else if (!userStore.isAuthenticated) {
    console.log('No session found, redirecting to login');
    router.push('/login');
  } else if (userStore.isAuthenticated && !userStore.userProfile) {
    try {
      const result = await userStore.fetchUserProfile();
      console.log('fetchUserProfile result:', result);
      if (!result.success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load user profile. Please log in again.',
        });
        userStore.resetAuth();
        router.push('/login');
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while loading your profile. Please log in again.',
      });
      userStore.resetAuth();
      router.push('/login');
    }
  }
});

// Logout method
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

  if (result.isConfirmed) {
    await userStore.logout();
    router.push('/login');
  }
};
</script>

<template>
  <footer class="bg-gradient-to-r from-blue-100 to-white border-t border-gray-200 shadow-md">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-3">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <!-- Left: Logo -->
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="Passerelles Numériques Logo"
            class="h-14 w-14 object-contain transition-transform duration-300 hover:scale-105" />
          <span class="text-lg font-semibold text-gray-700">PNC Library</span>
        </div>

        <!-- Middle: Social Media -->
        <div class="flex gap-8">
          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/school/passerelles-num%C3%A9riques-cambodia/" target="_blank" aria-label="Visit our LinkedIn page" class="footer-icon">
            <img src="../../../../public/linkin.png" alt="LinkedIn" class="w-7 h-7 object-contain">
          </a>

          <!-- Instagram -->
          <a href="https://www.instagram.com/passerellesnumeriques/" target="_blank" aria-label="Visit our Instagram page" class="footer-icon">
            <img src="../../../../public/instagram.png" alt="Instagram" class="w-7 h-7 object-contain">
          </a>

          <!-- Facebook -->
          <a href="https://www.facebook.com/passerelles.numeriques.cam/" target="_blank" aria-label="Visit our Facebook page" class="footer-icon">
            <img src="../../../../public/facebook.png" alt="Facebook" class="w-7 h-7 object-contain">
          </a>
        </div>

        <!-- Right: Copyright -->
        <p class="text-gray-500 text-sm text-center md:text-right">
          &copy; student 2025 Passerelles Numériques Cambodai. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-icon {
  @apply w-7 h-7 transition-all duration-300 transform hover:scale-110 hover:rotate-6 hover:shadow-md;
}

.footer-icon img {
  @apply w-full h-full object-contain;
}

.footer-link {
  @apply text-gray-600 text-sm font-medium transition-colors duration-200 flex flex-col items-center;
}

.footer-link:hover {
  @apply text-blue-500;
}

/* Custom hover underline effect */
.footer-link .underline {
  @apply h-0.5 bg-blue-500 scale-x-0 transition-transform duration-300 origin-left;
}

.footer-link:hover .underline {
  @apply scale-x-100;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .footer-link {
    @apply text-gray-300 hover:text-blue-400;
  }
  .footer-link .underline {
    @apply bg-blue-400;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-icon {
    @apply w-6 h-6;
  }

  .flex {
    @apply flex-col items-center;
  }

  .space-x-8,
  .space-x-6,
  .space-x-4 {
    @apply space-y-4 space-x-0 mt-4;
  }

  .footer-link {
    @apply text-center;
  }
}
</style>