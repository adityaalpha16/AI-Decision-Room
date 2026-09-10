const {
  createDecision,
  getUserDecisions,
  getUserReportCount,
  getUserAverageConfidence,
  getUserAnalysisCount,
  getUserDecisionStats,
  getDecisionById,
  updateDecisionStatus,
} = require("../services/decisionService");

const {
  generateDecisionAnalyses,
  getDecisionAnalyses,
} = require("../services/analysisService");

const {
  generateFinalReport,
  getFinalReport,
  getUserReports,
} = require("../services/reportService");

/* ---------------- Create Decision ---------------- */

async function createDecisionController(req, res) {
  try {
    const userId = req.user.id;

    const {
      title,
      problem,
      context,
    } = req.body;

    if (!title || !problem) {
      return res.status(400).json({
        status: "error",
        message: "Title and problem are required",
      });
    }

    const decision = await createDecision(
      userId,
      title,
      problem,
      context
    );

    return res.status(201).json({
      status: "success",
      decision,
    });
  } catch (error) {
    console.error(
      "Create decision error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message: "Failed to create decision",
    });
  }
}

/* ---------------- Get Dashboard Data ---------------- */

async function getDecisionsController(req, res) {
  try {
    const userId = req.user.id;

    const decisions =
      await getUserDecisions(userId);

    const reportCount =
      await getUserReportCount(userId);

    const averageConfidence =
      await getUserAverageConfidence(userId);

    const analysisCount =
      await getUserAnalysisCount(userId);

    const decisionStats =
      await getUserDecisionStats(userId);

    /*
     * Get existing reports.
     *
     * This does NOT call Gemini.
     * It only reads reports already stored
     * in PostgreSQL.
     */
    const reports =
      await getUserReports(userId);

    /*
     * Reports are already ordered by
     * created_at DESC in reportService.js.
     *
     * Therefore the first report is
     * the latest generated report.
     */
    const latestReport =
      reports.length > 0
        ? reports[0]
        : null;

    return res.status(200).json({
      status: "success",
      decisions,
      reportCount,
      averageConfidence,
      analysisCount,
      decisionStats,
      latestReport,
    });
  } catch (error) {
    console.error(
      "Get dashboard data error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message:
        "Failed to fetch dashboard data",
    });
  }
}

/* ---------------- Get Single Decision ---------------- */

async function getDecisionController(req, res) {
  try {
    const userId = req.user.id;
    const decisionId = req.params.id;

    const decision =
      await getDecisionById(
        decisionId,
        userId
      );

    if (!decision) {
      return res.status(404).json({
        status: "error",
        message: "Decision not found",
      });
    }

   const analyses =
  await getDecisionAnalyses(
    decisionId
  );

    const report =
      await getFinalReport(
        decisionId
      );

    return res.status(200).json({
      status: "success",
      decision,
      analyses,
      report,
    });
  } catch (error) {
    console.error(
      "Get decision error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message:
        "Failed to fetch decision",
    });
  }
}

/* ---------------- Generate Analyses ---------------- */

async function generateAnalysesController(req, res) {
  try {
    const userId = req.user.id;
    const decisionId = req.params.id;

    const decision =
      await getDecisionById(
        decisionId,
        userId
      );

    if (!decision) {
      return res.status(404).json({
        status: "error",
        message: "Decision not found",
      });
    }

    await updateDecisionStatus(
      decisionId,
      "processing"
    );

    try {
     const analyses =
  await generateDecisionAnalyses(
    decisionId
  );

      await updateDecisionStatus(
        decisionId,
        "completed"
      );

      return res.status(200).json({
        status: "success",
        analyses,
      });
    } catch (analysisError) {
      await updateDecisionStatus(
        decisionId,
        "failed"
      );

      throw analysisError;
    }
  } catch (error) {
    console.error(
      "Generate analyses error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message:
        "Failed to generate analyses",
    });
  }
}

/* ---------------- Generate Final Report ---------------- */

async function generateReportController(req, res) {
  try {
    const userId = req.user.id;
    const decisionId = req.params.id;

    const decision =
      await getDecisionById(
        decisionId,
        userId
      );

    if (!decision) {
      return res.status(404).json({
        status: "error",
        message: "Decision not found",
      });
    }

    const report =
      await generateFinalReport(
        decisionId
      );

    return res.status(200).json({
      status: "success",
      report,
    });
  } catch (error) {
    console.error(
      "Generate report error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message:
        "Failed to generate report",
    });
  }
}

/* ---------------- Get All Reports ---------------- */

async function getReportsController(req, res) {
  try {
    const userId = req.user.id;

    const reports =
      await getUserReports(userId);

    return res.status(200).json({
      status: "success",
      reports,
    });
  } catch (error) {
    console.error(
      "Get reports error:",
      error
    );

    return res.status(500).json({
      status: "error",
      message:
        "Failed to fetch reports",
    });
  }
}

/* ---------------- Exports ---------------- */

module.exports = {
  createDecisionController,
  getDecisionsController,
  getDecisionController,
  generateAnalysesController,
  generateReportController,
  getReportsController,
};