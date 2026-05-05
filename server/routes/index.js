const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiResource = require('./ApiRescource');

// Import controllers
const bookController = require('../controllers/bookController');
const categoryController = require('../controllers/categoriesController');
const authorController = require('../controllers/authorController');
const borrowController = require('../controllers/borrowController');
const languageBook = require('../controllers/langaugeBook');
const donationController = require('../controllers/donationController');
const SummaryController = require('../controllers/SummaryController');

// Upload base folder
const uploadDir = path.join(__dirname, '../Uploads');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = uploadDir;

    if (req.baseUrl.includes('/books')) {
      folder = path.join(uploadDir, 'books');
    } else if (req.baseUrl.includes('/categories')) {
      folder = path.join(uploadDir, 'categories');
    } else if (req.baseUrl.includes('/donations')) {
      folder = path.join(uploadDir, 'donations');
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const uploadMemory = multer({ storage: multer.memoryStorage() });

// Register all routes
const resources = [
  apiResource('/books', bookController, {
    store: [upload.single('cover_image')],
    update: [upload.single('cover_image')],
  }),
  apiResource('/borrow', borrowController),
  apiResource('/categories', categoryController),
  apiResource('/language', languageBook),
  apiResource('/authors', authorController),
  apiResource('/summaries', SummaryController),
  apiResource('/donations', donationController, {
    store: [upload.single('cover_image')],
    update: [upload.single('cover_image')],
  }),
];

// Add custom routes for import and sample
router.post('/books/import-book', uploadMemory.single('file'), bookController.importBooks);
router.get('/books/sample-excel', bookController.sampleExcel);
router.get('/books/last-month', bookController.getBooksLastMonth);

// Custom route for monthly borrow activity
router.get('/borrows/activity', borrowController.activity);
router.get('/borrows/top-borrowers', borrowController.topBorrowers);

router.get("/api/reminder-test", borrowController.sendReturnReminders);

// Use each resource route
resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;