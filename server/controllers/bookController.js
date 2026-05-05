const { Book, Category, Author, Language, sequelize } = require('../models');
const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');
const { Op } = require('sequelize');

// GET all books
exports.index = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });
    const booksWithImageUrl = books.map(book => {
      const bookData = book.toJSON();
      bookData.cover_image_url = bookData.cover_image
        ? `${req.protocol}://${req.get('host')}/uploads/books/${bookData.cover_image}`
        : null;
      return bookData;
    });
    res.json({ books: booksWithImageUrl });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// GET book by ID
exports.show = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const bookData = book.toJSON();
    bookData.cover_image_url = bookData.cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${bookData.cover_image}`
      : null;
    return res.json({ book: bookData });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

// POST create a new book
exports.store = async (req, res) => {
  try {
    let {
      title,
      isbn,
      quantity,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language,
      language_id
    } = req.body;
    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) {
        return res.status(400).json({ message: `Language '${language}' not found.` });
      }
      language_id = lang.id;
    }
    // language_id is required for the Book model
    if (!language_id) {
      return res.status(400).json({ message: 'Language ID or valid language name is required.' });
    }
    const cover_image = req.file ? req.file.filename : null;
    const newBook = await Book.create({
      title,
      isbn,
      quantity,
      cover_image,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language_id,
    });
    const imageUrl = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${cover_image}`
      : null;
    // Re-fetch the book with included relations
    const createdBook = await Book.findByPk(newBook.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });
    const bookData = {
      ...createdBook.toJSON(),
      cover_image_url: imageUrl,
    };
    res.status(201).json({
      message: 'Book is created successfully.',
      book: bookData,
    });
  } catch (error) {
    console.error('Failed to create book:', error);
    res.status(500).json({ message: 'Failed to create book.', error: error.message });
  }
};

