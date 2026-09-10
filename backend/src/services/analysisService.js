const pool = require("../config/database");
const { generateAnalysis } = require("./aiService");

async function generateDecisionAnalyses(decisionId) {
  const decisionResult = await pool.query(
    `SELECT id, title, problem, context, status
     FROM decisions
     WHERE id = $1`,
    [decisionId]
  );

  if (decisionResult.rows.length === 0) {
    throw new Error("Decision not found");
  }

  const decision = decisionResult.rows[0];

  const agentsResult = await pool.query(
    `SELECT id, name, role, personality, system_prompt
     FROM ai_agents
     WHERE is_active = TRUE
     ORDER BY id`
  );

  const analyses = [];

  for (const agent of agentsResult.rows) {

    // Check whether this agent has already analyzed this decision
    const existingAnalysis = await pool.query(
      `SELECT id, decision_id, agent_id, analysis,
              recommendation, confidence, created_at
       FROM decision_analyses
       WHERE decision_id = $1 AND agent_id = $2`,
      [decisionId, agent.id]
    );

    if (existingAnalysis.rows.length > 0) {
      analyses.push(existingAnalysis.rows[0]);
      continue;
    }

    const aiResponse = await generateAnalysis(agent, decision);

    const result = await pool.query(
      `INSERT INTO decision_analyses
       (decision_id, agent_id, analysis, recommendation, confidence)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, decision_id, agent_id, analysis,
                 recommendation, confidence, created_at`,
      [
        decisionId,
        agent.id,
        aiResponse.analysis,
        aiResponse.recommendation,
        aiResponse.confidence,
      ]
    );

    analyses.push(result.rows[0]);
  }

  return analyses;
}
async function getDecisionAnalyses(decisionId) {
  const result = await pool.query(
    `SELECT
        da.id,
        da.decision_id,
        da.agent_id,
        a.name AS agent_name,
        a.role AS agent_role,
        da.analysis,
        da.recommendation,
        da.confidence,
        da.created_at
     FROM decision_analyses da
     JOIN ai_agents a ON da.agent_id = a.id
     WHERE da.decision_id = $1
     ORDER BY da.agent_id`,
    [decisionId]
  );

  return result.rows;
}
module.exports = {
  generateDecisionAnalyses,
  getDecisionAnalyses,
};