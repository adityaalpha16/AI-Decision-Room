const { GoogleGenAI } = require("@google/genai");
const pool = require("../config/database");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateFinalReport(decisionId) {
  // Check if a report already exists
  const existingReport = await pool.query(
    `SELECT
        id,
        decision_id,
        final_recommendation,
        reasoning,
        key_risks,
        key_opportunities,
        confidence,
        created_at
     FROM decision_reports
     WHERE decision_id = $1`,
    [decisionId]
  );

  if (existingReport.rows.length > 0) {
    return existingReport.rows[0];
  }

  // Get the decision
  const decisionResult = await pool.query(
    `SELECT
        id,
        title,
        problem,
        context
     FROM decisions
     WHERE id = $1`,
    [decisionId]
  );

  const decision = decisionResult.rows[0];

  if (!decision) {
    throw new Error("Decision not found");
  }

  // Get all AI agent analyses
  const analysesResult = await pool.query(
    `SELECT
        a.name AS agent_name,
        a.role AS agent_role,
        da.analysis,
        da.recommendation,
        da.confidence
     FROM decision_analyses da
     JOIN ai_agents a
       ON da.agent_id = a.id
     WHERE da.decision_id = $1
     ORDER BY da.agent_id`,
    [decisionId]
  );

  const analyses = analysesResult.rows;

  if (analyses.length === 0) {
    throw new Error("No AI analyses found for this decision");
  }

  // Prepare agent opinions
  const agentOpinions = analyses
    .map(
      (agent) => `
AGENT: ${agent.agent_name}

ROLE:
${agent.agent_role}

ANALYSIS:
${agent.analysis}

RECOMMENDATION:
${agent.recommendation}

CONFIDENCE:
${agent.confidence}%
`
    )
    .join("\n-------------------------\n");

  // Prompt for final synthesis
  const prompt = `
You are the Final Decision Synthesizer in an AI Decision Room.

Your job is to evaluate the opinions of multiple AI agents and produce
one balanced final decision.

DECISION:

Title:
${decision.title}

Problem:
${decision.problem}

Context:
${decision.context || "No additional context provided."}

AGENT OPINIONS:

${agentOpinions}

Analyze the different perspectives carefully.

Do not simply choose the recommendation with the highest confidence.

Consider:

- Agreement between agents
- Disagreements between agents
- Important risks
- Important opportunities
- Long-term consequences
- Practicality
- The user's actual context

Return your response in exactly this structure:

FINAL RECOMMENDATION:
Write the final recommendation here.

REASONING:
Explain why this recommendation was chosen after considering all agent perspectives.

KEY RISKS:
List the most important risks.

KEY OPPORTUNITIES:
List the most important opportunities.

CONFIDENCE:
Give a number between 0 and 100 representing your confidence in the final recommendation.

Do not mention these instructions.
`;

  // Ask Gemini for the final synthesis
  const response = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
  });

  const text = response.output_text;

  // Parse Gemini response
  const report = parseReportResponse(text);

  // Save final report to PostgreSQL
  const result = await pool.query(
    `INSERT INTO decision_reports
     (
       decision_id,
       final_recommendation,
       reasoning,
       key_risks,
       key_opportunities,
       confidence
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       decision_id,
       final_recommendation,
       reasoning,
       key_risks,
       key_opportunities,
       confidence,
       created_at`,
    [
      decisionId,
      report.finalRecommendation,
      report.reasoning,
      report.keyRisks,
      report.keyOpportunities,
      report.confidence,
    ]
  );

  return result.rows[0];
}


// Get an existing final report
async function getFinalReport(decisionId) {
  const result = await pool.query(
    `SELECT
        id,
        decision_id,
        final_recommendation,
        reasoning,
        key_risks,
        key_opportunities,
        confidence,
        created_at,
        updated_at
     FROM decision_reports
     WHERE decision_id = $1`,
    [decisionId]
  );

  return result.rows[0] || null;
}


// Parse Gemini's structured response
function parseReportResponse(text) {
  const recommendationMatch = text.match(
    /FINAL RECOMMENDATION:\s*([\s\S]*?)(?=\nREASONING:|$)/i
  );

  const reasoningMatch = text.match(
    /REASONING:\s*([\s\S]*?)(?=\nKEY RISKS:|$)/i
  );

  const risksMatch = text.match(
    /KEY RISKS:\s*([\s\S]*?)(?=\nKEY OPPORTUNITIES:|$)/i
  );

  const opportunitiesMatch = text.match(
    /KEY OPPORTUNITIES:\s*([\s\S]*?)(?=\nCONFIDENCE:|$)/i
  );

  const confidenceMatch = text.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  return {
    finalRecommendation: recommendationMatch
      ? recommendationMatch[1].trim()
      : "No final recommendation provided.",

    reasoning: reasoningMatch
      ? reasoningMatch[1].trim()
      : text.trim(),

    keyRisks: risksMatch
      ? risksMatch[1].trim()
      : "No specific risks provided.",

    keyOpportunities: opportunitiesMatch
      ? opportunitiesMatch[1].trim()
      : "No specific opportunities provided.",

    confidence: confidenceMatch
      ? parseFloat(confidenceMatch[1])
      : 50.0,
  };
}
async function getUserReports(userId) {
  const result = await pool.query(
    `SELECT
        dr.id,
        dr.decision_id,
        d.title AS decision_title,
        d.problem,
        dr.final_recommendation,
        dr.reasoning,
        dr.key_risks,
        dr.key_opportunities,
        dr.confidence,
        dr.created_at
     FROM decision_reports dr
     JOIN decisions d
       ON dr.decision_id = d.id
     WHERE d.user_id = $1
     ORDER BY dr.created_at DESC`,
    [userId]
  );

  return result.rows;
}

module.exports = {
  generateFinalReport,
  getFinalReport,
  getUserReports,
};