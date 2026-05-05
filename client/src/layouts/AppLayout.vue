<template>
  <div class="flex min-h-screen bg-custom-gray text-gray-900 font-inter">
    <!-- Sidebar for Desktop Only -->
    <aside :class="[
      'rounded-tr-2xl rounded-br-2xl bg-gradient-to-b from-[#065084] to-[#3D74B6] text-gray-100 flex flex-col h-screen fixed left-0 transition-all duration-300 shadow-lg z-40',
      isSidebarOpen ? 'w-64' : 'w-20',
      'hidden lg:flex'
    ]">
      <div v-if="isSidebarOpen" class="p-6 flex flex-col items-center border-b border-indigo-600">
        <img src="/logo.png" alt="Library Logo" class="h-20 w-30" />
        <h2 class="text-2xl font-bold tracking-tight mt-2" :class="{ 'font-khmer': language === 'kh' }">
          {{ language === 'en' ? 'PNC LIBRARY' : 'ប្រព័ន្ធបណ្ចាល័យ' }}
        </h2>
      </div>
      <div v-else class="p-4 flex justify-center border-b border-indigo-600">
        <img src="/logo.png" alt="Library Logo" class="h-10 w-15" />
      </div>
      <nav class="flex-1 overflow-y-auto no-scrollbar">
        <ul class="space-y-1 p-4" :class="{ 'font-khmer': language === 'kh' }">
          <li v-for="item in filteredNav" :key="item.path">
            <RouterLink :to="item.path" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'justify-start' : 'justify-center',
              'hover:bg-custom-hover-page',
              $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : '',
            ]">
              <span class="material-icons text-xl">{{ item.icon }}</span>
              <span v-if="isSidebarOpen" class="ml-3">{{ item.label[language] }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/website" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200',
              isSidebarOpen ? 'justify-start' : 'justify-center',
              'hover:bg-custom-hover-page',
              $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : '',
            ]">
              <span class="material-icons text-xl">public</span>
              <span v-if="isSidebarOpen" class="ml-3">{{ language === "en" ? "Website" : "គេហទំព័រ" }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Mobile Navigation Dropdown -->
    <div v-if="showMobileNavDropdown" class="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
      @click="closeMobileNavDropdown"></div>
    <div v-if="showMobileNavDropdown"
      class="fixed top-16 left-4 right-4 bg-gradient-to-b from-[#065084] to-[#3D74B6] text-gray-100 rounded-lg shadow-lg z-50 md:hidden transform transition-all duration-300">
      <nav class="flex-1 overflow-y-auto no-scrollbar p-4">
        <ul class="space-y-2" :class="{ 'font-khmer': language === 'kh' }">
          <li v-for="item in filteredNav" :key="item.path">
            <RouterLink :to="item.path" @click="closeMobileNavDropdown" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-custom-hover-page',
              $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl mr-3">{{ item.icon }}</span>
              <span>{{ item.label[language] }}</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/website" @click="closeMobileNavDropdown" :class="[
              'flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-custom-hover-page',
              $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : ''
            ]">
              <span class="material-icons text-xl mr-3">public</span>
              <span>{{ language === "en" ? "Website" : "គេហទំព័រ" }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col transition-all duration-300 min-w-0" :class="{
      'lg:ml-64': isSidebarOpen,
      'lg:ml-20': !isSidebarOpen
    }">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white shadow-sm p-4">
        <div class="flex items-center justify-between w-full">
          <!-- Left Side: Menu Button and Title -->
          <div class="-ml-2 flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <button @click="toggleMobileNavDropdown"
              class="md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 mobile-menu-button"
              aria-label="Toggle mobile navigation">
              <span class="material-icons text-2xl">menu</span>
            </button>
            <button @click="toggleSidebar"
              class="hidden lg:block text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle sidebar">
              <span class="material-icons text-2xl">{{
                isSidebarOpen ? "menu_open" : "menu"
              }}</span>
            </button>
            <h1 class="text-xl sm:text-2xl font-semibold tracking-tight ml-2 hidden sm:block"
              :class="{ 'font-khmer': language === 'kh' }">
              {{ pageTitle }}
            </h1>
          </div>

          <!-- Right Side: Desktop Search, Mobile Controls, Notifications, Profile -->
          <div class="flex items-center space-x-3">

            <!-- Language Switch -->
            <div class="relative">
              <button @click="isOpen = !isOpen"
                class="language-button border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 flex items-center"
                :class="{ 'font-khmer': language === 'kh' }" aria-haspopup="true" :aria-expanded="isOpen.toString()"
                aria-label="Select language">
                <img :src="language === 'en'
                  ? 'https://flagcdn.com/w40/us.png'
                  : 'https://flagcdn.com/w40/kh.png'
                  " class="w-5 h-4 mr-2" :alt="language === 'en' ? 'US Flag' : 'Cambodia Flag'" />
                <span class="hidden sm:inline">{{ language === "en" ? "English" : "ភាសាខ្មែរ" }}</span>
                <span class="ml-2 material-icons">arrow_drop_down</span>
              </button>
              <div v-if="isOpen"
                class="language-menu absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-opacity duration-200"
                role="menu" aria-orientation="vertical" tabindex="-1">
                <a href="#" @click.prevent="selectLanguage('en')"
                  class="flex items-center p-2 hover:bg-gray-100 text-sm" role="menuitem" tabindex="0">
                  <img src="https://flagcdn.com/w40/us.png" class="w-5 h-4 mr-2" alt="US Flag" />
                  English
                </a>
                <a href="#" @click.prevent="selectLanguage('kh')"
                  class="flex items-center p-2 hover:bg-gray-100 text-sm" role="menuitem" tabindex="0">
                  <img src="https://flagcdn.com/w40/kh.png" class="w-5 h-4 mr-2" alt="Cambodia Flag" />
                  ភាសាខ្មែរ
                </a>
              </div>
            </div>

            <!-- Notifications and Profile -->
            <div class="flex items-center space-x-2">
              <!-- Notifications -->
              <div class="relative">
                <button @click="toggleNotifications"
                  class="notifications-button material-icons text-gray-700 cursor-pointer hover:text-indigo-700 p-2.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Toggle notifications" :aria-expanded="showNotifications.toString()">
                  notifications
                </button>
                <span v-if="notifications > 0"
                  class="absolute -top-0 -right-0 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-sm"
                  aria-label="Notification count">
                  {{ notifications }}
                </span>
                <div v-if="showNotifications"
                  class="notifications-menu absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-3 z-50 border border-gray-100 transform transition-all duration-300 ease-in-out max-h-72 overflow-y-auto no-scrollbar"
                  role="region" aria-live="polite">
                  <p class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2.5"
                    :class="{ 'font-khmer': language === 'kh' }">
                    {{ language === "en" ? "You have" : "អ្នកមាន" }} {{ notifications }}
                    {{
                      notifications === 1
                        ? language === "en"
                          ? "new notification"
                          : "ការជូនដំណឹងថ្មី"
                        : language === "en"
                          ? "new notifications"
                          : "ការជូនដំណឹងថ្មី"
                    }}
                  </p>
                  <div v-if="userStore.loading" class="flex justify-center items-center py-4">
                    <span class="text-gray-600 text-sm" :class="{ 'font-khmer': language === 'kh' }">
                      {{ language === "en" ? "Loading..." : "កំពុងផ្ទុក..." }}
                    </span>
                  </div>
                  <div v-else-if="notifications > 0" class="mt-1 space-y-3">
                    <div v-for="borrow in userStore.overdueBorrows" :key="borrow.id" :class="[
                      'notification-item rounded-xl p-4 transition-all duration-300 ease-in-out cursor-pointer flex items-center',
                      new Date(borrow.dueDate) <= new Date()
                        ? 'bg-red-50 border-l-4 border-red-600 hover:bg-red-100'
                        : 'bg-gray-50 hover:bg-gray-200',
                    ]" @click="goToBorrowDetails(borrow.id)" role="button" tabindex="0"
                      @keydown.enter="goToBorrowDetails(borrow.id)"
                      :aria-label="`View details for overdue book ${borrow.bookTitle.title}`">
                      <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span class="material-icons text-indigo-700 text-lg">book</span>
                      </div>
                      <div class="ml-4 flex-1">
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-semibold text-gray-900">{{
                            borrow.bookTitle.title
                          }}</span>
                          <span class="text-xs text-gray-600">{{
                            new Date(borrow.dueDate).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          }}</span>
                        </div>
                        <div class="flex items-center space-x-2 mt-1.5">
                          <span class="text-xs text-gray-700">Borrower : {{
                            borrow.userBorrow || "Unknown User"
                          }}</span>
                        </div>
                        <div class="flex items-center space-x-2 mt-1">
                          <span class="text-xs/3 text-red-600">Due: {{ new Date(borrow.dueDate).toLocaleDateString()
                          }}</span>
                          <span v-if="new Date(borrow.dueDate) <= new Date()" class="text-xs/3 text-red-600">
                            (Overdue)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="userStore.error" class="mt-2 text-sm text-red-600 text-center"
                    :class="{ 'font-khmer': language === 'kh' }">
                    {{
                      language === "en"
                        ? "Error loading notifications"
                        : "កំហុសក្នុងការផ្ទុកការជូនដំណឹង"
                    }}
                  </div>
                  <button v-if="notifications > 0"
                    class="mt-4 w-full text-sm font-semibold text-indigo-700 hover:text-indigo-900 text-center underline underline-offset-4 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    @click="clearNotifications" aria-label="Clear all notifications">
                    {{ language === "en" ? "Clear All" : "លុបទាំងអស់" }}
                  </button>
                  <p v-else-if="!userStore.loading && !userStore.error"
                    class="mt-4 text-sm text-gray-600 text-center font-medium"
                    :class="{ 'font-khmer': language === 'kh' }">
                    {{ language === "en" ? "No new notifications" : "គ្មានការជូនដំណឹងថ្មី" }}
                  </p>
                </div>
              </div>

              <!-- Profile -->
              <div class="relative">
                <div
                  class="profile-button h-10 w-10 rounded-full cursor-pointer border border-gray-200 hover:border-indigo-400 flex items-center justify-center"
                  @click="toggleProfileDropdown" role="button" aria-label="Toggle profile dropdown">
                  <img v-if="hasValidProfileImage" :src="profileImageUrl" alt="Profile"
                    class="h-full w-full rounded-full object-cover" @error="handleImageError" :key="profileImageKey" />
                  <span v-else
                    class="text-lg font-semibold text-white bg-indigo-500 rounded-full h-full w-full flex items-center justify-center"
                    :class="{ 'font-khmer': language === 'kh' }">
                    {{ profileInitial }}
                  </span>
                </div>
                <div v-if="showProfileDropdown"
                  class="profile-menu absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-100 transition-opacity duration-200"
                  role="menu">
                  <div class="border-b border-gray-200 pb-2 mb-2">
                    <p class="text-sm font-medium" :class="{ 'font-khmer': language === 'kh' }" :key="userInfoKey">
                      {{ userStore.userProfile?.user?.username || userStore.user?.username || "Unknown" }}
                    </p>
                  </div>
                  <router-link to="/profile"
                    class="flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100 rounded" role="menuitem"
                    @click="showProfileDropdown = false">
                    <span class="material-symbols-outlined text-blue-600 mr-2">person</span>
                    {{ language === "en" ? "View Profile" : "មើលប្រវត្តិរូប" }}
                  </router-link>
                  <button @click="confirmLogout"
                    class="w-full text-left flex items-center p-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    role="menuitem">
                    <span class="material-symbols-outlined mr-2">logout</span>
                    {{ language === "en" ? "Logout" : "ចាកចេញ" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto md:p-6 bg-gray-100" :class="{ 'pb-24': isTablet }">
        <RouterView v-if="!isLoading" />
        <div v-else class="flex justify-center items-center h-full">
          <p class="text-gray-600" :class="{ 'font-khmer': language === 'kh' }">
            {{ language === "en" ? "Loading..." : "កំពុងផ្ទុក..." }}
          </p>
        </div>
      </main>

      <!-- Bottom Navigation for Tablet -->
      <div v-if="isTablet"
        class="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#065084] to-[#3D74B6] text-gray-100 shadow-lg z-40 md:flex lg:hidden flex justify-around">
        <nav class="flex justify-around w-full">
          <RouterLink v-for="item in filteredNav" :key="item.path" :to="item.path" :class="[
            'flex flex-col items-center p-3 min-w-[80px] transition-colors duration-200 flex-shrink-0',
            'hover:bg-custom-hover-page',
            $route.path === item.path ? 'bg-custom-hover-page shadow-sm' : '',
          ]" @click="closeMobileNavDropdown">
            <span class="material-icons text-xl mb-1">{{ item.icon }}</span>
            <span class="text-xs text-center font-khmer" v-if="language === 'kh'">{{ item.label.kh }}</span>
            <span class="text-xs text-center" v-else>{{ item.label.en }}</span>
          </RouterLink>

          <RouterLink to="/website" :class="[
            'flex flex-col items-center p-3 min-w-[80px] transition-colors duration-200 flex-shrink-0',
            'hover:bg-custom-hover-page',
            $route.path === '/website' ? 'bg-custom-hover-page shadow-sm' : '',
          ]" @click="closeMobileNavDropdown">
            <span class="material-icons text-xl mb-1">public</span>
            <span class="text-xs text-center" v-if="language === 'kh'">គេហទំព័រ</span>
            <span class="text-xs text-center" v-else>Website</span>
          </RouterLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { debounce } from "lodash";
