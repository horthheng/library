<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { ArrowLeft, Edit3, Save, X, Upload, User, Mail, Phone, Calendar, Shield, Camera, ZoomIn, X as Close, Briefcase } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const userStore = useUserStore()
const router = useRouter()
const editForm = ref({
  username: '',
  email: '',
  phone: '',
  date_of_birth: '',
  password: '',
})
const previewImage = ref(null)
const imageFile = ref(null)
const editMode = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)
const showImageModal = ref(false)

// Computed property for the first letter of the email
const profileInitial = computed(() => userStore.userProfile?.user?.email?.charAt(0)?.toUpperCase() || '?')

// Computed property to check if a valid profile image exists
const hasValidProfileImage = computed(() => {
  const image = previewImage.value || userStore.userProfile?.user?.profile_image || userStore.profileImage || ''
  return image && (image.startsWith('http') || image.startsWith('data:image') || image.startsWith('blob:'))
})

// Computed property to format email with line break if longer than 37 characters
const formattedEmail = computed(() => {
  const email = userStore.userProfile?.user?.email || 'Not provided'
  if (email.length > 37) {
    return {
      firstPart: email.substring(0, 37),
      secondPart: email.substring(37)
    }
  }
  return {
    firstPart: email,
    secondPart: null
  }
})

watch(() => userStore.userProfile?.user?.profile_image, (newImage) => {
  const imageUrl = newImage ? `${newImage}?t=${new Date().getTime()}` : userStore.profileImage || null
  previewImage.value = imageUrl
})

onMounted(async () => {
  isLoading.value = true
  try {
    await userStore.fetchUserProfile()
    if (userStore.userProfile && userStore.userProfile.user && Object.keys(userStore.userProfile.user).length > 0) {
      const userData = userStore.userProfile.user
      Object.assign(editForm.value, {
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
      })
      previewImage.value = userStore.userProfile.user.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No user data found. Please try again.' })
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to load profile data. Please try again later.' })
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (previewImage.value && previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value)
  }
  previewImage.value = null
  imageFile.value = null
})

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please select a valid image file (JPG, PNG)' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Image size should be less than 5MB' })
      return
    }
    if (previewImage.value && previewImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage.value)
    }
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
  } else {
    imageFile.value = null
    previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
  }
}

const validateForm = () => {
  if (!editForm.value.username) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Username is required' })
    return false
  }
  if (!editForm.value.email || !/\S+@\S+\.\S+/.test(editForm.value.email)) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'A valid email is required' })
    return false
  }
  if (editForm.value.phone && !editForm.value.phone.startsWith('0')) {
    Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Phone number must start with 0' })
    return false
  }
  if (editForm.value.date_of_birth) {
    const dob = new Date(editForm.value.date_of_birth)
    if (dob > new Date()) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Date of birth cannot be in the future' })
      return false
    }
  }
  return true
}

const updateProfile = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  const formData = new FormData()
  formData.append('username', editForm.value.username)
  formData.append('email', editForm.value.email)
  formData.append('phone', editForm.value.phone || '')
  formData.append('date_of_birth', editForm.value.date_of_birth || '')
  if (editForm.value.password) {
    formData.append('password', editForm.value.password)
  }
  if (imageFile.value) {
    formData.append('profile_image', imageFile.value)
  }
  const userId = userStore.userProfile?.user?.id
  if (!userId) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'User ID not found' })
    isSubmitting.value = false
    return
  }
  try {
    const result = await userStore.updateUser(userId, formData)
    if (result.success) {
      Swal.fire({
        toast: true, 
        text: 'Profile updated successfully!',
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'rounded-lg shadow-md border border-green-200 bg-green-50 text-green-700 p-2 flex items-center',
        }
      })
      editMode.value = false
      previewImage.value = result.profile_image ? `${result.profile_image}?t=${new Date().getTime()}` : userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
      imageFile.value = null
      await userStore.fetchUserProfile()
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: result.error || 'Failed to update profile' })
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred while updating the profile' })
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.back()
}

const handleImageError = () => {
  previewImage.value = userStore.userProfile?.user?.profile_image ? `${userStore.userProfile.user.profile_image}?t=${new Date().getTime()}` : userStore.profileImage || null
}

