<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserTable from '@/components/Users/UserTable.vue';
import UserForm from '@/components/Users/UserForm.vue';
import UserViewModal from '@/components/Users/UserViewModal.vue';
import UserCard from '@/components/Users/UserCard.vue';
import Swal from 'sweetalert2';

const userStore = useUserStore();

const showFormModal = ref(false);
const showViewModal = ref(false);
const isEditing = ref(false);
const selectedUser = ref(null);
const selectedUserId = ref(null);
const selectedUserForPrint = ref(null);
const printCardRef = ref(null);
const formUserData = ref({});

const searchQuery = ref('');
const roleFilter = ref('all');
const activeStatusFilter = ref('all');
const startDate = ref(null);
const endDate = ref(null);

const currentPage = ref(1);
const itemsPerPage = ref(5);
const selectedUsers = ref([]);

// Fetch users and roles on mount
onMounted(() => {
  userStore.fetchUsers().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to load users',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
  userStore.fetchRoles().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to load roles',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
});

// Computed: Filter users
const filteredUsers = computed(() => {
  let filtered = userStore.users;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(user =>
      (user.username && user.username.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.id && user.id.toString().includes(query))
    );
  }

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role?.name.toLowerCase() === roleFilter.value);
  }

  if (activeStatusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status.toLowerCase() === activeStatusFilter.value);
  }

  if (startDate.value && endDate.value) {
    filtered = filtered.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= new Date(startDate.value) && createdAt <= new Date(endDate.value);
    });
  }

  return filtered;
});

// Computed: Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1;
});

// Computed: Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Computed: Dynamic page buttons
const pageButtons = computed(() => {
  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, currentPage.value - half);
  let endPage = Math.min(totalPages.value, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// Computed: Number of selected users
const selectedCount = computed(() => selectedUsers.value.length);

// Computed: Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' ||
    roleFilter.value !== 'all' ||
    activeStatusFilter.value !== 'all' ||
    startDate.value ||
    endDate.value;
});

// Reset current page when filters change
watch([searchQuery, roleFilter, activeStatusFilter, startDate, endDate, itemsPerPage], () => {
  currentPage.value = 1;
});

function resetFilters() {
  searchQuery.value = '';
  roleFilter.value = 'all';
  activeStatusFilter.value = 'all';
  startDate.value = null;
  endDate.value = null;
}

function openAddUser() {
  isEditing.value = false;
  formUserData.value = {
    username: '',
    email: '',
    password: '',
    phone: '',
    RoleId: '',
    date_of_birth: '',
    profile_image: '',
    status: 'active',
  };
  selectedUserId.value = null;
  showFormModal.value = true;
}

function openEditUser(user) {
  isEditing.value = true;
  formUserData.value = {
    username: user.username || '',
    email: user.email || '',
    password: '',
    date_of_birth: user.date_of_birth || '',
    phone: user.phone || '',
    RoleId: user.role?.id || '',
    profile_image: user.profile_image || '',
    status: user.status || 'active',
  };
  selectedUserId.value = user.id;
  showFormModal.value = true;
}

function openViewUser(user) {
  selectedUser.value = user;
  showViewModal.value = true;
}

function handleFormSubmitSuccess() {
  showFormModal.value = false;
  userStore.fetchUsers().catch(e => {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: e.message || 'Failed to reload users',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  });
}

async function confirmDeleteUser(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    background: '#fff',
  });

  if (!result.isConfirmed) return;

  const res = await userStore.deleteUser(id);
  if (res.success) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'User has been deleted.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    selectedUsers.value = selectedUsers.value.filter(userId => userId !== id);
  } else {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: res.error || 'Failed to delete user',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
}

async function deleteSelected() {
  if (selectedUsers.value.length === 0) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'warning',
      title: 'No users selected',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    return;
  }

  const result = await Swal.fire({
    title: `Delete ${selectedUsers.value.length} user${selectedUsers.value.length > 1 ? 's' : ''}?`,
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete them!',
    background: '#fff',
  });

  if (!result.isConfirmed) return;

  const ids = [...selectedUsers.value];
  let successCount = 0;
  let errorCount = 0;

  for (const id of ids) {
    const res = await userStore.deleteUser(id);
    if (res.success) {
      successCount++;
      selectedUsers.value = selectedUsers.value.filter(userId => userId !== id);
    } else {
      errorCount++;
    }
  }

  if (successCount > 0) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: `${successCount} user${successCount > 1 ? 's' : ''} deleted successfully.`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    await userStore.fetchUsers();
  }

  if (errorCount > 0) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: `Failed to delete ${errorCount} user${errorCount > 1 ? 's' : ''}.`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
}

