const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const userController = require("../controllers/userController.js");
const authJwt = require("../middlewares/authJwt");

// Multer config for profile uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/profile";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Optional upload middleware helper
const uploadOptional = (req, res, next) => {
  const multerMiddleware = upload.single("profile_image");
  multerMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err });
    }
    next();
  });
};

// Public routes
router.get("/all", userController.allAccess);

// Authenticated routes
router.get("/user", [authJwt.verifyToken], userController.userBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);
router.get("/librarian", [authJwt.verifyToken, authJwt.isLibrarian], userController.librarianBoard);

// Barcode & roles routes (put before :id route)
router.get("/:id/barcode", [authJwt.verifyToken], userController.getUserBarcode);
router.get("/roles", [authJwt.verifyToken], userController.getRoles);
router.get("/barcodes/excel", [authJwt.verifyToken, authJwt.isAdmin], userController.exportUsersWithImages);

// User CRUD routes
router.post(
  "/create",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  uploadOptional,
  userController.createUser
);

router.get(
  "/users",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  userController.getAllUsers
);

router.get(
  "/:id",
  [authJwt.verifyToken, authJwt.isLibrarianOrAdmin],
  userController.getUserById
);

router.put(
  "/:id",
  [authJwt.verifyToken],
  uploadOptional,
  userController.updateUser
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.deleteUserById
);

router.post(
  "/:id/upload-image",
  [authJwt.verifyToken, uploadOptional],
  userController.uploadProfileImage
);
// Profile routes
router.get("/profile/me", [authJwt.verifyToken], userController.getUserProfile);
router.delete("/profile/me", [authJwt.verifyToken], userController.deleteAccount);

module.exports = router;
