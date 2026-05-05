<template>
  <div v-for="(stat, index) in modernStats" :key="index"
    class="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
    @click="navigateToDetails(stat)">
    <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
      :class="stat.gradient"></div>

    <div class="flex items-center justify-between mb-4">
      <div class="p-3 rounded-2xl" :class="stat.iconBg">
        <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath" />
        </svg>
      </div>
      <div class="text-right">
        <div class="flex items-center space-x-1">
          <svg class="w-4 h-4" :class="stat.trendColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.trendIcon" />
          </svg>
          <span class="text-sm font-semibold" :class="stat.trendColor">{{ stat.change }}</span>
        </div>
      </div>
    </div>

    <div class="mb-2">
      <h3 class="text-gray-600 font-medium text-sm">{{ stat.title }}</h3>
      <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-500">{{ stat.subtitle }}</span>
      <button class="text-xs font-medium px-3 py-1 rounded-full cursor-pointer" :class="stat.buttonStyle"
        @click.stop="navigateToDetails(stat)" :disabled="!stat.route">
        Click Here
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useBorrowManagement } from '@/composables/useBorrowManagement';
import { useUserStore } from '@/stores/userStore';
import { getLastMonthBook } from '@/services/Api/dashboard';
import { useRouter } from 'vue-router';

const router = useRouter();
const booksLastMonth = ref(0);

const fetchBooksLastMonth = async () => {
  try {
    const res = await getLastMonthBook();
    console.log('Books Last Month Response:', res);
    booksLastMonth.value = Number(res.data?.total || res.totalBooks || 0);
  } catch (err) {
    console.error('Failed to fetch books last month:', err);
    booksLastMonth.value = 0;
  }
};

const { borrowData, getItemStatus, fetchBorrowData } = useBorrowManagement();
const userStore = useUserStore();

const totalMembersCount = computed(() => {
  const members = userStore.users.filter((u) => {
    const roleName = (u.Role?.name || u.role?.name || '').toLowerCase();
    if (!roleName) console.warn('User with missing role:', u);
    return roleName === 'user' || roleName === 'borrower';
  });
  console.log('Total members:', members.length, 'Users:', members.map(u => ({ id: u.id, role: u.Role?.name || u.role?.name })));
  return members.length;
});

const borrowedCount = computed(() =>
  borrowData.value.filter((item) => getItemStatus(item) === 'borrowed').length
);

const overdueCount = computed(() =>
  borrowData.value.filter((item) => getItemStatus(item) === 'overdue').length
);

const modernStats = computed(() => [
  {
    title: 'All Books',
    value: booksLastMonth.value,
    route: { name: 'books' },
    // change: '+0%',
    subtitle: 'In previous month',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-blue-500 to-cyan-500',
    buttonStyle: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  },
  {
    title: 'Total Members',
    value: totalMembersCount,
    route: { name: 'users' },
    // change: '+0%',
    subtitle: 'registered to the system',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    trendColor: 'text-green-600',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-emerald-500 to-teal-500',
    buttonStyle: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
  },
  {
    title: 'Books Borrowed',
    value: borrowedCount.value,
    route: { name: 'borrows', query: { status: 'Borrowed' } },
    // change: '10%',
    subtitle: 'books currently out',
    iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    trendColor: 'text-yellow-600',
    // trendIcon: 'M13 12h8m0 0V4m0 8l-8-8-4 4-6-6',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-purple-500 to-pink-500',
    buttonStyle: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  },
  {
    title: 'Overdue Books',
    value: overdueCount.value,
    route: { name: 'borrows', query: { status: 'overdue' } },
    // change: '-',21
    subtitle: 'books returned late',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    trendColor: 'text-red-600',
    // trendIcon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
    trendIcon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    gradient: 'from-red-500 to-pink-500',
    buttonStyle: 'bg-red-50 text-red-600 hover:bg-red-100',
  },
]);

const navigateToDetails = (stat) => {
  if (!stat.route) return;
  try {
    router.push(stat.route);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

let intervalId;

onMounted(async () => {
  try {
    await Promise.all([fetchBooksLastMonth(), fetchBorrowData(), userStore.fetchUsers()]);
    console.log('Initial users:', userStore.users);
    userStore.users = [...userStore.users]; // Force reactivity
    intervalId = setInterval(fetchBooksLastMonth, 60000);
  } catch (err) {
    console.error('Error in onMounted:', err);
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>