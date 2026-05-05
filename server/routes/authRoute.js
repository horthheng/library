const express = require("express");
const {
  signup,
  signin,
} = require("../controllers/authController.js");
const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} = require("../middlewares/verifySignUp");
const { verifyToken } = require("../middlewares/authJwt");

const router = express.Router();
const upload = require("../middlewares/upload");

// Use multer middleware for profile_image field
router.post("/signup", upload.single("profile_image"),signup);

// Public routes

router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted,verifyToken], signup);
router.post("/signin", signin);



module.exports = router;