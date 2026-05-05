<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative text-white py-10" data-aos="fade-up" data-aos-duration="1000">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')">
      </div>

      <!-- Sky Blue Half Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-sky-400/100 via-sky-800/40 to-transparent"></div>

      <!-- Additional Dark Overlay for Better Text Readability -->
      <div class="absolute inset-0 bg-black/10"></div>

      <!-- Decorative Floating Icons -->
      <div class="absolute top-10 left-10 animate-bounce" data-aos="zoom-in" data-aos-delay="200">
        <BookOpenIcon class="w-8 h-8 text-white/80" aria-hidden="true" />
      </div>
      <div class="absolute bottom-12 right-12 animate-bounce" style="animation-delay: 1s" data-aos="zoom-in" data-aos-delay="400">
        <HeartIcon class="w-8 h-8 text-white/80" aria-hidden="true" />
      </div>

      <!-- Content -->
      <div class="relative container mx-auto py-10 md:py-20 text-center mb-20">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in text-white drop-shadow-lg" data-aos="fade-up" data-aos-delay="100">
          Discover More About Our Library
        </h1>
        <p class="text-xl md:text-2xl mb-10 text-white/90 animate-fade-in-delay drop-shadow-md" data-aos="fade-up" data-aos-delay="200">
          A digital library inspiring readers for over 20 years
        </p>
        <!-- Stats -->
        <div class="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-delay-2" data-aos="fade-up" data-aos-delay="300">
          <div
            class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
            <BookMarkedIcon class="w-5 h-5" aria-hidden="true" />
            <span class="text-lg font-medium">{{ bookCount }}+ Books</span>
          </div>
          <div
            class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
            <UsersIcon class="w-5 h-5" aria-hidden="true" />
            <span class="text-lg font-medium">{{ userCount }}+ Members</span>
          </div>
          <div
            class="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 shadow-lg hover:scale-105 transition border border-white/20">
            <HeartIcon class="w-5 h-5" aria-hidden="true" />
            <span class="text-lg font-medium">Community Focused</span>
          </div>
        </div>
        <!-- CTA Button -->
        <router-link to="/web-book"
          class="bg-white text-sky-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-sky-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all animate-fade-in-delay-3 inline-block" data-aos="fade-up" data-aos-delay="400">
          Explore Our Library
        </router-link>
      </div>
    </section>
    <div class="container mx-auto px-4 py-16   ">
      <!-- Mission Section -->
      <section class="mb-16" data-aos="fade-up" data-aos-duration="1000">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-8 text-gray-800" data-aos="fade-up" data-aos-delay="100">Our Mission</h2>
          <p class="text-lg text-gray-600 mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Our mission is to make reading and learning easy and enjoyable for everyone.
            We provide access to books, resources, and programs that inspire curiosity and
            support lifelong education in a welcoming community.
          </p>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-sky-400" data-aos="fade-up" data-aos-delay="300">
              <BookOpenIcon class="w-12 h-12 text-sky-600 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2">Knowledge</h3>
              <p class="text-gray-600">
                Providing access to vast collections of books, digital resources, and
                information
              </p>
            </div>
            <div
              class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-400" data-aos="fade-up" data-aos-delay="400">
              <UsersIcon class="w-12 h-12 text-purple-600 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2">Community</h3>
              <p class="text-gray-600">
                Creating spaces for connection, collaboration, and cultural exchange
              </p>
            </div>
            <div
              class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-green-400" data-aos="fade-up" data-aos-delay="500">
              <GraduationCapIcon class="w-12 h-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2">Learning</h3>
              <p class="text-gray-600">
                Supporting education and personal growth through programs and resources
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact & Hours Section -->
      <div class="container mx-auto px-4 py-12">
        <section class="mb-10">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-800 mb-4 section-title">Meet Our Team</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Our dedicated team of professionals is committed to delivering exceptional results. Get to know the
              talented individuals behind our success.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div v-for="(member, index) in staff" :key="member.name"
              class="team-card bg-white rounded-xl p-6 text-center shadow-lg">

              <div class="profile-container">
                <img :src="member.image" :alt="member.name" class="profile-image rounded-full mx-auto object-cover" />
                <div class="role-badge ">{{ member.role }}</div>
              </div>

              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ member.name }}</h3>
              <p class="text-sm text-gray-600 mb-6">{{ member.bio }}</p>

              <!-- Social media links -->
              <div class="social-icons">
                <a :href="'mailto:' + member.contact.email" class="social-icon">
                  <i class="fas fa-envelope text-sm"></i>
                </a>
                <a :href="member.contact.phone" class="social-icon">
                  <i class="fas fa-phone-alt text-sm"></i>
                </a>
                <a v-if="member.contact.facebook" :href="member.contact.facebook" target="_blank" class="social-icon">
                  <i class="fab fa-facebook-f text-sm"></i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { getBooks } from "@/services/Api/book";
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS styles

import {
  BookOpen as BookOpenIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Wifi as WifiIcon,
  Coffee as CoffeeIcon,
  Monitor as ComputerIcon,
  BookMarked as BookMarkedIcon,
  GraduationCap as GraduationCapIcon,
  Heart as HeartIcon,
} from "lucide-vue-next";

const userStore = useUserStore();

// Reactive variables
const bookCount = ref(0);
const userCount = ref(0);
const books = ref([]);

