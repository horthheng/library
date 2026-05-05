<template>
  <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10"
    >
      <!-- Title Block -->
      <div class="mb-6 sm:mb-0">
        <h3 class="text-2xl font-bold text-gray-900">Library Activity</h3>
        <p class="text-gray-500 mt-1">Books borrowed over time</p>
      </div>

      <!-- Filters -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-3 sm:gap-0"
      >
        <!-- Year input -->
        <input
          type="number"
          v-model="year"
          @input="handleYearInput"
          class="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg text-center text-blue-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
          min="2000"
          max="2100"
        />

        <!-- View type selector -->
        <select
          v-model="viewType"
          @change="handleViewTypeChange"
          class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>

        <!-- Month selector (for Month & Week views) -->
        <select
          v-if="viewType === 'month' || viewType === 'week'"
          v-model="selectedMonth"
          @change="handleMonthChange"
          class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option v-for="(m, index) in monthNames" :key="index" :value="index + 1">
            {{ m }}
          </option>
        </select>

        <!-- Week selector (only for Week view) -->
        <select
          v-if="viewType === 'week'"
          v-model="selectedWeek"
          @change="loadActivity"
          class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
        </select>

        <!-- Chart type selector -->
        <select
          v-model="chartType"
          @change="loadActivity"
          class="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          <option value="line">Line</option>
        </select>
      </div>
    </div>

    <!-- Chart -->
    <div v-if="loading" class="text-center text-gray-500">Loading data...</div>
    <div v-else class="relative h-80">
      <component :is="chartComponent" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { Bar, Pie, Line } from 'vue-chartjs'
import { ref, onMounted, computed } from 'vue'
import { getBorrowActivity } from '@/services/Api/dashboard'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement
)

// State
const year = ref(new Date().getFullYear())
const viewType = ref('year') // 'year', 'month', 'week'
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedWeek = ref(1)
const chartType = ref('bar') // 'bar', 'pie', 'line'
const loading = ref(false)

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Chart data & options
const chartData = ref({
  labels: [],
  datasets: []
})

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 8,
      cornerRadius: 6
    }
  },
  scales: {}
}

const chartOptions = computed(() => {
  if (chartType.value === 'pie') {
    // Pie chart usually no scales
    return {
      ...commonOptions,
      scales: {}
    }
  } else {
    // Bar or Line charts use scales
    return {
      ...commonOptions,
      scales: {
        x: {
          ticks: { color: '#6b7280' },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 10, color: '#6b7280' },
          grid: { color: '#e5e7eb' }
        }
      }
    }
  }
})

// Dynamically select component to render
const chartComponent = computed(() => {
  if (chartType.value === 'pie') {
    return Pie
  }
  if (chartType.value === 'line') {
    return Line
  }
  // Default Bar chart
  return Bar
})

// Load data from API
async function loadActivity() {
  loading.value = true
  try {
    const params = {
      year: year.value,
      view: viewType.value
    }
    if (viewType.value === 'month' || viewType.value === 'week') {
      params.month = selectedMonth.value
    }
    if (viewType.value === 'week') {
      params.week = selectedWeek.value
    }

    const response = await getBorrowActivity(params)

    if (chartType.value === 'pie') {
      chartData.value = {
        labels: response.data.map(item => item.label),
        datasets: [
          {
            label: 'Books Borrowed',
            data: response.data.map(item => item.value),
            backgroundColor: [
              '#f59e0b', // orange
              '#10b981', // green
              '#ef4444', // red
              '#3b82f6', // blue
              '#8b5cf6', // purple
              '#ec4899', // pink
              '#14b8a6', // teal
              '#f97316', // amber
              '#6366f1', // indigo
              '#84cc16', // lime
              '#eab308', // yellow
              '#64748b'  // slate
            ],
            borderColor: '#fff',
            borderWidth: 2
          }
        ]
      }
    } else {
      chartData.value = {
        labels: response.data.map(item => item.label),
        datasets: [
          {
            label: 'Books Borrowed',
            data: response.data.map(item => item.value),
            backgroundColor: 'rgba(139, 92, 246, 0.8)',
            borderRadius: 10,
            barThickness: 30,
            fill: chartType.value === 'line',
            borderColor: 'rgba(139, 92, 246, 1)',
            tension: 0.3
          }
        ]
      }
    }
  } catch (error) {
    console.error('Failed to load borrow activity data:', error)
    chartData.value = { labels: [], datasets: [] }
  } finally {
    loading.value = false
  }
}

// Handlers
function handleYearInput() {
  const newYear = parseInt(year.value)
  if (!isNaN(newYear) && newYear >= 2000 && newYear <= 2100) {
    loadActivity()
  }
}

function handleViewTypeChange() {
  if (viewType.value === 'month' || viewType.value === 'week') {
    selectedMonth.value = new Date().getMonth() + 1
  }
  if (viewType.value === 'week') {
    selectedWeek.value = 1
  }
  loadActivity()
}

function handleMonthChange() {
  if (viewType.value === 'week') {
    selectedWeek.value = 1
  }
  loadActivity()
}

// Init
onMounted(() => {
  loadActivity()
})
</script>