const openImageModal = () => {
  if (hasValidProfileImage.value) {
    showImageModal.value = true
  }
}

const closeImageModal = () => {
  showImageModal.value = false
}
</script>

<template>
  <div class="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
    <!-- Back Button -->
    <div class="max-w-6xl mx-auto mb-6">
      <button @click="goBack" class="flex items-center text-slate-700 hover:text-slate-900 transition-colors duration-200 group">
        <ArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span class="font-medium">Back</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading your profile...</p>
      </div>
    </div>

    <!-- Main Profile Container -->
    <div v-else class="max-w-6xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div class="md:flex">
          <!-- Sidebar -->
          <div class="md:w-1/3 bg-gradient-to-b from-blue-800 to-blue-900 p-8 text-white relative">
            <!-- Cover Pattern -->
            <div class="absolute inset-0 opacity-5">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12"></div>
            </div>
            
            <!-- Profile Image Section -->
            <div class="relative z-10 text-center">
              <div class="relative inline-block group mb-6">
                <div 
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-300 to-blue-400 mx-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
                  @click="openImageModal">
                  <img v-if="hasValidProfileImage"
                    :src="previewImage || userStore.userProfile?.user?.profile_image || userStore.profileImage || 'https://placehold.co/128x128'"
                    alt="Profile" class="w-full h-full object-cover" @error="handleImageError" />
                  <div v-else
                    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                    <span class="text-4xl font-bold text-white">{{ profileInitial }}</span>
                  </div>
                </div>
                
                <!-- Zoom Icon -->
                <div v-if="hasValidProfileImage" 
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 cursor-pointer"
                  @click="openImageModal">
                  <ZoomIn class="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <!-- Camera Icon for Edit Mode -->
                <label v-if="editMode" 
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-60 rounded-full cursor-pointer transition-all duration-300">
                  <Camera class="w-10 h-10 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <input type="file" @change="handleImageChange" accept="image/*" class="hidden" />
                </label>
                
                <!-- Online Status -->
                <div
                  class="absolute bottom-2 right-2 w-10 h-10 rounded-full border-4 border-white shadow-md flex items-center justify-center"
                  :class="userStore.userProfile?.isOnline ? 'bg-green-500' : 'bg-slate-500'">
                  <div v-if="userStore.userProfile?.isOnline" class="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                </div>
              </div>
              
              <h1 class="text-2xl font-bold mb-2">{{ userStore.userProfile?.user?.username || 'Unknown User' }}</h1>
              <p class="text-blue-200 mb-6">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</p>
              
              <!-- Edit Button -->
              <button v-if="!editMode" @click="editMode = true"
                class="w-full py-3 px-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-sm">
                <Edit3 class="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>
            
            <!-- Sidebar Stats -->
            <div class="mt-8 space-y-4">
              <div class="flex items-center justify-between py-2 border-b border-blue-500/30">
                <span class="text-blue-200">Status</span>
                <span class="font-medium" :class="userStore.userProfile?.isOnline ? 'text-green-300' : 'text-blue-300'">
                  {{ userStore.userProfile?.isOnline ? 'Online' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div class="md:w-2/3 p-8">
            <!-- View Mode -->
            <div v-if="!editMode" class="space-y-8">
              <div>
                <h2 class="text-2xl font-bold text-slate-900 mb-6">Profile Information</h2>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Email Card -->
                  <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-center mb-3">
                      <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                        <Mail class="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 class="text-lg font-medium text-slate-900">Email</h3>
                    </div>
                    <p class="text-slate-600 ml-13">
                      {{ formattedEmail.firstPart }}
                      <span v-if="formattedEmail.secondPart" class="block">{{ formattedEmail.secondPart }}</span>
                    </p>
                  </div>
                  
                  <!-- Phone Card -->
                  <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-center mb-3">
                      <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                        <Phone class="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 class="text-lg font-medium text-slate-900">Phone</h3>
                    </div>
                    <p class="text-slate-600 ml-13">{{ userStore.userProfile?.user?.phone || 'Not provided' }}</p>
                  </div>
                  
                  <!-- Birthday Card -->
                  <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-center mb-3">
                      <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                        <Calendar class="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 class="text-lg font-medium text-slate-900">Birthday</h3>
                    </div>
                    <p class="text-slate-600 ml-13">{{ userStore.userProfile?.user?.date_of_birth || 'Not provided' }}</p>
                  </div>
                  
                  <!-- Role Card -->
                  <div class="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-center mb-3">
                      <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-3">
                        <Briefcase class="w-5 h-5 text-slate-700" />
                      </div>
                      <h3 class="text-lg font-medium text-slate-900">Role</h3>
                    </div>
                    <p class="text-slate-600 ml-13">{{ userStore.userProfile?.user?.role?.name || 'No Role Assigned' }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Additional Info Section -->
              <div>
                <h3 class="text-xl font-semibold text-slate-900 mb-4">About</h3>
                <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <p class="text-slate-600">
                    This is your personal profile section. Here you can view and update your account information, 
                    manage your profile picture, and keep your contact details up to date.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Edit Mode -->
            <div v-else class="space-y-6">
              <div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Edit Profile</h2>
                <p class="text-slate-600">Update your profile information below.</p>
              </div>
              
              <form @submit.prevent="updateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Username -->
                  <div>
                    <label for="username" class="block text-sm font-medium text-slate-700 mb-1">
                      Username
                    </label>
                    <div class="relative rounded-lg shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User class="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="username"
                        v-model="editForm.username"
                        type="text"
                        class="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-slate-300 rounded-lg"
                        placeholder="Enter username"
                        :disabled="isSubmitting"
                      />
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <div class="relative rounded-lg shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail class="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        v-model="editForm.email"
                        type="email"
                        class="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-slate-300 rounded-lg"
                        placeholder="Enter email"
                        :disabled="isSubmitting"
                      />
                    </div>
                  </div>
                  
                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <div class="relative rounded-lg shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone class="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="phone"
                        v-model="editForm.phone"
                        type="text"
                        class="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-slate-300 rounded-lg"
                        placeholder="Enter phone number"
                        :disabled="isSubmitting"
                      />
                    </div>
                  </div>
                  
                  <!-- Date of Birth -->
                  <div>
                    <label for="date_of_birth" class="block text-sm font-medium text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <div class="relative rounded-lg shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar class="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="date_of_birth"
                        v-model="editForm.date_of_birth"
                        type="date"
                        class="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-slate-300 rounded-lg"
                        :disabled="isSubmitting"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Password -->
                <div>
                  <label for="password" class="block text-sm font-medium text-slate-700 mb-1">
                    New Password (leave blank to keep current)
                  </label>
                  <div class="relative rounded-lg shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield class="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      v-model="editForm.password"
                      type="password"
                      class="focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 pr-3 py-3 sm:text-sm border-slate-300 rounded-lg"
                      placeholder="Enter new password"
                      :disabled="isSubmitting"
                    />
                  </div>
                </div>
                
                <!-- Profile Image Upload -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    Profile Image
                  </label>
                  <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div class="flex-1 w-full">
                      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload class="w-8 h-8 mb-2 text-slate-400" />
                          <p class="mb-2 text-sm text-slate-500 text-center">
                            <span class="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p class="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                        </div>
                        <input type="file" @change="handleImageChange" accept="image/*" class="hidden" />
                      </label>
                    </div>
                    <div v-if="previewImage" class="flex-shrink-0">
                      <img :src="previewImage" class="w-24 h-24 rounded-lg object-cover border-2 border-slate-200" @error="handleImageError" />
                    </div>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button type="button" @click="editMode = false"
                    class="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 w-full sm:w-auto">
                    <X class="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  <button type="submit"
                    class="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 w-full sm:w-auto"
                    :disabled="isSubmitting">
                    <Save class="w-5 h-5 mr-2" />
                    <span v-if="isSubmitting">Saving...</span>
                    <span v-else>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300" @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full w-full" @click.stop>
        <button 
          @click="closeImageModal"
          class="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors duration-200 z-10">
          <Close class="w-6 h-6 text-slate-800" />
        </button>
        <img 
          :src="previewImage || userStore.userProfile?.user?.profile_image || userStore.profileImage" 
          alt="Profile Full Size" 
          class="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain mx-auto"
          @error="handleImageError"
        />
      </div>
    </div>
  </div>
</template>