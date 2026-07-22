const asyncHandler = require("express-async-handler");
const { recommendation, chatbot } = require("../services/geminiService");

exports.getRecommendation = asyncHandler(async (req, res) => {
    const result = await recommendation(req.body);
    res.json({ success: true, recommendation: result });
});
exports.getSustainabilityScore = asyncHandler(async (req, res) => {
    const result = await recommendation({
        ...req.body,
        requestType: "sustainability-score-only",
    });
    res.json({
        success: true,
        ecoScore: result.ecoScore,
        explanation: result.explanation,
        disposalGuidance: result.disposalGuidance,
    });
});
exports.getCostEstimate = asyncHandler(async (req, res) => {
    const result = await recommendation({
        ...req.body,
        requestType: "cost-estimate-only",
    });
    res.json({
        success: true,
        bestMaterial: result.bestMaterial,
        estimatedCost: result.estimatedCost,
        alternatives: result.alternatives,
    });
});
exports.chat = asyncHandler(async (req, res) => {
    const answer = await chatbot(req.body.message, req.body.history);
    res.json({ success: true, answer });
});
