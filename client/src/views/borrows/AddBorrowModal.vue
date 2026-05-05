<template>
  <div
    class="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out"
    v-if="showModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100"
    >
      <div class="p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 tracking-tight">Create Borrow Record</h2>
        <div class="flex items-center mb-8">
          <div class="flex-1">
            <div class="flex justify-between text-sm font-medium text-gray-500">
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 1 }">1. Borrower Details</span>
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 2 }">2. Book Details</span>
              <span :class="{ 'text-indigo-600 font-semibold': currentStep === 3 }">3. Confirmation</span>
            </div>
            <div class="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-in-out"
                :style="{ width: currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%' }"
              ></div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Step 1: Borrower Details -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Type</label>
              <select
                v-model="localForm.borrowerType"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                @change="resetUserFields"
              >
                <option value="new">New User</option>
                <option value="existing">Existing User</option>
              </select>
            </div>

            <div v-if="localForm.borrowerType === 'new'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Name</label>
                <input
                  v-model="localForm.borrower_name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter borrower name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrower Email</label>
                <input
                  v-model="localForm.borrower_email"
                  type="email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter borrower email"
                />
              </div>
            </div>

            <div v-else class="space-y-4">
              <label for="user-barcode" class="block text-sm font-medium text-gray-700 mb-1">User Barcode</label>
              <div class="flex items-center space-x-4">
                <input
                  id="user-barcode"
                  v-model="localForm.user_barcode"
                  type="text"
                  @input="fetchUserDetails"
                  class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none"
                  placeholder="Enter or scan user barcode..."
                  aria-describedby="user-barcode-error"
                />
                <button
                  type="button"
                  @click="startQrScanner"
                  class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm flex items-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  :disabled="showQrScanner || scannerLoading"
                  aria-label="Scan QR code"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m-3 4h6M3 3h2v2M3 21h2v-2m16 2h-2v-2m2-16h-2v2M9 3h6m-6 18h6"
                    />
                  </svg>
                  Scan QR
                </button>
              </div>
              <p v-if="formError && !showQrScanner" id="user-barcode-error" class="text-sm text-red-600 mt-1">{{ formError }}</p>
              <div v-if="showQrScanner" class="mt-4 space-y-3">
                <div
                  id="qr-reader"
                  class="w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  :class="{ 'opacity-50': scannerLoading, 'border-green-500': !scannerError && localForm.user_barcode }"
                ></div>
                <p v-if="scannerLoading" class="text-sm text-gray-600 text-center" role="status">Initializing QR scanner...</p>
                <p v-if="scannerError" class="text-sm text-red-600 text-center" role="alert">{{ scannerError }}</p>
                <button
                  type="button"
                  style="display: none;"
                  @click="stopQrScanner"
                  class="w-full max-w-xs mx-auto px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                  :disabled="scannerLoading"
                  aria-label="Stop QR scanner"
                >
                  <svg
                    v-if="scannerLoading"
                    class="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                  </svg>
                  {{ scannerLoading ? 'Stopping...' : 'Stop Scanner' }}
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                <span class="font-medium text-gray-600">User Name:</span>
                <span class="ml-1">{{ localForm.borrower_name || 'Not selected' }}</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Librarian Name</label>
              <input
                v-model="localForm.librarian_name"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter librarian name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Borrow Date</label>
              <input
                v-model="localForm.date_borrow"
                type="date"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 transition-all duration-200"
              />
            </div>
          </div>

          <!-- Step 2: Book Details -->
          <div v-if="currentStep === 2" class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-800">Book Details</h3>
              <button
                type="button"
                @click="addBook"
                :disabled="localForm.books.length >= 3"
                :class="[
                  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition duration-200',
                  localForm.books.length >= 3 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                ]"
              >
                <svg
                  v-if="localForm.books.length < 3"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                {{ localForm.books.length < 3 ? 'Add Another Book' : 'Max 3 Books' }}
              </button>
            </div>
            <div
              v-for="(book, index) in localForm.books"
              :key="index"
              class="p-6 bg-white rounded-lg shadow border border-gray-200 space-y-4"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Book ISBN</label>
                <input
                  v-model="book.isbn"
                  type="text"
                  @input="fetchBookDetails(index)"
                  class="w-full px-4 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter or scan book ISBN..."
                />
              </div>
              <p class="text-sm text-gray-500">
                <span class="font-medium text-gray-600">Book Name:</span>
                <span class="ml-1">{{ book.book_name || 'Not selected' }}</span>
              </p>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input
                  v-model="book.return_date"
                  type="date"
                  class="w-full px-4 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div v-if="localForm.books.length > 1" class="flex justify-end">
                <div class="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
                  <button
                    type="button"
                    @click="removeBook(index)"
                    class="flex items-center text-red-700 hover:text-red-800 font-medium text-sm transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-3 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove Book
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 3" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-800 tracking-tight">Confirm Details</h3>
            <div class="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
              <div>
                <p class="text-sm font-medium text-gray-700">Borrower Type</p>
                <p class="text-gray-900 font-medium">
                  {{ localForm.borrowerType === 'new' ? 'New User' : 'Existing User' }}
                </p>
              </div>
              <div v-if="localForm.borrowerType === 'new'">
                <p class="text-sm font-medium text-gray-700">Borrower Name</p>
                <p class="text-gray-900">{{ localForm.borrower_name || 'N/A' }}</p>
                <p class="text-sm font-medium text-gray-700">Borrower Email</p>
                <p class="text-gray-900">{{ localForm.borrower_email || 'N/A' }}</p>
              </div>
              <div v-else>
                <p class="text-sm font-medium text-gray-700">User Barcode</p>
                <p class="text-gray-900">{{ localForm.user_barcode || 'N/A' }}</p>
                <p class="text-sm font-medium text-gray-700">User Name</p>
                <p class="text-gray-900">{{ localForm.borrower_name || 'N/A' }}</p>
                <p class="text-sm font-medium text-gray-700">User Email</p>
                <p class="text-gray-900">{{ localForm.borrower_email || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Librarian Name</p>
                <p class="text-gray-900">{{ localForm.librarian_name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Borrow Date</p>
                <p class="text-gray-900">{{ localForm.date_borrow || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Books</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(book, index) in localForm.books" :key="index" class="text-gray-900">
                    {{ book.book_name || 'N/A' }} (ISBN: {{ book.isbn || 'N/A' }}, Return: {{ book.return_date || 'N/A' }})
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-between pt-6">
            <button
              v-if="currentStep > 1"
              type="button"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
              @click="currentStep--"
            >
              Back
            </button>
            <div class="flex-1"></div>
            <div class="flex space-x-3">
              <button
                type="button"
                class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                v-if="currentStep < 3"
                type="button"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                @click="nextStep"
                :disabled="!isStepValid"
                :class="{ 'opacity-50 cursor-not-allowed': !isStepValid }"
              >
                Next
              </button>
              <button
                v-if="currentStep === 3"
                type="submit"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm flex items-center gap-2"
                :disabled="loading"
                :class="{ 'opacity-50 cursor-not-allowed': loading }"
              >
                <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
                </svg>
                {{ loading ? "Submitting..." : "Submit" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, onUnmounted } from "vue";
import { inject } from "vue";
import { useUserStore } from '@/stores/userStore';
import { debounce } from "lodash";
import { Html5Qrcode } from "html5-qrcode";

const authStore = useUserStore();
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "submit", "close"]);
const { getBook, getUser, showToast, fetchBooksData, fetchUsersData, booksData, usersData } = inject("borrowManagement");

const today = new Date().toISOString().split('T')[0];

const localForm = ref({
  borrowerType: props.modelValue.borrowerType || "new",
  borrower_name: props.modelValue.borrower_name || "",
  borrower_email: props.modelValue.borrower_email || "",
  user_barcode: props.modelValue.user_barcode || "",
  user_id: props.modelValue.user_id || "",
  librarian_name: authStore.user?.username || props.modelValue.librarian_name || "",
  date_borrow: props.modelValue.date_borrow || today,
  books: props.modelValue.books || [{ isbn: "", book_name: "", return_date: "" }],
  status: props.modelValue.status || "borrowed",
  quantity: props.modelValue.quantity || 1,
});

const errorMessage = ref("");
const formError = ref("");
const loading = ref(false);
const showModal = ref(true);
const currentStep = ref(1);
const showQrScanner = ref(false);
const qrScanner = ref(null);
const scannerLoading = ref(false);
const scannerError = ref("");
let cameraStream = ref(null);

onMounted(async () => {
  try {
    await Promise.all([fetchBooksData(), fetchUsersData()]);
    if (!usersData.value.length) {
      showToast("No users available. Please add users to scan barcodes.", "error");
      console.error("No users available for scanning.");
    }
  } catch (err) {
    showToast("Failed to load initial data. Please try again.", "error");
    console.error("Failed to load initial data:", err);
  }
});

onUnmounted(() => {
  stopQrScanner();
});

watch(
  () => localForm.value,
  (newForm) => {
    emit("update:modelValue", newForm);
  },
  { deep: true }
);

function normalizeIsbn(isbn) {
  return isbn?.replace(/[-\s]/g, "") || "";
}

function resetUserFields() {
  localForm.value.borrower_name = "";
  localForm.value.borrower_email = "";
  localForm.value.user_barcode = "";
  localForm.value.user_id = "";
  stopQrScanner();
}

function addBook() {
  if (localForm.value.books.length < 3) {
    localForm.value.books.push({ isbn: "", book_name: "", return_date: "" });
  } else {
    showToast("Cannot add more than 3 books.", "error");
  }
}

function removeBook(index) {
  if (localForm.value.books.length > 1) {
    localForm.value.books.splice(index, 1);
  } else {
    showToast("At least one book is required.", "error");
  }
}

async function startQrScanner() {
  showQrScanner.value = true;
  scannerLoading.value = true;
  scannerError.value = "";

  await nextTick();

  const qrReaderElement = document.getElementById("qr-reader");
  if (!qrReaderElement) {
    scannerError.value = "Failed to initialize QR scanner: Element not found.";
    scannerLoading.value = false;
    showQrScanner.value = false;
    showToast(scannerError.value, "error");
    console.error(scannerError.value);
    return;
  }

  const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
  qrScanner.value = new Html5Qrcode("qr-reader");

  try {
    cameraStream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || cameras.length === 0) {
      throw new Error("No cameras found on this device.");
    }

    const cameraId = cameras.find(cam => cam.facingMode === "environment")?.id || cameras[0].id;

    await qrScanner.value.start(
      cameraId,
      config,
      async (decodedText) => {
        localForm.value.user_barcode = decodedText.trim();
        scannerLoading.value = true;
        try {
          const user = await fetchUserDetails();
          if (user) {
            await stopQrScanner(); // Automatically stop scanner and camera after successful scan
            showToast("QR code scanned successfully.", "success");
          } else {
            scannerError.value = `No user found with barcode ${decodedText}. Scan another code.`;
            showToast(scannerError.value, "error");
            console.warn(scannerError.value);
          }
        } catch (err) {
          scannerError.value = `Failed to process barcode: ${err.message}`;
          showToast(scannerError.value, "error");
          console.error("Failed to process barcode:", err);
        } finally {
          scannerLoading.value = false;
        }
      },
      (error) => {
        if (!scannerError.value) {
          scannerError.value = "Unable to scan QR code. Ensure the code is clear and well-lit.";
          console.warn("QR scan error:", error);
        }
      }
    );
    scannerLoading.value = false;
  } catch (err) {
    scannerError.value = err.message.includes("Permission denied")
      ? "Camera access denied. Please allow camera permissions in your browser settings."
      : `Failed to start QR scanner: ${err.message}`;
    showToast(scannerError.value, "error");
    console.error("Failed to start QR scanner:", err);
    scannerLoading.value = false;
    showQrScanner.value = false;
    await stopQrScanner();
  }
}

async function stopQrScanner() {
  try {
    scannerLoading.value = true;

    // Stop and clear the QR scanner if it exists
    if (qrScanner.value && typeof qrScanner.value.stop === 'function') {
      try {
        await qrScanner.value.stop();
        console.log("QR scanner stopped");
      } catch (stopErr) {
        console.warn("Error stopping QR scanner:", stopErr);
      }
      try {
        await qrScanner.value.clear();
        console.log("QR scanner cleared");
      } catch (clearErr) {
        console.warn("Error clearing QR scanner:", clearErr);
      }
      qrScanner.value = null;
    }

    // Stop all camera stream tracks
    if (cameraStream.value && cameraStream.value.getTracks) {
      const tracks = cameraStream.value.getTracks();
      tracks.forEach(track => {
        try {
          track.stop();
          console.log("Camera track stopped:", track.label);
        } catch (trackErr) {
          console.warn("Error stopping camera track:", trackErr);
        }
      });
      cameraStream.value = null;
    }

    // Retry stopping any remaining tracks after a short delay
    setTimeout(() => {
      if (cameraStream.value && cameraStream.value.getTracks) {
        cameraStream.value.getTracks().forEach(track => {
          try {
            track.stop();
            console.log("Fallback: Camera track stopped:", track.label);
          } catch (trackErr) {
            console.warn("Fallback: Error stopping camera track:", trackErr);
          }
        });
        cameraStream.value = null;
      }
    }, 500);
  } catch (err) {
    console.error("Failed to stop QR scanner:", err);
    showToast(`Failed to stop QR scanner: ${err.message}`, "error");
  } finally {
    qrScanner.value = null;
    cameraStream.value = null;
    showQrScanner.value = false;
    scannerLoading.value = false;
    scannerError.value = "";
    console.log("Scanner cleanup completed");
  }
}

const fetchUserDetails = debounce(async () => {
  try {
    const barcode = localForm.value.user_barcode?.trim().replace(/[\r\n]+/g, '');
    if (!barcode) {
      localForm.value.borrower_name = "";
      localForm.value.borrower_email = "";
      localForm.value.user_id = "";
      formError.value = "Please enter or scan a valid barcode.";
      return null;
    }
    if (!/^[A-Za-z0-9]{8,20}$/.test(barcode)) {
      localForm.value.borrower_name = "";
      localForm.value.borrower_email = "";
      localForm.value.user_id = "";
      formError.value = "Invalid barcode format. Use 8-20 alphanumeric characters.";
      return null;
    }
    const user = await getUser(barcode);
    if (user) {
      localForm.value.borrower_name = user.username || user.name || "";
      localForm.value.borrower_email = user.email || "";
      localForm.value.user_id = user.id || "";
      formError.value = "";
      return user;
    } else {
      localForm.value.borrower_name = "";
      localForm.value.borrower_email = "";
      localForm.value.user_id = "";
      formError.value = `No user found with barcode ${barcode}.`;
      showToast(formError.value, "error");
      return null;
    }
  } catch (error) {
    formError.value = `Failed to fetch user: ${error.message}`;
    showToast(formError.value, "error");
    console.error("Failed to fetch user:", error);
    localForm.value.borrower_name = "";
    localForm.value.borrower_email = "";
    localForm.value.user_id = "";
    return null;
  }
}, 300);

const fetchBookDetails = debounce(async (index) => {
  try {
    const isbn = localForm.value.books[index].isbn?.trim().replace(/[\r\n]+/g, '');
    if (!isbn) {
      localForm.value.books[index].book_name = "";
      return;
    }
    const normalizedIsbn = normalizeIsbn(isbn);
    if (!/^(?:\d{10}|\d{13})$/.test(normalizedIsbn)) {
      localForm.value.books[index].book_name = "";
      showToast("Invalid ISBN format. Use 10 or 13 digits.", "error");
      return;
    }
    const book = await getBook(normalizedIsbn, "isbn");
    if (book) {
      if (book.quantity <= 0) {
        localForm.value.books[index].book_name = "";
        showToast(`Book "${book.title}" is out of stock.`, "error");
      } else {
        localForm.value.books[index].book_name = book.title;
      }
    } else {
      localForm.value.books[index].book_name = "";
    }
  } catch (error) {
    localForm.value.books[index].book_name = "";
    showToast(`Failed to fetch book: ${error.message}`, "error");
    console.error("Failed to fetch book:", error);
  }
}, 300);

function isStepValid() {
  const today = new Date().toISOString().split('T')[0];
  if (currentStep.value === 1) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (localForm.value.borrowerType === "new") {
      return (
        localForm.value.borrower_name?.trim() &&
        localForm.value.borrower_email?.trim() &&
        emailRegex.test(localForm.value.borrower_email) &&
        localForm.value.librarian_name?.trim() &&
        localForm.value.date_borrow &&
        localForm.value.date_borrow <= today
      );
    } else {
      return (
        localForm.value.user_barcode?.trim() &&
        localForm.value.borrower_name?.trim() &&
        localForm.value.librarian_name?.trim() &&
        localForm.value.date_borrow &&
        localForm.value.date_borrow <= today &&
        localForm.value.user_id
      );
    }
  } else if (currentStep.value === 2) {
    return (
      localForm.value.books.length > 0 &&
      localForm.value.books.every(
        (book) =>
          book.isbn &&
          /^(?:\d{10}|\d{13})$/.test(normalizeIsbn(book.isbn)) &&
          book.book_name &&
          book.return_date &&
          book.return_date >= today
      )
    );
  }
  return true;
}

function nextStep() {
  if (!isStepValid()) {
    formError.value = "Please complete all required fields correctly.";
    showToast(formError.value, "error");
    setTimeout(() => (formError.value = ""), 5000);
    return;
  }
  if (currentStep.value < 3) {
    currentStep.value++;
    stopQrScanner();
  }
}

async function submitForm() {
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });
  if (!isStepValid()) {
    formError.value = "Please complete all required fields correctly.";
    showToast(formError.value, "error");
    setTimeout(() => (formError.value = ""), 5000);
    return;
  }
  try {
    loading.value = true;
    const submitData = {
      borrowerType: localForm.value.borrowerType,
      borrower_name: localForm.value.borrowerType === "new" ? localForm.value.borrower_name : undefined,
      user_name: localForm.value.borrowerType === "existing" ? localForm.value.borrower_name : undefined,
      borrower_email: localForm.value.borrowerType === "new" ? localForm.value.borrower_email : undefined,
      user_barcode: localForm.value.user_barcode || undefined,
      user_id: localForm.value.user_id || undefined,
      librarian_name: localForm.value.librarian_name,
      date_borrow: localForm.value.date_borrow,
      books: localForm.value.books.map((book) => ({
        name: book.book_name,
        isbn: normalizeIsbn(book.isbn),
        date_return: book.return_date,
      })),
      quantity: localForm.value.books.length,
      status: localForm.value.status,
    };
    const response = await new Promise((resolve, reject) => {
      emit("submit", submitData, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
    if (!response || response.status >= 400) {
      throw new Error(response?.data?.message || "Failed to create borrow record.");
    }

    showModal.value = false;
    emit("close");
  } catch (error) {
    formError.value = error.message || "Failed to create borrow record.";
    errorMessage.value = formError.value;
    showToast(`Error: ${formError.value}`, "error");
    setTimeout(() => {
      formError.value = "";
      errorMessage.value = "";
    }, 6000);
  } finally {
    loading.value = false;
  }
}
</script>