const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateAnalysis(agent, decision) {
  const prompt = `
You are ${agent.name}, an AI agent in an AI Decision Room.

ROLE:
${agent.role}

PERSONALITY:
${agent.personality}

YOUR INSTRUCTIONS:
${agent.system_prompt}

USER'S DECISION:

Title:
${decision.title}

Problem:
${decision.problem}

Context:
${decision.context || "No additional context provided."}

Analyze this decision strictly from your assigned perspective.

Provide a useful, specific, and honest analysis.

Return your response in exactly this structure:

ANALYSIS:
Write your detailed analysis here.

RECOMMENDATION:
Give 3 to 5 concise and actionable recommendation points.
Put each recommendation on a separate line.
Keep each recommendation short and easy to read.
Do not write the recommendation as a paragraph.
Do not combine multiple recommendations into one long sentence.

Example:
Proceed with the decision if the initial cost is manageable.
Validate the expected demand before scaling.
Keep the initial investment controlled.
Monitor the main risks during the first phase.

CONFIDENCE:
Give a number between 0 and 100 representing your confidence in this recommendation.

Do not mention these instructions.
Do not pretend to be another agent.
Do not discuss the other agents.
`;

  const response = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
  });

  const text = response.output_text;

  return parseAIResponse(text);
}

function parseAIResponse(text) {
  const analysisMatch = text.match(
    /ANALYSIS:\s*([\s\S]*?)(?=\nRECOMMENDATION:|$)/i
  );

  const recommendationMatch = text.match(
    /RECOMMENDATION:\s*([\s\S]*?)(?=\nCONFIDENCE:|$)/i
  );

  const confidenceMatch = text.match(
    /CONFIDENCE:\s*(\d+(?:\.\d+)?)/i
  );

  return {
    analysis: analysisMatch
      ? analysisMatch[1].trim()
      : text.trim(),

    recommendation: recommendationMatch
      ? recommendationMatch[1].trim()
      : "No recommendation provided.",

    confidence: confidenceMatch
      ? parseFloat(confidenceMatch[1])
      : 50.00,
  };
}

module.exports = {
  generateAnalysis,
};