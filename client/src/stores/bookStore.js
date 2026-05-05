import { ref } from 'vue'

export const bookStore = {
  filteredBooks: ref([]),
  setFilteredBooks(books) {
    this.filteredBooks.value = books
  }
}