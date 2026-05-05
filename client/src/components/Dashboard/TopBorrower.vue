<template>
    <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 
              max-w-md mx-auto md:max-w-full xl:max-w-md">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">Most Active Borrowers</h3>
        </div>

        <!-- Main card showing top borrowers -->
        <div class="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
            <div v-for="member in topBorrowers" :key="member.id"
                class="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="relative">
                    <img :src="member.avatar" :alt="member.name" class="w-14 h-14 rounded-full object-cover" />
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ member.name }}</h4>
                    <p class="text-sm text-gray-500">{{ member.books }} books</p>
                </div>
                <div class="text-right">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>


        <!-- Modal (unchanged) -->
        <Transition name="modal">
            <div v-if="showModal"
                class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="showModal = false">
                <div
                    class="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl border border-gray-300 flex flex-col">
                    <!-- Header and content unchanged -->
                </div>
            </div>
        </Transition>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { getTopBorrowers } from "@/services/Api/dashboard"; // Adjust path as needed

const topBorrowers = ref([]);
const showModal = ref(false);
const error = ref(null);

const loadTopBorrowers = async () => {
    try {
        const response = await getTopBorrowers();
        topBorrowers.value = response.data.map((user) => ({
            id: user.id,
            name: user.username || user.name,
            avatar:
                user.profile_image ||
                user.avatar ||
                `${process.env.BASE_URL || "http://localhost:5000"}/uploads/default-avatar.png`,
            books: user.books || 0,
        }));
    } catch (err) {
        error.value = "Failed to load top borrowers";
        console.error("Failed to load top borrowers", err);
    }
};

onMounted(() => {
    loadTopBorrowers();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

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