import Swal from "sweetalert2";

// Stores and router
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// State
const language = ref(localStorage.getItem("language") || "en");
const searchQuery = ref("");
const notifications = ref(0);
const showNotifications = ref(false);
const showProfileDropdown = ref(false);
const isSidebarOpen = ref(true);
const isMobileSidebarOpen = ref(false);
const isOpen = ref(false);
const showMobileNavDropdown = ref(false);
const isLoading = ref(false);
const isTablet = ref(false);
const profileImageKey = ref(Date.now());
const userInfoKey = ref(Date.now());

// Navigation items with role-based access
const navItems = [
  {
    path: "/dashboard",
    icon: "dashboard",
    label: { en: "Dashboard", kh: "ផ្ទាំងគ្រប់គ្រង" },
    roles: ["admin"],
  },
  {
    path: "/books",
    icon: "menu_book",
    label: { en: "Books", kh: "សៀវភៅ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/borrows",
    icon: "autorenew",
    label: { en: "Borrow", kh: "ខ្ចី" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/categories",
    icon: "category",
    label: { en: "Categories", kh: "ប្រភេទ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/authors",
    icon: "person",
    label: { en: "Authors", kh: "អ្នកនិពន្ធ" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/Language",
    icon: "language",
    label: { en: "Languages", kh: "ភាសា" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/history",
    icon: "history",
    label: { en: "History", kh: "ប្រវត្តិ" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/users",
    icon: "people",
    label: { en: "Users", kh: "អ្នកប្រើប្រាស់" },
    roles: ["admin", "librarian"],
  },
  {
    path: "/profile",
    icon: "account_circle",
    label: { en: "Account", kh: "ប្រវត្តិរូប" },
    roles: ["admin", "librarian", "user"],
  },
  {
    path: "/summary",
    icon: "summarize",
    label: { en: "Summary", kh: "សង្ខេប" },
    roles: ["admin", "librarian"],
  }
];

// Filter nav based on user role
const filteredNav = computed(() => {
  const role = userStore.user?.role;
  if (!role) return [];
  return role === "admin"
    ? navItems
    : navItems.filter((item) => item.roles.includes(role));
});

const profileInitial = computed(
  () => userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || "?"
);

const profileImageUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  let image = userStore.userProfile?.user?.profile_image || userStore.user?.profile_image || localStorage.getItem("profile_image") || "";
  if (image && !image.startsWith("http") && !image.startsWith("data:image"))
    image = `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const isValidUrl = image && (image.startsWith("http") || image.startsWith("data:image"));
  const finalImage = isValidUrl ? image : "/default-profile.png";
  return finalImage.startsWith("http")
    ? `${finalImage}?t=${profileImageKey.value}`
    : finalImage;
});

const hasValidProfileImage = computed(() => {
  const image = userStore.userProfile?.user?.profile_image || userStore.user?.profile_image || localStorage.getItem('profile_image') || '';
  return image && (image.startsWith('http') || image.startsWith('data:image'));
});

const pageTitle = computed(() => {
  const map = {
    dashboard: { en: "Library Dashboard", kh: "ផ្ទាំងគ្រប់គ្រងបណ្ចាល័យ" },
    borrows: { en: "Borrow Management", kh: "គ្រប់គ្រងការខ្ចីសៀវភៅ" },
    books: { en: "Book Management", kh: "គ្រប់គ្រងសៀវភៅ" },
    users: { en: "User Management", kh: "គ្រប់គ្រងអ្នកប្រើប្រាស់" },
    authors: { en: "Author Management", kh: "គ្រប់គ្រងអ្នកនិពន្ធ" },
    categories: { en: "Category Management", kh: "គ្រប់គ្រងប្រភេទនៃសៀវភៅ" },
    language: { en: "Language Management", kh: "គ្រប់គ្រងភាសា" },
    summary: { en: "Summary Management", kh: "គ្រប់គ្រងការសង្ខេប" },
    history: { en: "History", kh: "ប្រវត្តិការខ្ចី" },
    profile: { en: "Profile", kh: "ប្រវត្តិរូប" },
  };
  const key = route.name;
  return (
    map[key]?.[language.value] ||
    (language.value === "en" ? "Library System" : "ប្រព័ន្ធបណ្ចាល័យ")
  );
});

// Watch for changes in userProfile to update navbar
watch(() => userStore.userProfile, (newProfile, oldProfile) => {
  if (newProfile?.user && (!oldProfile ||
    newProfile.user.profile_image !== oldProfile.user?.profile_image ||
    newProfile.user.username !== oldProfile.user?.username ||
    newProfile.user.email !== oldProfile.user?.email)) {
    updateProfileDisplay();
  }
}, { deep: true });

watch(() => localStorage.getItem('profile_image'), () => {
  updateProfileDisplay();
});

// Dropdown functions
function selectLanguage(lang) {
  language.value = lang;
  localStorage.setItem("language", lang);
  isOpen.value = false;
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  showProfileDropdown.value = false;
  isOpen.value = false;
}

function clearNotifications() {
  notifications.value = 0;
  showNotifications.value = false;
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value;
  showNotifications.value = false;
  isOpen.value = false;
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  isMobileSidebarOpen.value = false;
  showMobileNavDropdown.value = false;
}

function toggleMobileSidebar() {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
  showNotifications.value = false;
  showProfileDropdown.value = false;
  isOpen.value = false;
  showMobileNavDropdown.value = false;
}

const performSearch = debounce(async () => {
  if (searchQuery.value) console.log(`Searching for: ${searchQuery.value}`);
}, 300);

async function fetchUserProfile() {
  if (!userStore.token) return false;
  isLoading.value = true;
  try {
    const { success } = await userStore.fetchUserProfile();
    if (success) {
      updateProfileDisplay();
    } else {
      userStore.userProfile = null;
    }
    return success;
  } catch (error) {
    userStore.userProfile = null;
    console.error('Error fetching profile:', error);
  } finally {
    isLoading.value = false;
  }
}

function logout() {
  userStore.logout();
  showProfileDropdown.value = false;
}

function confirmLogout() {
  Swal.fire({
    title: language.value === "en" ? "Are you sure?" : "តើអ្នកប្រាកដទេ?",
    text: language.value === "en"
      ? "Do you really want to logout?"
      : "តើអ្នកពិតជាចង់ចាកចេញមែនទេ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText:
      language.value === "en" ? "Yes, Logout" : "បាទ/ចាស ចាកចេញ",
    cancelButtonText: language.value === "en" ? "Cancel" : "បោះបង់",
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
}

function handleImageError() {
  userStore.userProfile = { ...userStore.userProfile, user: { ...userStore.userProfile?.user, profile_image: null } };
  userStore.user = { ...userStore.user, profile_image: null };
  localStorage.removeItem('profile_image');
  updateProfileDisplay();
}

function closeMobileSidebar() {
  isMobileSidebarOpen.value = false;
  showMobileNavDropdown.value = false;
}

function toggleMobileNavDropdown() {
  showMobileNavDropdown.value = !showMobileNavDropdown.value;
  if (showMobileNavDropdown.value) {
    showNotifications.value = false;
    showProfileDropdown.value = false;
    isOpen.value = false;
  }
}

function closeMobileNavDropdown() {
  showMobileNavDropdown.value = false;
}

function handleClickOutside(event) {
  const dropdowns = [
    { button: ".profile-button", menu: ".profile-menu", state: showProfileDropdown },
    {
      button: ".notifications-button",
      menu: ".notifications-menu",
      state: showNotifications,
    },
    { button: ".language-button", menu: ".language-menu", state: isOpen },
    { button: ".mobile-menu-button", menu: ".mobile-nav-dropdown", state: showMobileNavDropdown },
  ];

  dropdowns.forEach((d) => {
    const btn = document.querySelector(d.button);
    const menu = document.querySelector(d.menu);
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target))
      d.state.value = false;
  });
}

async function checkOverdueBorrows() {
  try {
    await userStore.fetchBorrows();
    notifications.value = userStore.overdueBorrows.length;
  } catch (error) {
    notifications.value = 0;
    console.error('Error checking overdue borrows:', error);
  }
}

function goToBorrowDetails(borrowId) {
  router.push(`/borrows`);
  showNotifications.value = false;
  isMobileSidebarOpen.value = false;
  showMobileNavDropdown.value = false;
}

// Function to check if device is tablet
function checkTabletDevice() {
  const width = window.innerWidth;
  isTablet.value = width >= 768 && width <= 1024;

  // Auto-close sidebar on tablet
  if (isTablet.value) {
    isSidebarOpen.value = false;
  }
}

function updateProfileDisplay() {
  profileImageKey.value = Date.now();
  userInfoKey.value = Date.now();
  console.log('Profile display updated at:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  const cachedImage = localStorage.getItem("profile_image");
  if (cachedImage && !userStore.userProfile?.user?.profile_image && !userStore.user?.profile_image) {
    userStore.user = { ...userStore.user, profile_image: cachedImage };
  }
  fetchUserProfile();
  checkOverdueBorrows();
  const interval = setInterval(checkOverdueBorrows, 300000);
  onUnmounted(() => clearInterval(interval));

  const handleResize = () => {
    checkTabletDevice();

    if (window.innerWidth < 768) {
      isSidebarOpen.value = false;
    } else if (window.innerWidth < 1024) {
      isSidebarOpen.value = false;
    } else {
      isSidebarOpen.value = true;
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();
  onUnmounted(() => window.removeEventListener("resize", handleResize));
});

const refreshProfile = async () => {
  await fetchUserProfile();
};

defineExpose({
  refreshProfile,
  updateProfileDisplay
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Improved responsive design */
@media (max-width: 767px) {
  .header-right {
    flex-wrap: nowrap;
  }
}

/* Ensure proper spacing and alignment */
.min-w-0 {
  min-width: 0;
}

/* Smooth transitions for sidebar */
aside {
  transition: width 0.3s ease;
}

/* Better mobile experience */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
}

/* Additional styles for tablet bottom navigation */
@media (max-width: 1024px) and (min-width: 768px) {
  main {
    padding-bottom: 80px !important;
  }
}
</style>