// In the handlePrintUser function
const handlePrintUser = async (userId) => {
  console.log('handlePrintUser called with userId:', userId);
  const user = userStore.users.find(u => u.id === userId);
  if (user) {
    console.log('User found:', user);
    selectedUserForPrint.value = user;
    await nextTick();
    console.log('printCardRef:', printCardRef.value);
    if (printCardRef.value) {
      try {
        await printCardRef.value.generateCard();
        // Remove from selected users after successful print
        selectedUsers.value = selectedUsers.value.filter(id => id !== userId);
        selectedUserForPrint.value = null;
      } catch (error) {
        console.error('Error calling generateCard:', error);
        selectedUserForPrint.value = null;
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: 'Failed to generate card image',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          width: '300px',
          padding: '0.5em 1em',
          background: '#fff',
        });
      }
    } else {
      console.error('printCardRef is not available');
      selectedUserForPrint.value = null;
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Print component not found',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        width: '300px',
        padding: '0.5em 1em',
        background: '#fff',
      });
    }
  } else {
    console.error('User not found for ID:', userId);
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: 'User not found',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
};

// In the printSelected function
const printSelected = async () => {
  if (selectedUsers.value.length === 0) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'warning',
      title: 'No users selected for printing',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    return;
  }
  
  // Create a copy of selected users to iterate over
  const idsToPrint = [...selectedUsers.value];
  
  for (const id of idsToPrint) {
    const user = userStore.users.find(u => u.id === id);
    if (!user) continue;
    
    selectedUserForPrint.value = user;
    await nextTick();
    
    if (printCardRef.value) {
      try {
        await printCardRef.value.generateCard();
        // Remove this user from selected list after successful print
        selectedUsers.value = selectedUsers.value.filter(selectedId => selectedId !== id);
      } catch (error) {
        console.error('Error generating card for user:', id, error);
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: `Failed to generate card for user ${id}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          width: '300px',
          padding: '0.5em 1em',
          background: '#fff',
        });
      }
    }
    selectedUserForPrint.value = null;
  }
};

const toggleSelect = (id) => {
  if (selectedUsers.value.includes(id)) {
    selectedUsers.value = selectedUsers.value.filter(i => i !== id);
  } else {
    selectedUsers.value.push(id);
  }
};

const handleToggleSelectAll = (checked) => {
  const currentIds = paginatedUsers.value.map(u => u.id);
  if (checked) {
    selectedUsers.value = [...new Set([...selectedUsers.value, ...currentIds])];
  } else {
    selectedUsers.value = selectedUsers.value.filter(id => !currentIds.includes(id));
  }
};

async function submitForm() {
  let res;
  if (isEditing.value) {
    const formData = new FormData();
    formData.append('username', formUserData.value.username);
    formData.append('email', formUserData.value.email);
    if (formUserData.value.password) {
      formData.append('password', formUserData.value.password);
    }
    if (formUserData.value.phone) {
      formData.append('phone', formUserData.value.phone);
    }
    if (formUserData.value.RoleId) {
      formData.append('RoleId', formUserData.value.RoleId);
    }
    if (formUserData.value.date_of_birth) {
      formData.append('date_of_birth', formUserData.value.date_of_birth);
    }
    if (formUserData.value.profile_image_file) {
      formData.append('profile_image', formUserData.value.profile_image_file);
    }
    formData.append('status', formUserData.value.status);

    res = await userStore.updateUser(selectedUserId.value, formData);
  } else {
    const formData = new FormData();
    formData.append('username', formUserData.value.username);
    formData.append('email', formUserData.value.email);
    formData.append('password', formUserData.value.password);
    if (formUserData.value.phone) {
      formData.append('phone', formUserData.value.phone);
    }
    if (formUserData.value.RoleId) {
      formData.append('RoleId', formUserData.value.RoleId);
    }
    if (formUserData.value.date_of_birth) {
      formData.append('date_of_birth', formUserData.value.date_of_birth);
    }
    if (formUserData.value.profile_image_file) {
      formData.append('profile_image', formUserData.value.profile_image_file);
    }
    formData.append('status', formUserData.value.status);

    res = await userStore.createUser(formData);
  }

  if (res.success) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: isEditing.value ? 'User updated successfully.' : 'User created successfully.',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
    handleFormSubmitSuccess();
  } else {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'error',
      title: res.error || 'Something went wrong',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      width: '300px',
      padding: '0.5em 1em',
      background: '#fff',
    });
  }
}
</script>

<template>
  <div class="p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 text-balance">User Management</h1>
            <p class="text-gray-600 mt-2 text-pretty leading-relaxed max-w-2xl">
              Comprehensive overview and management of all users including statistics, filtering, and bulk operations.
            </p>
          </div>

          <!-- Primary Action -->
          <div class="flex-shrink-0">
            <button @click="openAddUser"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span class="material-icons text-xl">add</span>
              Add New User
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500 rounded-xl text-white shadow-sm">
              <span class="material-icons text-2xl">group</span>
            </div>
            <div>
              <p class="text-sm font-medium text-blue-700 uppercase tracking-wide">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ userStore.users.length }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-500 rounded-xl text-white shadow-sm">
              <span class="material-icons text-2xl">verified_user</span>
            </div>
            <div>
              <p class="text-sm font-medium text-emerald-700 uppercase tracking-wide">Active Users</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ userStore.activeUsersCount }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-violet-500 rounded-xl text-white shadow-sm">
              <span class="material-icons text-2xl">person_add</span>
            </div>
            <div>
              <p class="text-sm font-medium text-violet-700 uppercase tracking-wide">New This Month</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ userStore.newUsersCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Filters and Actions Section -->
        <div class="bg-white shadow-sm border border-gray-200 p-6">
          <!-- Search and Filters -->
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Search Input -->
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="material-icons text-gray-400 text-xl">search</span>
              </div>
              <input type="text" v-model="searchQuery" placeholder="Search by name, email, or ID..."
                class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm placeholder-gray-500 transition-colors"
                aria-label="Search users" />
            </div>

            <!-- Filter Controls -->
            <div class="flex flex-col sm:flex-row gap-3">
              <select v-model="roleFilter"
                class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-[140px] transition-colors"
                aria-label="Filter by role">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="librarian">Librarian</option>
                <option value="user">User</option>
              </select>

              <select v-model="activeStatusFilter"
                class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm min-w-[140px] transition-colors"
                aria-label="Filter by status">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <!-- Reset Filters Button -->
              <button v-if="hasActiveFilters" @click="resetFilters"
                class="inline-flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors border border-gray-300">
                <span class="material-icons text-lg">clear</span>
                Reset
              </button>
            </div>
          </div>

          <!-- Bulk Actions -->
          <div v-if="selectedCount > 0"
            class="flex flex-wrap items-center gap-3 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <span class="text-sm font-medium text-blue-800">
              {{ selectedCount }} user{{ selectedCount > 1 ? 's' : '' }} selected
            </span>
            <div class="flex gap-2">
              <button @click="printSelected"
                class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                <span class="material-icons text-lg">print</span>
                Print Selected
              </button>
              <button @click="deleteSelected"
                class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                <span class="material-icons text-lg">delete</span>
                Delete Selected
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span class="material-icons text-gray-400 text-2xl">search_off</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p class="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>

        <div v-else>
          <UserTable :users="paginatedUsers" :roles="userStore.roles" :selectedIds="selectedUsers"
            @edit-user="openEditUser" @view-user="openViewUser" @delete-user="confirmDeleteUser"
            @print-user="handlePrintUser" @toggle-select="toggleSelect" @toggle-select-all="handleToggleSelectAll" />

          <!-- Pagination -->
          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-gray-200 bg-white">
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700">Show:</label>
              <select v-model="itemsPerPage"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm transition-colors"
                aria-label="Items per page">
                <option value="5">5 per page</option>
                <option value="15">15 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>

            <nav class="flex items-center gap-2">
              <button @click="currentPage = Math.max(currentPage - 1, 1)" :disabled="currentPage === 1"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span class="material-icons text-lg">chevron_left</span>
                Previous
              </button>

              <div class="flex gap-1">
                <button v-for="page in pageButtons" :key="page" @click="currentPage = page" :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>
              </div>

              <button @click="currentPage = Math.min(currentPage + 1, totalPages)"
                :disabled="currentPage === totalPages"
                class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next
                <span class="material-icons text-lg">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UserForm :show="showFormModal" :isEditing="isEditing" :formData="formUserData" :userId="selectedUserId"
      @close="showFormModal = false" @submit-success="handleFormSubmitSuccess" />

    <UserViewModal :show="showViewModal" :user="selectedUser" @close="showViewModal = false" />

    <UserCard v-if="selectedUserForPrint" ref="printCardRef" :user="selectedUserForPrint" systemName="PNC Library"
      logoUrl="/logo.png" class="user-card" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>