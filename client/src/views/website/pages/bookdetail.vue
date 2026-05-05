<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <!-- Book Cover Section -->
        <div class="md:w-1/2 p-6 bg-gradient-to-br from-teal-400 to-teal-600">
          <div class="relative">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yCpJAvOCWSplM9qtANjM0PW1I0Qe1v.png" 
              alt="Birthright Book Cover" 
              class="w-full max-w-sm mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>

        <!-- Product Details Section -->
        <div class="md:w-1/2 p-6 space-y-4">
          <!-- ISBN -->
          <div class="text-sm text-gray-600">
            <span class="font-semibold">ISBN:</span> 9446547654
          </div>

          <!-- Title -->
          <h1 class="text-2xl font-bold text-gray-900">
            The Girl on the Train
          </h1>

          <!-- Author -->
          <p class="text-orange-500 font-medium">
            by R.J palacio
          </p>

          <!-- Rating -->
          <div class="flex items-center space-x-2">
            <div class="flex text-orange-400">
              <svg v-for="i in 4" :key="i" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              <svg class="w-4 h-4 fill-current text-gray-300" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </div>
            <span class="text-sm text-gray-600">12,994 customer reviews</span>
          </div>

          <!-- Description -->
          <p class="text-gray-700 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Vivamus commodo ligula eget dolor. Aenean massa. Cum 
            sociis natoque penatibus et magnis...
          </p>

          <!-- Price -->
          <div class="text-3xl font-bold text-gray-900">
            $14.36
          </div>

          <!-- Quantity -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Quantity</span>
            <div class="flex items-center border border-gray-300 rounded">
              <button 
                @click="decreaseQuantity" 
                class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                :disabled="quantity <= 1"
              >
                -
              </button>
              <span class="px-3 py-1 border-l border-r border-gray-300">{{ quantity }}</span>
              <button 
                @click="increaseQuantity" 
                class="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-4">
            <button 
              @click="addToCart"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
              </svg>
              <span>ADD TO CART</span>
            </button>
            
            <button 
              @click="addToWishlist"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span>ADD TO WISHLIST</span>
            </button>
          </div>

          <!-- Tags and Social -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">TAG:</span>
              <span class="text-sm text-gray-500">ART, ARCHITECTURE</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-700">Share:</span>
              <button class="text-blue-600 hover:text-blue-800">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button class="text-blue-800 hover:text-blue-900">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const quantity = ref(1)

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  alert(`Added ${quantity.value} item(s) to cart!`)
}

const addToWishlist = () => {
  alert('Added to wishlist!')
}
</script>

<style scoped>
@import 'tailwindcss';
</style>