// PUT update a book by ID (partial update supported)
exports.update = async (req, res) => {
  try {
    const bookId = req.params.id;
    let {
      title,
      isbn,
      quantity,
      donated_by,
      public_year,
      description,
      available,
      CategoryId,
      AuthorId,
      language_id,
      language,
    } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // ✅ Check if new ISBN already exists in another book
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(400).json({ message: `ISBN '${isbn}' already exists in another book.` });
      }
    }

    // Handle language if provided
    if (!language_id && language) {
      const lang = await Language.findOne({ where: { name: language } });
      if (!lang) return res.status(400).json({ message: `Language '${language}' not found.` });
      language_id = lang.id;
    }

    // Cover image handling
    const cover_image = req.file ? req.file.filename : book.cover_image;
    if (req.file) {
      const imagePath = path.join(__dirname, '../Uploads/books', cover_image);
      await fs.access(imagePath);
      console.log(`Image verified for update: ${imagePath}`);
    }

    // Only update fields that are provided
    if (title !== undefined) book.title = title;
    if (isbn !== undefined) book.isbn = isbn;
    if (quantity !== undefined) book.quantity = quantity;
    if (donated_by !== undefined) book.donated_by = donated_by;
    if (public_year !== undefined) book.public_year = public_year;
    if (description !== undefined) book.description = description;
    if (available !== undefined) book.available = available;
    if (CategoryId !== undefined) book.CategoryId = CategoryId;
    if (AuthorId !== undefined) book.AuthorId = AuthorId;
    if (language_id !== undefined) book.language_id = language_id;
    book.cover_image = cover_image;

    await book.save();

    const updatedBook = await Book.findByPk(bookId, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'description'] },
        { model: Author, as: 'author', attributes: ['name', 'nationality'] },
        { model: Language, as: 'language', attributes: ['name'] },
      ],
    });

    const imageUrl = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/books/${cover_image}?t=${Date.now()}`
      : null;

    res.json({
      message: 'Book updated successfully.',
      book: {
        ...updatedBook.toJSON(),
        cover_image_url: imageUrl,
      },
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book.' });
  }
};

// DELETE a book by ID
exports.destroy = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    await book.destroy();
    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
};

// Get books added in the last month
exports.getBooksLastMonth = async (req, res) => {
  try {
    const now = new Date();

    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // === ADD DEBUG LOGS HERE ===
    console.log('First day last month:', firstDayLastMonth);
    console.log('Last day last month:', lastDayLastMonth);

    // ==== OPTIONAL: temporary test with this month instead of last month ===
    // const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Your query:
    const total = await Book.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayLastMonth,
          [Op.lte]: lastDayLastMonth,
        }
      }
    });

    // Log the total count found
    console.log('Total books found:', total);

    return res.json({ total });
  } catch (error) {
    console.error('Error fetching books last month:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST import multiple books from Excel
exports.importBooks = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ warnings: [], data: [] });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({ warnings: [], data: [] });
    }

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
    if (!Array.isArray(sheet) || sheet.length < 1) {
      return res.status(400).json({ warnings: [], data: [] });
    }

    // --- Header Mapping (lowercase keys) ---
    const headerMap = {
      'title': 'title',
      'isbn': 'isbn',
      'quantity': 'quantity',
      'from': 'donated_by',
      'publish year': 'public_year',
      'description': 'description',
      'available': 'available',
      'type of book': 'category_name',
      'author': 'author_name',
      'language': 'language_name'
    };

    const requiredColumns = Object.values(headerMap);

    // Read headers from Excel (convert to lowercase)
    const headers = sheet[0].map(h => h?.toString().trim().toLowerCase() || '');
    const normalizedHeaders = headers.map(h => headerMap[h] || h);

    // Check missing columns
    const missingColumns = requiredColumns.filter(col => !normalizedHeaders.includes(col));
    const warnings = [];
    if (missingColumns.length > 0) {
      warnings.push(`Some required columns are missing: ${missingColumns.join(', ')}`);
    }

    const booksCreated = [];
    const t = await sequelize.transaction();

    try {
      const seenISBNs = new Set(); // track duplicates in Excel file

      for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];
        if (!row || !Array.isArray(row)) {
          warnings.push(`Row ${i + 1} skipped: invalid or empty data.`);
          continue;
        }

        const data = {};
        normalizedHeaders.forEach((dbHeader, index) => {
          if (!dbHeader) return;
          data[dbHeader] = row[index] ? row[index].toString().trim() : null;
        });

        if (!data.title || !data.isbn) {
          warnings.push(`Row ${i + 1} skipped: missing title or ISBN.`);
          continue;
        }

        // ✅ Skip duplicate ISBNs in the same Excel file
        if (seenISBNs.has(data.isbn)) {
          warnings.push(`Row ${i + 1} skipped: duplicate ISBN '${data.isbn}' in file.`);
          continue;
        }
        seenISBNs.add(data.isbn);

        // ✅ Skip if ISBN already exists in the database
        const existingBook = await Book.findOne({ where: { isbn: data.isbn }, transaction: t });
        if (existingBook) {
          warnings.push(`Row ${i + 1} skipped: ISBN '${data.isbn}' already exists in system.`);
          continue;
        }

        // --- Category ---
        let CategoryId;
        const category = await Category.findOne({ where: { name: data.category_name }, transaction: t });
        if (category) {
          CategoryId = category.id;
        } else if (data.category_name) {
          const newCategory = await Category.create({ name: data.category_name, description: '' }, { transaction: t });
          CategoryId = newCategory.id;
          warnings.push(`Row ${i + 1}: New category '${data.category_name}' created.`);
        } else {
          warnings.push(`Row ${i + 1} skipped: missing category name.`);
          continue;
        }

        // --- Author ---
        let AuthorId;
        const author = await Author.findOne({ where: { name: data.author_name }, transaction: t });
        if (author) {
          AuthorId = author.id;
        } else if (data.author_name) {
          const newAuthor = await Author.create({ name: data.author_name, nationality: '' }, { transaction: t });
          AuthorId = newAuthor.id;
          warnings.push(`Row ${i + 1}: New author '${data.author_name}' created.`);
        } else {
          warnings.push(`Row ${i + 1} skipped: missing author name.`);
          continue;
        }

        // --- Language ---
        let language_id;
        const language = await Language.findOne({ where: { name: data.language_name }, transaction: t });
        if (language) {
          language_id = language.id;
        } else if (data.language_name) {
          const newLanguage = await Language.create({ name: data.language_name }, { transaction: t });
          language_id = newLanguage.id;
          warnings.push(`Row ${i + 1}: New language '${data.language_name}' created.`);
        } else {
          warnings.push(`Row ${i + 1} skipped: missing language name.`);
          continue;
        }

        const available = data.available?.toLowerCase() === 'true' || data.available === '1';
        const quantity = parseInt(data.quantity, 10);
        const public_year = parseInt(data.public_year, 10);
        const coverImage = data.cover_image || null;

        if (!coverImage) {
          warnings.push(`Row ${i + 1}: No cover image provided. Please update cover image later.`);
        }

        const newBook = await Book.create({
          title: data.title,
          isbn: data.isbn,
          quantity: Number.isInteger(quantity) ? quantity : 1,
          cover_image: coverImage,
          donated_by: data.donated_by,
          public_year: Number.isInteger(public_year) ? public_year : null,
          description: data.description,
          available,
          CategoryId,
          AuthorId,
          language_id
        }, { transaction: t });

        booksCreated.push(newBook);
      }

      await t.commit();

      return res.status(200).json({
        warnings: warnings.length > 0 ? warnings : undefined,
        data: booksCreated
      });

    } catch (err) {
      await t.rollback();
      return res.status(400).json({ warnings, data: booksCreated });
    }

  } catch (error) {
    console.error('Error importing books:', error);
    return res.status(400).json({ warnings: [], data: [] });
  }
};

// GET sample Excel template
exports.sampleExcel = (req, res) => {
  try {
    const wb = XLSX.utils.book_new();

    const data = [
      [
        'Title',
        'ISBN',
        'Quantity',
        'From',
        'Publish Year',
        'Description',
        'Type of Book',
        'Author',
        'Language'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [
      { wch: 15 }, { wch: 15 }, { wch: 8 }, { wch: 20 }, { wch: 12 },
      { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Books');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=sample_books_import.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Error generating sample Excel:', error);
    res.status(500).json({ message: 'Failed to generate sample Excel.' });
  }
};