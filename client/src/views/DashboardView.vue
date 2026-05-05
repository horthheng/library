<template>
  <div class="bg-gray-100">
    <div class="p-5">
      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-gradient-to-b from-[#065084] to-[#3D74B6] rounded-3xl mb-8">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>

        <!-- Floating Elements -->
        <div class="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-10 right-40 w-20 h-20 bg-blue-400/20 rounded-full blur-lg"></div>

        <div class="relative z-10 px-5 py-10 md:px-10 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="text-white">
              <div class="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                System Online
              </div>
              <h2 class="text-3xl font-bold mb-3 leading-tight">
                Your Digital
                <span class="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Library Hub
                </span>
              </h2>
              <p class="text-l text-blue-100 mb-5 leading-relaxed">
                Streamline your library operations with our intelligent management system.
                Track inventory, manage members, and analyze trends effortlessly.
              </p>
              <div class="flex sm:flex-row gap-1">
                <button @click="goToBooks"
                  class="bg-white text-blue-900 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  View Books
                </button>
              </div>
            </div>

            <div>
              <img src="../../public/banner.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- Card to show total of book -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCardGrid />
      </div>

      <!-- Limited Books -->
      <div
        class="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg border border-gray-200/50 mb-8 backdrop-blur-sm">
        <LimitedBook />
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Left Sidebar / Activity Chart -->
        <div class="md:col-span-3 xl:col-span-2">
          <ActivityChart />
        </div>

        <!-- Right Sidebar / Top Borrowers -->
        <div class="space-y-8 md:col-span-3 xl:col-span-1">
          <TopBorrower />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Components
import StatsCardGrid from '@/components/Dashboard/StatsCardGrid.vue';
import LimitedBook from '@/components/Dashboard/LimitedBook.vue';
import TopBorrower from '@/components/Dashboard/TopBorrower.vue';
import ActivityChart from '@/components/Dashboard/ActivityChart.vue';

const router = useRouter();

// Navigation to Books page
const goToBooks = () => {
  router.push({ name: 'books' });
}
</script>