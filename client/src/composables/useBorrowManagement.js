import { ref, computed, provide } from "vue";
import {
  getBorrows,
  createBorrow,
  updateBorrow,
  deleteBorrow,
} from "@/services/Api/borrow";
import { getBooks, updateBook } from "@/services/Api/book";
import { getAllUsers } from "@/services/Api/user";
import { exportToExcel } from "@/utils/exportToExcel";

export function useBorrowManagement() {
  const borrowData = ref([]);
  const booksData = ref([]);
  const usersData = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const search = ref("");
  const limit = ref("all"); 
  const currentPage = ref(1);
  const selectedStatus = ref("");
  const selectedCategory = ref("");
  const showModal = ref(false);
  const showBookDetail = ref(false);
  const showUpdateModal = ref(false);
  const showConfirmModal = ref(false);
  const openDropdown = ref(null);
  const selectedBook = ref({});
  const returnId = ref(null);
  const message = ref("");
  const messageType = ref("success");
  const formError = ref("");

  const addForm = ref({
    borrowerType: "new",
    borrower_name: "",
    borrower_email: "",
    user_barcode: "",
    user_id: "",
    books: [{ isbn: "", book_name: "", return_date: "" }],
    librarian_name: "",
    date_borrow: "",
    status: "borrowed",
  });

  const updateForm = ref({
    id: null,
    user_name: "",
    borrower_email: "",
    book_name: "",
    return_date: "",
    status: "",
    books: [],
  });

  const statusOptions = ref([
    { value: "borrowed", label: "Borrowing" },
    { value: "overdue", label: "Overdue" },
    { value: "returned", label: "Returned" },
  ]);

  const limitOptions = ref([
    { value: "10", label: "Show 10" },
    { value: "30", label: "Show 30" },
    { value: "50", label: "Show 50" },
    { value: "all", label: "Show All" },
  ]);

  provide("borrowManagement", {
    getBook,
    getUser,
    showToast,
    fetchBooksData,
    fetchUsersData,
    booksData,
    usersData,
  });

  const categories = computed(() => {
    const set = new Set(booksData.value.map((item) => item.category).filter(Boolean));
    return Array.from(set);
  });

  const borrowedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "borrowed").length;
  });
  const returnedCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "returned").length;
  });
  const overdueCount = computed(() => {
    return borrowData.value.filter((item) => getItemStatus(item) === "overdue").length;
  });

  const filteredBorrowData = computed(() => {
    console.log("Applying filters:", {
      search: search.value,
      selectedStatus: selectedStatus.value,
      selectedCategory: selectedCategory.value,
      currentPage: currentPage.value,
      limit: limit.value,
    });

    let filtered = borrowData.value;

    if (search.value) {
      const searchTerm = search.value.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.book?.title?.toLowerCase()?.includes(searchTerm) || false) ||
          (item.user?.name?.toLowerCase()?.includes(searchTerm) || false)
      );
    }

    if (selectedCategory.value) {
      filtered = filtered.filter((item) => item.book?.category === selectedCategory.value);
    }

    if (selectedStatus.value) {
      filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
    }

    if (limit.value === "all") {
      console.log("Showing all filtered data:", filtered);
      return filtered;
    }
    const start = (currentPage.value - 1) * parseInt(limit.value);
    const end = start + parseInt(limit.value);
    const paginatedData = filtered.slice(start, end);

    console.log("Filtered and paginated data:", paginatedData);
    return paginatedData;
  });

  const totalFilteredItems = computed(() => {
    let filtered = borrowData.value;

    if (search.value) {
      const searchTerm = search.value.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.book?.title?.toLowerCase()?.includes(searchTerm) || false) ||
          (item.user?.name?.toLowerCase()?.includes(searchTerm) || false)
      );
    }

    if (selectedCategory.value) {
      filtered = filtered.filter((item) => item.book?.category === selectedCategory.value);
    }

    if (selectedStatus.value) {
      filtered = filtered.filter((item) => getItemStatus(item) === selectedStatus.value);
    }

    console.log("Total filtered items:", filtered.length);
    return filtered.length;
  });

  const totalPages = computed(() => {
    if (limit.value === "all") {
      console.log("Total pages (show all): 1");
      return 1;
    }
    const pages = Math.max(1, Math.ceil(totalFilteredItems.value / parseInt(limit.value)));
    console.log("Total pages:", pages);
    return pages;
  });

  function getItemStatus(item) {
    if (!item || !item.return_date) return "borrowed";
    if (item.status === "returned") return "returned";
    const today = new Date();
    const returnDate = new Date(item.return_date);
    return today > returnDate ? "overdue" : "borrowed";
  }

  function getDaysLeft(item) {
    if (!item || !item.return_date || item.status === "returned") return 0;
    const today = new Date();
    const returnDate = new Date(item.return_date);
    const diffTime = returnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function toggleDropdown(id) {
    openDropdown.value = openDropdown.value === id ? null : id;
  }

  function showToast(msg, type = "success") {
    message.value = msg;
    messageType.value = type;
    setTimeout(() => {
      message.value = "";
      messageType.value = "";
    }, 5000);
  }

  async function fetchBooksData() {
    try {
      loading.value = true;
      const response = await getBooks();
      console.log("Raw API response for getBooks:", response);
      booksData.value = Array.isArray(response.data?.books) ? response.data.books : [];
      console.log("Books fetched:", booksData.value);
      if (!booksData.value.length) {
        showToast("No books available in the database. Please add books to continue.", "error");
      }
    } catch (err) {
      console.error("Error fetching books:", err.message, err.stack);
      showToast("Failed to load book data. Please check your connection or database.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function getBook(identifier, type = "isbn") {
    try {
      if (!identifier) throw new Error(`${type.toUpperCase()} is missing or invalid`);
      console.log(`Looking for book with ${type}: ${identifier}`);
      let book;
      if (type === "isbn") {
        const normalizedIsbn = identifier.trim();
        book = booksData.value.find((b) => b.isbn === normalizedIsbn);
      } else if (type === "barcode") {
        book = booksData.value.find((b) => b.barcode === identifier.trim());
      } else if (type === "id") {
        book = booksData.value.find((b) => b.id === identifier);
      } else if (type === "title") {
        book = booksData.value.find((b) => b.title?.toLowerCase() === identifier.toLowerCase());
      }
      if (!book) {
        throw new Error(`Book not found for ${type}: ${identifier}`);
      }
      console.log("Book found:", book);
      return book;
    } catch (error) {
      console.error("Error in getBook:", error.message, error.stack);
      return null;
    }
  }

  async function fetchUsersData() {
    try {
      loading.value = true;
      const response = await getAllUsers();
      usersData.value = Array.isArray(response.data?.users) ? response.data.users : [];
      if (!usersData.value.length) {
        showToast("No users available in the database.", "error");
      }
    } catch (err) {
      showToast("Failed to load user data. Please check your connection or database.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function getUser(barcode) {
    try {
      if (!barcode) throw new Error("User barcode is missing or invalid");
      const normalizedBarcode = barcode.trim();
      let user = usersData.value.find((u) => u.barcode === normalizedBarcode);
      if (!user) {
        user = usersData.value.find((u) => u.id === normalizedBarcode);
      }
      if (!user) {
        throw new Error(`User not found for barcode: ${barcode}`);
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  async function fetchBorrowData() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getBorrows();
      borrowData.value = Array.isArray(response.data) ? response.data : [];
      console.log("Borrow data fetched:", borrowData.value);
    } catch (err) {
      error.value = "Failed to load borrow records.";
      showToast("Failed to load borrow records.", "error");
    } finally {
      loading.value = false;
    }
  }

  async function submitAddBorrow(formData) {
    try {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });

      if (!formData) throw new Error("No form data provided.");
      if (formData.borrowerType === "new") {
        if (!formData.borrower_name?.trim() || !formData.borrower_email?.trim() || !formData.date_borrow)
          throw new Error("Borrower name, email, and borrow date are required for new users.");
      } else {
        if (!formData.user_barcode?.trim() || !formData.date_borrow)
          throw new Error("User barcode and borrow date are required for existing users.");
        if (!formData.user_id)
          throw new Error("Valid user ID is required for existing users.");
        const user = await getUser(formData.user_barcode);
        if (!user) throw new Error(`User with barcode ${formData.user_barcode} not found.`);
        formData.user_name = user.username || user.name;
        formData.user_id = user.id;
      }
      if (!formData.librarian_name?.trim()) throw new Error("Librarian name is required.");
      if (!formData.books || formData.books.length === 0) throw new Error("At least one book is required.");
      if (formData.books.length > 3) throw new Error("Cannot borrow more than three books at a time.");

      for (const book of formData.books) {
        if (!book.isbn?.trim()) throw new Error("Book ISBN is required.");
        const normalizedIsbn = book.isbn.replace(/[-\s]/g, "");
        if (!/^(?:\d{10}|\d{13})$/.test(normalizedIsbn)) throw new Error(`Invalid ISBN: ${book.isbn}`);
        if (!book.date_return) throw new Error("Book return date is required.");
        if (!book.name?.trim()) throw new Error("Book name is required.");

        const foundBook = await getBook(normalizedIsbn, "isbn");
        if (!foundBook) throw new Error(`Book not found for ISBN ${book.isbn}.`);
        const newQuantity = foundBook.quantity - (formData.quantity || 1);
        if (newQuantity < 0) {
          throw new Error(`Book "${book.name}" has insufficient stock (available: ${foundBook.quantity}).`);
        }
      }

      loading.value = true;
      error.value = null;
      try {
        const payload = {
          is_new_user: formData.borrowerType === "new",
          borrower_name: formData.borrowerType === "new" ? formData.borrower_name : undefined,
          user_name: formData.borrowerType === "existing" ? formData.user_name : undefined,
          borrower_email: formData.borrowerType === "new" ? formData.borrower_email : undefined,
          user_id: formData.user_id || undefined,
          librarian_name: formData.librarian_name,
          date_borrow: formData.date_borrow,
          books: formData.books.map((book) => ({
            name: book.name,
            isbn: book.isbn,
            date_return: book.date_return,
          })),
          quantity: formData.quantity || 1,
          status: formData.status,
        };
        const response = await createBorrow(payload);

        if (!response || !response.data) {
          throw new Error("Invalid or empty response from createBorrow API.");
        }
        if (response.status && response.status >= 400) {
          const errorMsg = response.data?.message || `API error (status ${response.status})`;
          throw new Error(errorMsg);
        }

        selectedCategory.value = "";
        selectedStatus.value = "";
        search.value = "";
        currentPage.value = 1;
        await fetchBorrowData();
        await fetchBooksData();
        addForm.value = {
          borrowerType: "new",
          borrower_name: "",
          borrower_email: "",
          user_barcode: "",
          user_id: "",
          books: [{ isbn: "", book_name: "", return_date: "" }],
          librarian_name: "",
          date_borrow: "",
          status: "borrowed",
        };
        showModal.value = false;
        showToast("Borrow record created successfully.", "success");
        return response;
      } catch (err) {
        console.error(`Error in createBorrow or updateBook at ${now}:`, err.message, err.response || err);
        throw err;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create borrow record.";
      error.value = errorMessage;
      showToast(errorMessage, "error");
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function submitUpdate(formData) {
    try {
      const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" });

      if (!formData.id) throw new Error("Borrow record ID is missing.");
      if (!formData.return_date) throw new Error("Return date is required.");
      if (!formData.status) throw new Error("Status is required.");

      const borrowRecord = borrowData.value.find((item) => item.id === formData.id);
      if (!borrowRecord) throw new Error(`Borrow record with ID ${formData.id} not found in local data.`);

      let updatedBooks = [];
      if (formData.status === "returned" && borrowRecord.status !== "returned") {
        for (const book of borrowRecord.books || []) {
          const foundBook = await getBook(book.isbn, "isbn");
          if (foundBook) {
            const newQuantity = foundBook.quantity + (formData.quantity || 1);
            try {
              const updateResponse = await updateBook(foundBook.id, { quantity: newQuantity });
              updatedBooks.push({ id: foundBook.id, quantity: foundBook.quantity });
            } catch (updateErr) {
              throw new Error(`Failed to update book "${foundBook.title || book.name}": ${updateErr.response?.data?.message || updateErr.message}`);
            }
          }
        }
      }

      const payload = {
        return_date: formData.return_date,
        status: formData.status,
        books: formData.books || borrowRecord.books,
      };
      const response = await updateBorrow(formData.id, payload);

      if (!response || !response.data) {
        throw new Error("Invalid or empty response from updateBorrow API.");
      }
      if (response.status && response.status >= 400) {
        const errorMsg = response.data?.message || `API error (status ${response.status})`;
        throw new Error(errorMsg);
      }

      showUpdateModal.value = false;
      formError.value = "";
      await fetchBorrowData();
      await fetchBooksData();
      showToast("Borrow record updated successfully", "success");
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update borrow record.";
      formError.value = errorMessage;
      showToast(`Update failed: ${errorMessage}`, "error");
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      if (!id) throw new Error("No ID provided for deletion");
      await deleteBorrow(id);
      await fetchBorrowData();
      showToast("Borrow record deleted.", "success");
    } catch (err) {
      showToast("Failed to delete: " + err.message, "error");
    }
  }

  async function confirmReturn(id) {
    returnId.value = id;
    showConfirmModal.value = true;
  }

  async function handleConfirmReturn() {
    try {
      if (!returnId.value) throw new Error("No borrow record ID provided");
      const borrowRecord = borrowData.value.find((item) => item.id === returnId.value);
      if (!borrowRecord) throw new Error(`Borrow record with ID ${returnId.value} not found`);
      if (borrowRecord.status === "returned") throw new Error(`Borrow record is already returned`);

      const updateBorrowPayload = {
        status: "returned",
        return_date: new Date().toISOString().slice(0, 10),
      };
      await updateBorrow(returnId.value, updateBorrowPayload);

      const booksToUpdate = borrowRecord.books || (borrowRecord.book ? [borrowRecord.book] : []);
      for (const bookItem of booksToUpdate) {
        let foundBook;
        if (bookItem.id) {
          foundBook = booksData.value.find((b) => b.id === bookItem.id);
        } else if (bookItem.title) {
          foundBook = booksData.value.find((b) => b.title === bookItem.title);
        }
        if (!foundBook) {
          console.warn("⚠️ Cannot find book in database for:", bookItem);
          continue;
        }
        const newQuantity = (foundBook.quantity || 0) + 1;
        try {
          await updateBook(foundBook.id, { quantity: newQuantity });
        } catch (err) {
          console.warn(`Failed to update book quantity for ${foundBook.title}:`, err.message);
        }
      }

      await fetchBorrowData();
      await fetchBooksData();
      showToast("Book(s) returned successfully. Quantity updated.", "success");
    } catch (error) {
      console.error("❌ Error returning borrow:", error);
      showToast(`Failed to return book: ${error.message}`, "error");
    } finally {
      showConfirmModal.value = false;
      returnId.value = null;
    }
  }

  function handleShow(item) {
    selectedBook.value = item;
    showBookDetail.value = true;
  }

  function openUpdateModal(item) {
    updateForm.value.id = item?.id || null;
    updateForm.value.user_name = item?.user?.name || item?.borrower_name || "";
    updateForm.value.borrower_email = item?.user?.email || item?.borrower_email || "";
    updateForm.value.book_name = item?.book?.title || item?.book_name || "";
    updateForm.value.return_date = item?.return_date || "";
    updateForm.value.status = item?.status || "borrowed";
    updateForm.value.books = item?.books || (item?.book ? [item.book] : []);
    showUpdateModal.value = true;
  }

  function closeUpdateModal() {
    showUpdateModal.value = false;
    formError.value = "";
  }

function exportBorrowDataToExcel(useFilteredData = true) {
  try {
    // Decide which dataset to export
    const dataToExport = useFilteredData ? nonReturnedBorrowData.value : borrowData.value;
    if (!dataToExport?.length) {
      showToast("No borrow data to export", "error");
      return;
    }

    // Flatten nested book arrays
    const flatData = [];
    dataToExport.forEach((item) => {
      const books = Array.isArray(item.books) ? item.books : [item.book].filter(Boolean);
      if (!books.length) return;

      books.forEach((book) => {
        flatData.push({
          "#": flatData.length + 1,
          Book: book.title || book.name || "",
          Category: book.category?.name || book.category || "",
          Borrower: item.user?.name || item.borrower_name || "",
          Qty: book.quantity || item.quantity || item.borrowed_quantity || 1,
          Status: getItemStatus(item),
          "Borrow Date": formatDate(item.borrow_date) || "",
          "Return Date": formatDate(book.date_return || item.return_date) || "N/A",
        });
      });
    });

    if (!flatData.length) {
      showToast("No valid borrow records to export", "error");
      return;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `BorrowRecords_${timestamp}`;

    // Call your export function
    exportToExcel(flatData, filename);

    showToast("Borrow records exported successfully", "success");
  } catch (err) {
    console.error("Export failed:", err);
    showToast(`Failed to export borrow records: ${err.message}`, "error");
  }
}
const nonReturnedBorrowData = computed(() => {
  return filteredBorrowData.value.filter((item) => getItemStatus(item) !== "returned");
});

  return {
    borrowData,
    booksData,
    usersData,
    search,
    limit,
    limitOptions,
    currentPage,
    selectedStatus,
    selectedCategory,
    showModal,
    showBookDetail,
    showUpdateModal,
    showConfirmModal,
    openDropdown,
    selectedBook,
    addForm,
    updateForm,
    statusOptions,
    formError,
    message,
    messageType,
    returnId,
    categories,
    filteredBorrowData,
    totalFilteredItems,
    totalPages,
    borrowedCount,
    returnedCount,
    overdueCount,
    getItemStatus,
    getDaysLeft,
    formatDate,
    toggleDropdown,
    fetchBorrowData,
    fetchBooksData,
    getBook,
    getUser,
    handleShow,
    openUpdateModal,
    closeUpdateModal,
    submitUpdate,
    submitAddBorrow,
    handleDelete,
    confirmReturn,
    handleConfirmReturn,
    showToast,
    exportBorrowDataToExcel,
    fetchUsersData,
  };
}