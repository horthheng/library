<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/views/website/layouts/Navbar.vue';
import Footer from '@/views/website/layouts/Footer.vue';
</script>