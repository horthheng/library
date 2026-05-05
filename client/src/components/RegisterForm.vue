<template>
  <div class="relative z-10 w-full max-w-md backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl p-8">
    <h2 class="text-2xl font-bold text-white text-center mb-6">Create Your Account</h2>
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Full Name</label>
        <input v-model="form.username" type="text" required placeholder="Your Full Name"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Email</label>
        <input v-model="form.email" type="email" required placeholder="example@mail.com"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Phone Number</label>
        <input v-model="form.phone" type="tel" required pattern="\d{10}" placeholder="0987654333"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"
          @input="validatePhone"/>
        <span v-if="phoneError" class="text-red-400 text-xs">{{ phoneError }}</span>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Password</label>
        <input v-model="form.password" type="password" required placeholder="Enter your password"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-sm font-medium text-white mb-1">Confirm Password</label>
        <input v-model="form.confirmPassword" type="password" required placeholder="Re-enter your password"
          class="w-full px-4 py-2 bg-transparent text-white border border-white/50 rounded-xl focus:ring-4 focus:ring-blue-300"/>
      </div>

      <!-- Hidden roleId (default to 1 for 'user') -->
      <input type="hidden" v-model="form.roleId" value="1" />

      <button type="submit"
        class="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        :disabled="isSubmitting">
        {{ isSubmitting ? 'Registering...' : 'Register' }}
      </button>

      <p v-if="formError" class="text-red-400 text-xs text-center">{{ formError }}</p>
    </form>

    <p class="text-xs text-center text-white mt-4">
      Already have an account?
      <a href="#" @click.prevent="goToSignIn" class="text-blue-300 hover:underline">Sign In</a>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const authStore = useUserStore()

const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  roleId: 1 // Default to 'user' role
})

const formError = ref('')
const isSubmitting = ref(false)
const phoneError = ref('')

const goToSignIn = () => router.push('/login')

const validatePhone = () => {
  const phoneRegex = /^\d{9,10}$/
  phoneError.value = phoneRegex.test(form.value.phone) ? '' : 'Phone must be 9-10 digits'
}

const handleSubmit = async () => {
  formError.value = ''
  phoneError.value = ''
  isSubmitting.value = true

  // Validate phone
  const phoneRegex = /^\d{9,10}$/
  if (form.value.phone && !phoneRegex.test(form.value.phone)) {
    formError.value = 'Phone must be 9 to 10 digits'
    isSubmitting.value = false
    return
  }

  // Validate password match
  if (form.value.password !== form.value.confirmPassword) {
    formError.value = 'Passwords do not match'
    isSubmitting.value = false
    return
  }

  try {
    const result = await authStore.register(form.value)
    if (result.success) {
      console.log('Registration successful')

      // Get the role from the registered user returned by server
      const userRole = result.user?.roleId

      // Redirect based on role
      if (userRole === 2) {
        router.push('/dashboard') // Admin page
      } else {
        router.push('/book') // User page
      }

    } else {
      throw new Error(result.error || 'Registration failed')
    }
  } catch (err) {
    console.error('Registration error:', err)
    formError.value = err.response?.data?.message || err.message || 'Something went wrong!'
  } finally {
    isSubmitting.value = false
  }
}

</script>