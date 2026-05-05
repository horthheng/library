import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
import DefaultLayout from '@/views/website/MainWeb.vue'

// Public Views
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Website from '@/views/website/pages/HomeWebView.vue'
import AboutWebView from '@/views/website/pages/AboutWebView.vue'
import BookWebView from '@/views/website/pages/BookWebView.vue'
import profileWeb from '@/views/website/pages/profile-web.vue'
import SummaryWeb from '@/views/website/pages/SummaryWebView.vue'

// Protected Views
import Dashboard from '@/views/DashboardView.vue'
import BorrowList from '@/views/borrows/BorrowList.vue'
import UserListView from '@/views/User/UserListView.vue'
import ListBook from '@/views/books/BookList.vue'
import LanguageView from '@/views/Lang/LanguageView.vue'
import UserProfile from '@/components/Users/UserProfile.vue'
import summary from '@/views/Summary/Summary.vue'

const routes = [
  // Redirect root to login
  { path: '/', redirect: '/login' },

  // Public Auth Routes
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false } },

  // Public Website Pages (DefaultLayout)
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'website', name: 'website', component: Website, meta: { requiresAuth: false } },
      { path: 'about-us', name: 'about', component: AboutWebView, meta: { requiresAuth: false } },
      { path: 'web-book', name: 'web-book', component: BookWebView, meta: { requiresAuth: false } },
      { path: 'profile-web', name: 'profile-web', component: profileWeb, meta: { requiresAuth: false } },
      { path: 'web-summary', name: 'web-summary', component: SummaryWeb, meta: { requiresAuth: false } },
    ]
  },

  // Protected Routes (AppLayout)
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { roles: ['admin'] } },
      { path: 'users', name: 'users', component: UserListView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'language', name: 'language', component: LanguageView, meta: { roles: ['admin', 'librarian'] } },
      { path: 'books', name: 'books', component: ListBook, meta: { roles: ['admin', 'librarian'] } },
      { path: 'borrows', name: 'borrows', component: BorrowList, meta: { roles: ['admin', 'librarian'] } },
      { path: 'categories', name: 'categories', component: () => import('@/views/CategoryManagement/categorymanagementView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'authors', name: 'authors', component: () => import('@/views/Author/AddauthorView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'history', name: 'history', component: () => import('@/views/history/HistoryView.vue'), meta: { roles: ['admin', 'librarian'] } },
      { path: 'profile', name: 'profile', component: UserProfile, meta: { roles: ['admin', 'librarian'] } },
      { path: 'summary', name: 'summary', component: summary, meta: { roles: ['admin', 'librarian'] } },
    ],
  },

  // Fallback to login for unmatched routes
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useUserStore();

  // Fetch profile if token exists but no user in store
  if (!authStore.user && sessionStorage.getItem('token')) {
    try {
      await authStore.fetchUserProfile();
    } catch {
      authStore.resetAuth();
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }
  }

  const isLoggedIn = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Handle public routes
  if (to.meta.requiresAuth === false) {
    if (isLoggedIn && (to.name === 'login' || to.name === 'register')) {
      // Redirect logged-in users to their default route
      if (userRole === 'admin') return next('/dashboard');
      if (userRole === 'librarian') return next('/books');
      if (userRole === 'user' || userRole === 'borrower') return next('/website');
    }
    return next();
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // Check role-based access
  if (to.meta.roles && userRole && !to.meta.roles.includes(userRole)) {
    // Redirect to default route for the user's role
    if (userRole === 'admin') return next('/dashboard');
    if (userRole === 'librarian') return next('/books');
    if (userRole === 'user' || userRole === 'borrower') return next('/website');
  }

  next();
});

export default router