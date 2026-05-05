<template>
  <div class="flex-1">
    <p class="font-semibold">{{ type === 'success' ? 'Success' : 'Error' }}</p>
    <p class="text-sm mt-1">{{ message }}</p>
    <button
      @click="$emit('close')"
      class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors absolute top-4 right-4"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    default: 'success',
  },
  message: {
    type: String,
    required: true,
    default: '',
  },
});

defineEmits(['close']);
</script>