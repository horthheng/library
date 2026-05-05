<template>
  <div class="relative inline-block">
    <!-- Loading State -->
    <div 
      v-if="isLoading" 
      :class="['rounded-full bg-gray-200 animate-pulse border-2 border-gray-300 flex items-center justify-center', sizeClass]"
    >
      <svg :class="iconSizeClass" class="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>

    <!-- Main Avatar Image -->
    <div v-else class="relative">
      <img
        v-if="!hasError && (src || fallbackSrc)"
        :src="currentSrc"
        :alt="name"
        :class="['rounded-full object-cover transition-all duration-200', sizeClass, borderClass, { 'hover:scale-105': hoverable }]"
        @load="onImageLoad"
        @error="onImageError"
        @click="handleClick"
      />
      
      <!-- Fallback when no image and no name -->
      <div 
        v-else-if="!name"
        :class="['rounded-full bg-gray-300 flex items-center justify-center', sizeClass, borderClass]"
      >
        <svg :class="iconSizeClass" class="text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <!-- Generated Avatar from UI Avatars -->
      <img
        v-else
        :src="generatedAvatarUrl"
        :alt="name"
        :class="['rounded-full object-cover transition-all duration-200', sizeClass, borderClass, { 'hover:scale-105': hoverable }]"
        @click="handleClick"
      />

      <!-- Online Status Indicator -->
      <div 
        v-if="showStatus && status"
        :class="['absolute rounded-full border-2 border-white', statusPositionClass, statusSizeClass, statusColorClass]"
      ></div>

      <!-- Badge/Notification Indicator -->
      <div 
        v-if="badge"
        :class="['absolute rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white', badgePositionClass, badgeSizeClass]"
      >
        {{ badge > 99 ? '99+' : badge }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  name: { 
    type: String, 
    required: true 
  },
  src: { 
    type: String, 
    default: '' 
  },
  size: { 
    type: String, 
    default: 'medium',
    validator: (value) => ['xs', 'small', 'medium', 'large', 'xl', '2xl'].includes(value)
  },
  status: {
    type: String,
    default: '',
    validator: (value) => ['', 'online', 'offline', 'away', 'busy'].includes(value)
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  badge: {
    type: [Number, String],
    default: null
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  borderColor: {
    type: String,
    default: 'gray-300'
  },
  backgroundColor: {
    type: String,
    default: 'random'
  },
  textColor: {
    type: String,
    default: 'ffffff'
  }
});

const emit = defineEmits(['click', 'imageLoad', 'imageError']);

const isLoading = ref(false);
const hasError = ref(false);
const fallbackSrc = ref('');

// Computed properties for styling
const sizeClass = computed(() => {
  const sizes = {
    'xs': 'w-6 h-6',
    'small': 'w-8 h-8',
    'medium': 'w-10 h-10',
    'large': 'w-16 h-16',
    'xl': 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };
  return sizes[props.size] || sizes.medium;
});

const iconSizeClass = computed(() => {
  const sizes = {
    'xs': 'w-3 h-3',
    'small': 'w-4 h-4',
    'medium': 'w-5 h-5',
    'large': 'w-8 h-8',
    'xl': 'w-10 h-10',
    '2xl': 'w-12 h-12'
  };
  return sizes[props.size] || sizes.medium;
});

const borderClass = computed(() => {
  return `border-2 border-${props.borderColor} ${props.clickable ? 'cursor-pointer' : ''}`;
});

const statusPositionClass = computed(() => {
  const positions = {
    'xs': '-bottom-0 -right-0',
    'small': '-bottom-0 -right-0',
    'medium': '-bottom-0 -right-0',
    'large': '-bottom-1 -right-1',
    'xl': '-bottom-1 -right-1',
    '2xl': '-bottom-2 -right-2'
  };
  return positions[props.size] || positions.medium;
});

const statusSizeClass = computed(() => {
  const sizes = {
    'xs': 'w-2 h-2',
    'small': 'w-2.5 h-2.5',
    'medium': 'w-3 h-3',
    'large': 'w-4 h-4',
    'xl': 'w-5 h-5',
    '2xl': 'w-6 h-6'
  };
  return sizes[props.size] || sizes.medium;
});

const statusColorClass = computed(() => {
  const colors = {
    'online': 'bg-green-500',
    'offline': 'bg-gray-400',
    'away': 'bg-yellow-500',
    'busy': 'bg-red-500'
  };
  return colors[props.status] || 'bg-gray-400';
});

const badgePositionClass = computed(() => {
  const positions = {
    'xs': '-top-1 -right-1',
    'small': '-top-1 -right-1',
    'medium': '-top-2 -right-2',
    'large': '-top-2 -right-2',
    'xl': '-top-3 -right-3',
    '2xl': '-top-3 -right-3'
  };
  return positions[props.size] || positions.medium;
});

const badgeSizeClass = computed(() => {
  const sizes = {
    'xs': 'w-4 h-4 text-xs',
    'small': 'w-5 h-5 text-xs',
    'medium': 'w-6 h-6 text-xs',
    'large': 'w-7 h-7 text-sm',
    'xl': 'w-8 h-8 text-sm',
    '2xl': 'w-9 h-9 text-base'
  };
  return sizes[props.size] || sizes.medium;
});

const currentSrc = computed(() => {
  return hasError.value ? fallbackSrc.value : props.src;
});

const generatedAvatarUrl = computed(() => {
  if (!props.name) return '';
  
  const params = new URLSearchParams({
    name: props.name,
    background: props.backgroundColor,
    color: props.textColor,
    size: '200', // Always use high resolution
    format: 'png',
    rounded: 'true',
    bold: 'true'
  });
  
  return `https://ui-avatars.com/api/?${params.toString()}`;
});

// Watch for src changes to reset error state
watch(() => props.src, (newSrc) => {
  if (newSrc && newSrc !== currentSrc.value) {
    hasError.value = false;
    isLoading.value = true;
  }
});

// Event handlers
function onImageLoad() {
  isLoading.value = false;
  hasError.value = false;
  emit('imageLoad');
}

function onImageError() {
  isLoading.value = false;
  hasError.value = true;
  
  // Try to generate a fallback image URL
  if (props.name) {
    fallbackSrc.value = generatedAvatarUrl.value;
  }
  
  emit('imageError', props.src);
  console.warn('Avatar image failed to load:', props.src);
}

function handleClick() {
  if (props.clickable) {
    emit('click');
  }
}

// Initialize loading state if src is provided
if (props.src) {
  isLoading.value = true;
}
</script>