const express = require("express");

const authenticateToken =
  require("../middleware/authMiddleware");

const {
  signup,
  login,
  getMe,
  updateProfileController,
} = require("../controllers/authController");

const router =
  express.Router();

/* ---------------- Authentication ---------------- */

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

/* ---------------- Current User ---------------- */

router.get(
  "/me",
  authenticateToken,
  getMe
);

/* ---------------- Profile ---------------- */

router.put(
  "/profile",
  authenticateToken,
  updateProfileController
);

module.exports = router;