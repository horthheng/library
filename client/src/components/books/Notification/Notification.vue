<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2"
  >
    <div v-if="notification.visible"
      :class="[
        'fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl shadow-2xl border-l-4 p-6',
        notification.type === 'success'
          ? 'bg-green-50 border-green-500 text-green-800'
          : 'bg-red-50 border-red-500 text-red-800',
      ]"
    >
      <div class="flex items-start gap-4">
        <NotificationIcon :type="notification.type" />
        <NotificationMessage
          :type="notification.type"
          :message="notification.message"
          @close="notification.visible = false"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import NotificationIcon from './NotificationIcon.vue';
import NotificationMessage from './NotificationMessage.vue';

const props = defineProps({
  notification: {
    type: Object,
    required: true,
    default: () => ({
      visible: false,
      message: '',
      type: '',
    }),
  },
});

watch(
  () => props.notification.visible,
  (visible) => {
    if (visible) {
      setTimeout(() => {
        props.notification.visible = false;
      }, 3000);
    }
  }
);
</script>

<style scoped>
.fixed {
  transition: opacity 0.2s ease;
}
</style>