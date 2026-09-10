const express = require("express");

const {
  createDecisionController,
  getDecisionsController,
  getDecisionController,
  generateAnalysesController,
  generateReportController,
  getReportsController,
} = require("../controllers/decisionController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------------- Decisions ---------------- */

router.post(
  "/",
  authenticateToken,
  createDecisionController
);

router.get(
  "/",
  authenticateToken,
  getDecisionsController
);

/* ---------------- Reports ---------------- */

router.get(
  "/reports",
  authenticateToken,
  getReportsController
);

/* ---------------- Single Decision ---------------- */

router.get(
  "/:id",
  authenticateToken,
  getDecisionController
);

/* ---------------- AI Analysis ---------------- */

router.post(
  "/:id/analyze",
  authenticateToken,
  generateAnalysesController
);

/* ---------------- Final Report ---------------- */

router.post(
  "/:id/report",
  authenticateToken,
  generateReportController
);

module.exports = router;