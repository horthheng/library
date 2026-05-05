<template>
    <div class="flex justify-between items-center p-8">
        <div class="text-white">
            <h1 class="text-3xl font-bold mb-2">Hi, Book Manager</h1>
            <p class="text-blue-100 text-lg">Ready to manage your library collection?</p>
        </div>
        <div class="hidden md:block">
            <div
                class="w-48 h-32 bg-white bg-opacity-10 rounded-xl flex items-center justify-center border border-white/20">
                <svg class="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Subtle floating dots for decoration -->
    <div class="absolute top-6 right-20 w-3 h-3 bg-white/20 rounded-full"></div>
    <div class="absolute top-16 right-32 w-2 h-2 bg-white/15 rounded-full"></div>
    <div class="absolute bottom-8 right-16 w-4 h-4 bg-white/25 rounded-full"></div>
</template>

<script setup>

</script>

<style scoped></style>