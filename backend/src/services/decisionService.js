const pool = require("../config/database");

async function createDecision(
  userId,
  title,
  problem,
  context
) {
  const result = await pool.query(
    `
    INSERT INTO decisions (
      user_id,
      title,
      problem,
      context
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      user_id,
      title,
      problem,
      context,
      status,
      created_at
    `,
    [
      userId,
      title,
      problem,
      context || null,
    ]
  );

  return result.rows[0];
}

async function getUserDecisions(userId) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      problem,
      context,
      status,
      created_at,
      updated_at
    FROM decisions
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

async function getUserReportCount(userId) {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM decision_reports dr
    JOIN decisions d
      ON dr.decision_id = d.id
    WHERE d.user_id = $1
    `,
    [userId]
  );

  return Number(result.rows[0].count);
}

async function getUserAverageConfidence(userId) {
  const result = await pool.query(
    `
    SELECT
      COALESCE(
        AVG(da.confidence),
        0
      ) AS average_confidence
    FROM decision_analyses da
    JOIN decisions d
      ON da.decision_id = d.id
    WHERE d.user_id = $1
    `
  ,
    [userId]
  );

  return Number(
    Number(
      result.rows[0].average_confidence
    ).toFixed(2)
  );
}

async function getUserAnalysisCount(userId) {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM decision_analyses da
    JOIN decisions d
      ON da.decision_id = d.id
    WHERE d.user_id = $1
    `,
    [userId]
  );

  return Number(result.rows[0].count);
}

async function getUserDecisionStats(userId) {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total,

      COUNT(*) FILTER (
        WHERE status = 'completed'
      ) AS completed,

      COUNT(*) FILTER (
        WHERE status = 'processing'
      ) AS processing,

      COUNT(*) FILTER (
        WHERE status = 'pending'
      ) AS pending,

      COUNT(*) FILTER (
        WHERE status = 'failed'
      ) AS failed

    FROM decisions
    WHERE user_id = $1
    `,
    [userId]
  );

  return {
    total: Number(result.rows[0].total),
    completed: Number(
      result.rows[0].completed
    ),
    processing: Number(
      result.rows[0].processing
    ),
    pending: Number(
      result.rows[0].pending
    ),
    failed: Number(
      result.rows[0].failed
    ),
  };
}

async function getDecisionById(
  decisionId,
  userId
) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      problem,
      context,
      status,
      created_at,
      updated_at
    FROM decisions
    WHERE id = $1
      AND user_id = $2
    `,
    [decisionId, userId]
  );

  return result.rows[0];
}

async function updateDecisionStatus(
  decisionId,
  status
) {
  const result = await pool.query(
    `
    UPDATE decisions
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING
      id,
      status,
      updated_at
    `,
    [status, decisionId]
  );

  return result.rows[0];
}

module.exports = {
  createDecision,
  getUserDecisions,
  getUserReportCount,
  getUserAverageConfidence,
  getUserAnalysisCount,
  getUserDecisionStats,
  getDecisionById,
  updateDecisionStatus,
};