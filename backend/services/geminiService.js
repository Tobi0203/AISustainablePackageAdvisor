const { GoogleGenAI } = require("@google/genai");
const AppError = require("../utils/AppError");

const getClient = () => {
  if (!process.env.GEMINI_API_KEY)
    throw new AppError(
      "AI service is not configured. Add GEMINI_API_KEY to the server environment.",
      503,
    );
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const parseJson = (text) => {
  try {
    return JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
  } catch {
    throw new AppError(
      "The AI returned an invalid response. Please try again.",
      502,
    );
  }
};

const generateJson = async (prompt, schema) => {
  try {
    const response = await getClient().models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
        maxOutputTokens: 1400,
      },
    });
    if (!response.text)
      throw new AppError(
        "No AI response was generated. Please try again.",
        502,
      );
    return parseJson(response.text);
  } catch (error) {
    if (error.isOperational) throw error;
    console.error("Gemini request failed:", error.message);
    throw new AppError(
      "AI service is temporarily unavailable. Please try again shortly.",
      503,
    );
  }
};

const recommendationSchema = {
  type: "OBJECT",
  properties: {
    bestMaterial: { type: "STRING" },
    estimatedCost: {
      type: "OBJECT",
      properties: {
        low: { type: "NUMBER" },
        high: { type: "NUMBER" },
        currency: { type: "STRING" },
        basis: { type: "STRING" },
      },
      required: ["low", "high", "currency", "basis"],
    },
    ecoScore: { type: "INTEGER" },
    explanation: { type: "STRING" },
    disposalGuidance: { type: "STRING" },
    alternatives: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          material: { type: "STRING" },
          ecoScore: { type: "INTEGER" },
          estimatedCost: { type: "STRING" },
          tradeoff: { type: "STRING" },
        },
        required: ["material", "ecoScore", "estimatedCost", "tradeoff"],
      },
    },
  },
  required: [
    "bestMaterial",
    "estimatedCost",
    "ecoScore",
    "explanation",
    "alternatives",
  ],
};

const recommendation = (input) =>
  generateJson(
    `You are EcoPack AI, a sustainable-packaging decision-support expert. Provide conservative, non-binding estimates, never invent certifications or regulatory compliance, and state assumptions in the explanation. Recommend commercially plausible packaging only. Input: ${JSON.stringify(input)}. Return the requested JSON only.`,
    recommendationSchema,
  );

const chatbot = async (message, history = []) => {
  const cleanHistory = history
    .slice(-8)
    .map(
      (item) =>
        `${item.role === "user" ? "User" : "Assistant"}: ${String(item.content).slice(0, 1200)}`,
    )
    .join("\n");
  try {
    const response = await getClient().models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `You are EcoPack AI's concise packaging adviser. Answer only sustainable packaging questions. Be clear about uncertainty; do not provide legal compliance guarantees. Prior conversation:\n${cleanHistory}\n\nUser: ${message}`,
      config: { temperature: 0.35, maxOutputTokens: 700 },
    });
    if (!response.text)
      throw new AppError(
        "No AI response was generated. Please try again.",
        502,
      );
    return response.text.trim();
  } catch (error) {
    if (error.isOperational) throw error;
    console.error("Gemini chat failed:", error.message);
    throw new AppError(
      "AI chat is temporarily unavailable. Please try again shortly.",
      503,
    );
  }
};
module.exports = { recommendation, chatbot };
