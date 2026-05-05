<template>
  <section
    class="min-h-screen flex items-center relative overflow-hidden ">
    <div class="absolute overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse-slow">
      </div>
      <div
        class="absolute -left-40 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse-slow"
        style="animation-delay: 2s;"></div>
    </div>

    <div class="container -mt-40 px-4 sm:px-6 lg:px-20 relative">
      <div class="grid lg:grid-cols-2 gap-6 items-center">
        <!-- Text content -->
        <div class="space-y-4 text-center lg:text-left">
          <!-- Organization badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-teal-200/50 shadow-sm animate-fade-in">
            <div class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span class="text-teal-700 font-semibold text-sm tracking-wide uppercase">
              Passerelles Numériques Cambodia
            </span>
          </div>

          <!-- Main heading -->
          <div class="space-y-4">
            <h1
              class="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DISCOVER THE FUTURE OF LEARNING
            </h1>
            <div class="flex justify-center lg:justify-start">
              <div class="w-40 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-slide-in-right mb-5">
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-base sm:text-lg animate-fade-in-delayed">
            Unlock unlimited potential with our cutting-edge digital library. Access
            premium academic resources, collaborative learning tools, and innovative
            research platforms designed to accelerate your educational journey.
          </p>
          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <router-link to="/web-book"
              class="bg-sky-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-sky-50 hover:text-sky-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all animate-fade-in-delay-3 inline-block mt-10 animate-slide-in-up">
              Explore Our Library
            </router-link>
          </div>
        </div>

        <!-- Image section -->
        <div class="flex justify-center lg:justify-end relative">
          <div class="relative animate-fade-in-delayed" style="animation-delay: 0.3s;">
            <!-- Main image container -->
            <div class="relative backdrop-blur-sm p-8 border border-white/20">
              <img src="/bookhome.png" alt="PNC Library Digital Resources"
                class="w-full max-w-md object-contain relative z-10 drop-shadow-2xl" />

              <!-- Decorative elements -->
              <div
                class="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-teal-400/30 to-blue-400/30 rounded-2xl blur-xl animate-pulse-slow rotate-12">
              </div>
              <div
                class="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-2xl blur-xl animate-pulse-slow -rotate-12"
                style="animation-delay: 1s;"></div>
            </div>

            <!-- Floating cards -->
            <div
              class="absolute top-16 -left-20 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow max-w-xs">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">
                    Research Hub
                  </div>
                  <div class="text-xs Ttext-slate-500">Advanced AI Tools</div>
                </div>
              </div>
            </div>

            <div
              class="absolute top-20 -right-16 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow max-w-xs"
              style="animation-delay: 1.5s;">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">
                    Smart Learning
                  </div>
                  <div class="text-xs text-slate-500">Personalized Experience</div>
                </div>
              </div>
            </div>
            <div
              class="absolute bottom-12 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-white/20 animate-float-slow max-w-xs"
              style="animation-delay: 2.5s;">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">
                    Digital Library
                  </div>
                  <div class="text-xs text-slate-500">Unlimited Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section id="about" class="px-4 sm:px-6 lg:px-10  bg-gradient-to-br from-slate-50 to-blue-50 p">
    <div class="container mx-auto px-4">
      <div class="text-center ">
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Featured Book
        </h2>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest featured selection, carefully curated to inspire and
          educate
        </p>
      </div>
      <div class="flex flex-col lg:flex-row items-center gap-1 ">
        <div class="lg:w-5/12 mb-8 lg:mb-0 relative flex justify-center">
          <img src="/book7.png" alt="Featured Book: The Digital Revolution in Education"
            class="w-5/6 object-contain transition-transform duration-500 hover:scale-105 " />
        </div>

        <div class="lg:w-7/12 lg:pl-8 space-y-6">
          <div class="space-y-4">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-800">
              The Digital Revolution in Education
            </h3>
            <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
              Explore how technology is transforming the way we learn, teach, and
              access knowledge. This comprehensive guide covers the latest trends in
              digital education and their impact on academic excellence.
            </p>
            <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
              From AI-powered learning platforms to virtual reality classrooms,
              discover the tools and methodologies that are shaping the future of
              education at Passerelles Numériques Cambodia.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mt-8">
           <router-link to="/web-book"
              class="bg-sky-700 text-white font-semibold px-8 py-3 rounded-full hover:bg-sky-50 hover:text-sky-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all animate-fade-in-delay-3 inline-block mt-10 animate-slide-in-up">
              View More
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-12">
        Why Choose Our Library?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-lg sm:text-xl font-semibold mb-3">
            Extensive Collection
          </h3>
          <p class="text-gray-600 text-base">
            Thousands of books across all genres, constantly updated with new
            releases.
          </p>
        </div>
        <div class="text-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
          <div class="text-4xl mb-4">🌍</div>
          <h3 class="text-lg sm:text-xl font-semibold mb-3">Access Anywhere</h3>
          <p class="text-gray-600 text-base">
            Read on any device, online or offline, at your convenience.
          </p>
        </div>
        <div class="text-center p-6 bg-white rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
          <div class="text-4xl mb-4">⭐</div>
          <h3 class="text-lg sm:text-xl font-semibold mb-3">
            Curated Selection
          </h3>
          <p class="text-gray-600 text-base">
            Hand-picked recommendations from our expert librarians.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-delayed {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float-slow {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(1deg);
  }
}

@keyframes pulse-slow {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-delayed {
  animation: fade-in-delayed 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.animate-slide-in-up {
  animation: slide-in-up 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out forwards;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>