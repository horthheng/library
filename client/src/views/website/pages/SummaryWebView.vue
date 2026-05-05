<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-50">
    <!-- Page Header with Banner -->
    <div class="relative overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-indigo-50/30"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      
      <!-- Floating animated icons -->
      <div class="absolute top-1/4 left-1/5 text-blue-300 opacity-20 animate-float" style="animation-duration: 15s;">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      <div class="absolute bottom-1/3 right-1/4 text-indigo-300 opacity-20 animate-float" style="animation-duration: 18s; animation-delay: 3s;">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      
      <div class="container mx-auto px-6 py-16 relative z-10">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Summary What You Read 
            <span class="inline-block ml-2 animate-bounce">📖</span>
          </h1>
          <p class="text-lg text-slate-700 max-w-2xl mx-auto">
            Capture your thoughts and insights from every book you read
          </p>
        </div>
        
        <!-- Information Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 shadow-xl text-white mb-12">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="flex-shrink-0">
              <div class="bg-white/20 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-xl md:text-2xl font-bold mb-2">Why Write Book Summaries?</h2>
              <p class="text-blue-100 mb-4">
                Summarizing what you read helps reinforce learning, improves retention, and creates a valuable personal knowledge base. 
                Your summaries become a reference library of insights you can revisit anytime.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reinforce Learning</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Improve Retention</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Build Knowledge Base</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-6 pb-16">
      <!-- Form View -->
      <transition name="fade">
        <form v-if="!showSummary" @submit.prevent="handleSubmit" class="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200">
          <!-- Form Header -->
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Submit Your Book Summary</h2>
            <p class="text-slate-600">Fill in the details below to share your insights</p>
          </div>
          
          <!-- Row 1: Student ID and Student Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="studentId" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Student ID
              </label>
              <input
                v-model="formData.Student_ID"
                id="studentId"
                type="text"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Your ID (e.g., 01)"
              />
            </div>
            <div>
              <label for="studentName" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student Name
              </label>
              <input
                v-model="formData.Student_Name"
                id="studentName"
                type="text"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Your Name"
              />
            </div>
          </div>
          
          <!-- Row 2: Class and Year -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="studentClass" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Class
              </label>
              <input
                v-model="formData.Student_Class"
                id="studentClass"
                type="text"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Enter Class (e.g., A)"
              />
            </div>
            <div>
              <label for="studentYear" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Year
              </label>
              <input
                v-model.number="formData.Student_Year"
                id="studentYear"
                type="number"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Enter Year (e.g., 2025)"
              />
            </div>
          </div>
          
          <!-- Row 3: Book Title and Book Label -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="bookTitle" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Book Title
              </label>
              <input
                v-model="formData.Book_Title"
                id="bookTitle"
                type="text"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Enter Book Title"
              />
            </div>
            <div>
              <label for="bookLabel" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Book Label
              </label>
              <input
                v-model="formData.Book_Label"
                id="bookLabel"
                type="text"
                required
                class="p-3 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out"
                placeholder="Enter Book Label"
              />
            </div>
          </div>
          
          <!-- Summary Section - Enhanced -->
          <div class="mb-8">
            <label for="summary" class="block text-lg font-semibold text-slate-800 flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Summary
            </label>
            <div class="relative">
              <textarea
                v-model="formData.Summary"
                id="summary"
                required
                class="p-4 w-full border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition duration-300 ease-in-out resize-none"
                placeholder="Write your detailed summary here..."
                rows="5"
              ></textarea>
              <!-- Added character counter for summary -->
              <div class="absolute bottom-2 right-2 text-xs text-slate-500 bg-white px-2 py-1 rounded">
                {{ formData.Summary.length }} characters
              </div>
            </div>
            <p class="text-sm text-slate-600 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Provide a comprehensive summary of what you learned from this book.
            </p>
          </div>
          
          <!-- Submit Button and Feedback -->
          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="isLoading"
              class="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition duration-300 ease-in-out disabled:bg-amber-400 shadow-lg transform hover:scale-105 flex items-center"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Submitting...
              </span>
              <span v-else class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Summary
              </span>
            </button>
          </div>
          
          <!-- Error Message -->
          <p v-if="error" class="mt-6 text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </p>
        </form>
      </transition>
      
      <!-- Enhanced Summary View -->
      <transition name="fade">
        <div v-if="showSummary" class="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-slate-900 mb-2">Summary Submitted Successfully!</h2>
            <p class="text-slate-600">Here's what you submitted:</p>
          </div>
          
          <!-- Enhanced summary display with organized layout -->
          <div class="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
            <!-- Student Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  Student ID
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Student_ID }}</p>
              </div>
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student Name
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Student_Name }}</p>
              </div>
            </div>
            
            <!-- Academic Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Class
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Student_Class }}</p>
              </div>
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Year
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Student_Year }}</p>
              </div>
            </div>
            
            <!-- Book Information Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Book Title
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Book_Title }}</p>
              </div>
              <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Book Label
                </p>
                <p class="text-lg font-medium text-slate-900">{{ lastSummary.Book_Label }}</p>
              </div>
            </div>
            
            <!-- Summary Section -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <p class="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reading Summary
              </p>
              <div class="prose max-w-none">
                <p class="text-slate-800 leading-relaxed text-base">{{ lastSummary.Summary }}</p>
              </div>
              
              <!-- Added summary statistics -->
              <div class="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-sm text-slate-500">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ lastSummary.Summary.split(' ').length }} words</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{{ lastSummary.Summary.length }} characters</span>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~{{ Math.ceil(lastSummary.Summary.split(' ').length / 200) }} min read</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Added action buttons -->
          <div class="flex justify-center gap-4 mt-8">
            <button
              @click="showSummary = false"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 ease-in-out shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Summary
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createSummary } from '@/services/Api/summary';

const formData = ref({
  Student_ID: '',
  Student_Name: '',
  Student_Class: '',
  Student_Year: '',
  Book_Title: '',
  Book_Label: '',
  Summary: ''
});

const lastSummary = ref(null);
const showSummary = ref(false);
const isLoading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    await createSummary(formData.value);
    lastSummary.value = { ...formData.value };
    formData.value = {
      Student_ID: '',
      Student_Name: '',
      Student_Class: '',
      Student_Year: '',
      Book_Title: '',
      Book_Label: '',
      Summary: ''
    };
    showSummary.value = true;
    setTimeout(() => {
      showSummary.value = false;
    }, 60000); // 1 minute
  } catch (err) {
    error.value = 'Failed to create summary. Please try again.';
    console.error('Error creating summary:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Optional: Any initialization logic if needed
});
</script>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

.animate-float {
  animation: float ease-in-out infinite;
}
</style>