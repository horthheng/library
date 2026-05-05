const db = require("../models");
const Borrow = db.Borrow;
const Book = db.Book;
const User = db.User;
const { Op, fn, col, literal } = require("sequelize");
const nodemailer = require("nodemailer");
const { transporter } = require("../utils/mailer");

// for chart js
exports.activity = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const view = req.query.view || 'year';
    const month = parseInt(req.query.month) || null;
    const week = parseInt(req.query.week) || null; // for week view

    let data = [];

    if (view === 'year') {
      // Yearly: Monthly totals
      const borrows = await Borrow.findAll({
        attributes: [
          [fn('MONTH', col('borrow_date')), 'monthNum'],
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          borrow_date: {
            [Op.between]: [`${year}-01-01`, `${year}-12-31`]
          }
        },
        group: ['monthNum'],
        order: [['monthNum', 'ASC']]
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = monthNames.map((m, i) => {
        const found = borrows.find(b => b.get('monthNum') === i + 1);
        return { label: m, value: found ? parseInt(found.get('count')) : 0 };
      });

    } else if (view === 'month' && month) {
      // Monthly: Weekly breakdown
      const borrows = await Borrow.findAll({
        attributes: [
          [
            literal(`
              CASE 
                WHEN DAY(borrow_date) BETWEEN 1 AND 7 THEN 'Week 1'
                WHEN DAY(borrow_date) BETWEEN 8 AND 14 THEN 'Week 2'
                WHEN DAY(borrow_date) BETWEEN 15 AND 21 THEN 'Week 3'
                ELSE 'Week 4'
              END
            `),
            'week'
          ],
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          borrow_date: {
            [Op.between]: [
              `${year}-${String(month).padStart(2, '0')}-01`,
              `${year}-${String(month).padStart(2, '0')}-31`
            ]
          }
        },
        group: ['week'],
        order: [['week', 'ASC']]
      });

      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = weeks.map(w => {
        const found = borrows.find(b => b.get('week') === w);
        return { label: w, value: found ? parseInt(found.get('count')) : 0 };
      });

    } else if (view === 'week' && month && week) {
      // Weekly: Daily breakdown
      const startDay = (week - 1) * 7 + 1;
      const endDay = Math.min(week * 7, 31);

      const borrows = await Borrow.findAll({
        attributes: [
          [fn('DAY', col('borrow_date')), 'dayNum'],
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          borrow_date: {
            [Op.between]: [
              `${year}-${String(month).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
              `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`
            ]
          }
        },
        group: ['dayNum'],
        order: [['dayNum', 'ASC']]
      });

      const days = Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i);
      data = days.map(d => {
        const found = borrows.find(b => b.get('dayNum') === d);
        return { label: `Day ${d}`, value: found ? parseInt(found.get('count')) : 0 };
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching borrow activity:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// for top borrowers 
exports.topBorrowers = async (req, res) => {
  try {
    const borrows = await Borrow.findAll({
      attributes: [
        'user_id',
        [fn('COUNT', col('Borrow.id')), 'books']
      ],
      group: ['user_id', 'user.id', 'user.username', 'user.profile_image'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profile_image']
      }],
      order: [[fn('COUNT', col('Borrow.id')), 'DESC']]
      // no limit here
    });

    const result = borrows.map(b => ({
      id: b.user_id,
      name: b.user?.username || 'Unknown',
      avatar: b.user?.profile_image
        ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/profile/${b.user.profile_image}`
        : `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/default-avatar.png`,
      books: b.dataValues.books
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("[allBorrowers] Error:", error);
  }
};

// Format borrow record output
const formatBorrow = (borrow) => ({
  id: borrow.id,
  user_name: borrow.user?.username || borrow.borrower_name,
  email: borrow.user?.email || borrow.borrower_email,
  book_name: borrow.book?.title,
  isbn: borrow.book?.isbn,
  quantity: borrow.borrowed_quantity,
  librarian_name: borrow.librarian?.username,
  date_borrow: borrow.borrow_date,
  date_return: borrow.return_date,
  status: borrow.status,
});

exports.index = async (req, res) => {
  try {
    const borrows = await db.Borrow.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["username", "email"],
        },
        {
          model: db.User,
          as: "librarian",
          attributes: ["username"],
        },
        {
          model: db.Book,
          as: "book",
          attributes: ["title", "cover_image"],
          include: [
            {
              model: db.Author,
              as: "author",
              attributes: ["name"],
            },
            {
              model: db.Category,
              as: "category",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    const formatted = borrows.map((borrow) => ({
      id: borrow.id,
      book: {
        title: borrow.book?.title || null,
        author: borrow.book?.author?.name || null,
        category: borrow.book?.category?.name || null,
        cover_image: borrow.book?.cover_image
          ? `${req.protocol}://${req.get("host")}/uploads/books/${borrow.book.cover_image
          }`
          : null,
      },
      user: {
        name: borrow.user?.username || borrow.borrower_name || null,
        email: borrow.user?.email || borrow.borrower_email || null,
      },
      borrowed_quantity: borrow.borrowed_quantity,
      status: borrow.status,
      borrow_date: borrow.borrow_date,
      return_date: borrow.return_date,
      librarian: {
        name: borrow.librarian?.username || null,
      },
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("[BorrowController] Error fetching borrow records:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch borrow records.",
        error: error.message,
      });
  }
};

exports.show = async (req, res) => {
  try {
    const borrow = await db.Borrow.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["username", "email"],
        },
        {
          model: db.User,
          as: "librarian",
          attributes: ["username"],
        },
        {
          model: db.Book,
          as: "book",
          attributes: ["title", "cover_image"],
          include: [
            {
              model: db.Author,
              as: "author",
              attributes: ["name"],
            },
            {
              model: db.Category,
              as: "category",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    const formatted = {
      id: borrow.id,
      book: {
        title: borrow.book?.title || null,
        author: borrow.book?.author?.name || null,
        category: borrow.book?.category?.name || null,
        cover_image: borrow.book?.cover_image || null,
      },
      user: {
        name: borrow.user?.username || borrow.borrower_name || null,
        email: borrow.user?.email || borrow.borrower_email || null,
      },
      librarian: {
        name: borrow.librarian?.username || null,
      },
      borrowed_quantity: borrow.borrowed_quantity,
      status: borrow.status,
      borrow_date: borrow.borrow_date,
      return_date: borrow.return_date,
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error("[BorrowController] Error fetching borrow record:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch borrow record.",
        error: error.message,
      });
  }
};

// POST /api/borrows
exports.store = async (req, res) => {
  try {
    const {
      user_name,
      user_barcode,
      borrower_name,
      borrower_email,
      is_new_user,
      books, // <-- Array of books with name, isbn, date_return
      quantity,
      librarian_name,
      date_borrow,
      status,
    } = req.body;

    let user = null;
    let final_borrower_name = null;
    let final_borrower_email = null;

    // Determine borrower
    if (is_new_user) {
      final_borrower_name = borrower_name;
      final_borrower_email = borrower_email;
    } else {
      user = user_barcode
        ? await User.findOne({ where: { barcode: user_barcode } })
        : await User.findOne({ where: { username: user_name } });

      if (!user) return res.status(404).json({ message: "User not found." });
    }

    // Find librarian
    const librarian = await User.findOne({
      where: { username: librarian_name },
    });
    if (!librarian)
      return res.status(404).json({ message: "Librarian not found." });

    // Validate borrow date
    if (isNaN(new Date(date_borrow))) {
      return res.status(400).json({ message: "Invalid borrow date." });
    }

    const borrowRecords = [];

    for (const bookData of books) {
      const { name, isbn, date_return } = bookData;

      if (date_return && isNaN(new Date(date_return))) {
        return res
          .status(400)
          .json({ message: `Invalid return date for book "${name}".` });
      }

      const book = await Book.findOne({ where: { title: name, isbn } });
      if (!book) {
        return res.status(404).json({ message: `Book "${name}" not found.` });
      }

      if (book.quantity < quantity) {
        return res
          .status(400)
          .json({ message: `Not enough copies of "${name}" available.` });
      }

      // Create borrow record
      const newBorrow = await Borrow.create({
        user_id: user ? user.id : null,
        borrower_name: final_borrower_name,
        borrower_email: final_borrower_email,
        book_id: book.id,
        librarian_id: librarian.id,
        isbn,
        borrow_date: new Date(date_borrow),
        return_date: new Date(date_return),
        status: status || "borrowed",
        borrowed_quantity: quantity,
      });

      // Update book stock
      const updatedQuantity = book.quantity - quantity;
      await book.update({
        quantity: updatedQuantity,
        available: updatedQuantity > 0,
      });

      // Fetch full borrow record
      const borrowWithAssociations = await Borrow.findByPk(newBorrow.id, {
        include: [
          { model: User, as: "user", attributes: ["username", "email"] },
          {
            model: Book,
            as: "book",
            attributes: ["title", "isbn", "quantity"],
          },
          { model: User, as: "librarian", attributes: ["username"] },
        ],
      });

      // Format response
      borrowRecords.push({
        id: borrowWithAssociations.id,
        user_name: borrowWithAssociations.user
          ? borrowWithAssociations.user.username
          : borrowWithAssociations.borrower_name,
        email: borrowWithAssociations.user
          ? borrowWithAssociations.user.email
          : borrowWithAssociations.borrower_email,
        book_name: borrowWithAssociations.book.title,
        isbn: borrowWithAssociations.book.isbn,
        quantity: borrowWithAssociations.borrowed_quantity,
        librarian_name: borrowWithAssociations.librarian.username,
        date_borrow: new Date(borrowWithAssociations.borrow_date)
          .toISOString()
          .split("T")[0],
        date_return: new Date(borrowWithAssociations.return_date)
          .toISOString()
          .split("T")[0],
        status: borrowWithAssociations.status,
      });
    }

    res.status(201).json({
      message: "Books borrowed successfully.",
      borrows: borrowRecords,
    });
  } catch (err) {
    console.error("Error borrowing books:", err);
    res.status(500).json({
      message: "Failed to create borrow records.",
      error: err.message,
    });
  }
};

// PUT /api/borrows/:id
exports.update = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    const {
      user_name,
      borrower_name,
      borrower_email,
      book_name,
      return_date,
      status,
    } = req.body;

    // Variables to update
    const updateData = {};

    // Update user_id if user_name provided
    if (user_name) {
      const user = await User.findOne({ where: { username: user_name } });
      if (!user) return res.status(404).json({ message: "User not found." });
      updateData.user_id = user.id;

      // Clear guest borrower info when updating to existing user
      updateData.borrower_name = null;
      updateData.borrower_email = null;
    } else if (borrower_name || borrower_email) {
      // Update guest borrower info, clear user_id if switching to guest
      updateData.borrower_name = borrower_name || borrow.borrower_name;
      updateData.borrower_email = borrower_email || borrow.borrower_email;
      updateData.user_id = null;
    }

    // Update book_id if book_name provided
    if (book_name) {
      const book = await Book.findOne({ where: { title: book_name } });
      if (!book) return res.status(404).json({ message: "Book not found." });
      updateData.book_id = book.id;
    }

    if (return_date) updateData.return_date = return_date;
    if (status) updateData.status = status;

    // Update the borrow record
    await borrow.update(updateData);

    // If book is returned, mark available
    if (status === "returned") {
      const book = await Book.findByPk(borrow.book_id);
      if (book) {
        await book.update({ available: true });
      }
    }

    // Fetch updated borrow with associations
    const updated = await Borrow.findByPk(borrow.id, {
      include: [
        { model: User, as: "user", attributes: ["username", "email"] },
        { model: User, as: "librarian", attributes: ["username"] },
        { model: Book, as: "book", attributes: ["title", "isbn"] },
      ],
    });

    // Format response with fallback for guest borrower
    const formatted = {
      id: updated.id,
      book: {
        title: updated.book?.title,
        isbn: updated.book?.isbn,
      },
      user: {
        name: updated.user?.username || updated.borrower_name,
        email: updated.user?.email || updated.borrower_email,
      },
      librarian: {
        name: updated.librarian?.username,
      },
      borrowed_quantity: updated.borrowed_quantity,
      borrow_date: updated.borrow_date,
      return_date: updated.return_date,
      status: updated.status,
    };

    res.status(200).json(formatted);
  } catch (err) {
    console.error("[BorrowController] Failed to update borrow:", err);
    res
      .status(500)
      .json({ message: "Failed to update borrow record.", error: err.message });
  }
};

// DELETE /api/borrows/:id
exports.destroy = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow)
      return res.status(404).json({ message: "Borrow record not found." });

    await borrow.destroy();
    res.json({ message: "Borrow record deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete borrow record." });
  }
};

exports.sendReturnReminders = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split("T")[0];
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const borrows = await Borrow.findAll({
      where: {
        return_date: [todayStr, tomorrowStr],
        status: "borrowed",
      },
    });

    if (borrows.length === 0) {
      console.log(`📭 No borrow records due on ${todayStr} or ${tomorrowStr}`);
      return;
    }

    for (const borrow of borrows) {
      const returnDate = new Date(borrow.return_date);
      const returnDateStr = returnDate.toISOString().split("T")[0];

      const book = await Book.findByPk(borrow.book_id);
      const bookName = book?.title || "Unknown Book";

      // Get email and name
      let recipientEmail = borrow.borrower_email;
      let recipientName = borrow.borrower_name;

      if (!recipientEmail && borrow.user_id) {
        const user = await User.findByPk(borrow.user_id);
        recipientEmail = user?.email;
        recipientName = user?.username || "Library User";
      }

      if (!recipientEmail) {
        console.warn(`⚠️ No email found for borrow ID ${borrow.id}`);
        continue;
      }

      // Determine if due today or tomorrow
      const isDueToday = returnDateStr === todayStr;
      const isDueTomorrow = returnDateStr === tomorrowStr;

      const subject = isDueToday
        ? "📚 Book Return Due Today!"
        : "📚 Book Return Reminder (Due Tomorrow)";

      const message = isDueToday
        ? `Your borrowed book, <strong style="color: #1a3c6d;">${bookName}</strong>, is due <strong style="color: #1a3c6d;">today (${returnDateStr})</strong>.`
        : `This is a friendly reminder that your borrowed book, <strong style="color: #1a3c6d;">${bookName}</strong>, is due <strong style="color: #1a3c6d;">tomorrow (${returnDateStr})</strong>.`;

      const mailOptions = {
        from: `"Library System" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject,
        html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #1a3c6d; font-size: 24px; margin: 0;">${subject}</h1>
    </div>
    <div style="color: #333333; font-size: 16px; line-height: 1.6;">
      <p style="margin: 0 0 10px;">Dear ${recipientName || "Borrower"},</p>
      <p style="margin: 0 0 20px;">${message}</p>
      <p style="margin: 0 0 20px;">Please return it to the library on time to avoid any late fees.</p>
      <p style="margin: 0;">Thank you for your attention,</p>
      <p style="margin: 5px 0 0;">The Library Team</p>
    </div>
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777777; font-size: 14px;">
      <p style="margin: 0;">Library System | 123 Library Lane, Booktown</p>
      <p style="margin: 5px 0 0;">Questions? Contact us at <a href="mailto:support@librarysystem.com" style="color: #1a3c6d; text-decoration: none;">support@librarysystem.com</a></p>
    </div>
  </div>
</div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Reminder sent to ${recipientEmail} (${subject})`);
    }
  } catch (err) {
    console.error("❌ Failed to send reminders:", err.message);
  }
};