// Services
const services = ref([
  {
    icon: BookOpenIcon,
    title: "Book Collection",
    description: "Over 200 books across all genres and subjects",
  },
  {
    icon: ComputerIcon,
    title: "Digital Resources",
    description:
      "Access and read all our e-books online anytime through our digital library.",
  },
  {
    icon: WifiIcon,
    title: "Free WiFi",
    description: "High-speed internet access throughout the library",
  },
  {
    icon: GraduationCapIcon,
    title: "Study Spaces",
    description: "Quiet study areas and group collaboration rooms",
  },
  {
    icon: CalendarIcon,
    title: "Study Time",
    description: "Spend time with your friends and study together",
  },
]);

// Staff members
const staff = ref([
  {
    name: "Sor Chhin",
    role: "QA Tester",
    bio: "Sor tests the quality of our library services.",
    image: "/member/sor.jpg",
    contact: {
      email: "sor.chhin@student.passerellesnumeriques.org",
      phone: "https://t.me/SOR_CHHIN",
      facebook: "https://www.facebook.com/chhin.sreysor.52/",
    },
  },
  {
    name: "Bopha Khat",
    role: "Product Owner",
    bio: "Defines the vision of our library services and ensures they meet user needs.",
    image: "/member/bopha.jpg",
    contact: {
      email: "bopha.khat@student.passerellesnumeriques.org",
      phone: "https://t.me/woaiichii",
      facebook: "https://www.facebook.com/share/1F7QojHMzD/",
    },
  },
  {
    name: "Horth Heng",
    role: "Scrum Master",
    bio: "Facilitates agile ceremonies and helps teams deliver high-quality services.",
    image: "/member/horth.jpg",
    contact: {
      email: "horth.heng@student.passerellesnumeriques.org",
      phone: "https://t.me/Horth_Heng",
      facebook: "https://www.facebook.com/heng.sophak.54",
    },
  },
  {
    name: "Sophean Phouk",
    role: "DevOps",
    bio: "Manages infrastructure and deployment processes.",
    image: "/member/phean.jpg",
    contact: {
      email: "sophean.phouk@student.passerellesnumeriques.org",
      phone: "https://t.me/youphean",
      facebook: "https://www.facebook.com/e3cossxuo6",
    },
  },
  {
    name: "Linna Rin",
    role: "Code Quality",
    bio: "Ensures code remains clean, maintainable, and follows best practices.",
    image: "/member/linna.jpg",
    contact: {
      email: "linna.rin@student.passerellesnumeriques.org",
      phone: "https://t.me/linna1268",
      facebook: "https://www.facebook.com/lin.qbee?mibextid=LQQJ4d",
    },
  },
]);

// Library hours
const hours = ref([
  { day: "Monday - Thursday", hours: "8:00 AM - 5:00 PM" },
  { day: "Friday - Saturday", hours: "8:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "8:00 AM - 5:00 PM" },
]);

// Check if cached data is fresh
const isDataFresh = (timestamp) => {
  const ONE_HOUR = 60 * 60 * 1000;
  return Date.now() - timestamp < ONE_HOUR;
};

// Fetch counts
const fetchAndStoreCounts = async () => {
  try {
    const storedBookCount = localStorage.getItem("bookCount");
    const storedUserCount = localStorage.getItem("userCount");
    const storedTimestamp = localStorage.getItem("countTimestamp");

    if (
      storedBookCount &&
      storedUserCount &&
      storedTimestamp &&
      isDataFresh(parseInt(storedTimestamp, 10))
    ) {
      bookCount.value = parseInt(storedBookCount, 10);
      userCount.value = parseInt(storedUserCount, 10);
      return;
    }

    // Fetch book count
    books.value = await getBooks();
    bookCount.value = Array.isArray(books.value) ? books.value.length : 200;
    localStorage.setItem("bookCount", bookCount.value);

    const userResponse = await userStore.fetchUsers();
    userCount.value =
      userResponse.success && Array.isArray(userStore.users)
        ? userStore.users.length
        : 120;
    localStorage.setItem("userCount", userCount.value);

    // Store timestamp
    localStorage.setItem("countTimestamp", Date.now().toString());
  } catch (error) {
    console.error("Failed to fetch counts:", error);
    bookCount.value = parseInt(localStorage.getItem("bookCount"), 10) || 200;
    userCount.value = parseInt(localStorage.getItem("userCount"), 10) || 120;
  }
};

onMounted(() => {
  fetchAndStoreCounts();
  AOS.init({
    duration: 1000, // Duration of animations
    easing: 'ease-in-out', // Easing function
    once: true, // Animation happens only once
    offset: 100, // Trigger animations earlier
  });
});
</script>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f8fafc;
}

.team-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  animation: fadeIn 0.6s ease forwards;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.team-card:nth-child(1) {
  animation-delay: 0.1s;
}

.team-card:nth-child(2) {
  animation-delay: 0.2s;
}

.team-card:nth-child(3) {
  animation-delay: 0.3s;
}

.team-card:nth-child(4) {
  animation-delay: 0.4s;
}

.profile-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #e0f2fe;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.team-card:hover .profile-image {
  border-color: #38bdf8;
  transform: scale(1.05);
}

.role-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  color: white;
  padding: 0.35rem 1.2rem;
  width: max-content;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(56, 189, 248, 0.3);
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #38bdf8;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  color: white;
  transform: translateY(-3px);
}

.contact-button {
  transition: all 0.3s ease;
  border-radius: 10px;
}

.contact-button:hover {
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  color: white;
}

.contact-button:hover span {
  color: white;
}

.contact-button:hover i {
  color: white;
  transform: scale(1.1);
}

.section-title {
  position: relative;
  display: inline-block;
  margin-bottom: 3rem;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  border-radius: 2px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>