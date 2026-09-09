const express = require("express");
const router = express.Router();
const {
  checkHealth,
  getTopics,
  getSkillMap,
  getDiagnosticQuestions,
  evaluateDiagnostic,
  getMatchingResources,
  saveQuest,
} = require("../controllers/supabaseController");

const {
  askDoubt,
  getPendingDoubts,
  respondToDoubt,
} = require("../controllers/doubtController");

// Health check
router.get("/health", checkHealth);

// StudyMatch Topic and Skill Map APIs
router.get("/topics", getTopics);
router.get("/topics/:topic/skillmap", getSkillMap);

// Diagnostic Questions & Scoring
router.get("/diagnostics/:topic", getDiagnosticQuestions);
router.post("/diagnostics/evaluate", evaluateDiagnostic);

// Personalized Resource Discovery & Quest Paths
router.get("/resources/match/:topic", getMatchingResources);
router.post("/quests/save", saveQuest);

// StudyMatch AI Chatbot & Teacher Escalation APIs
router.post("/doubts/ask", askDoubt);
router.get("/doubts/pending", getPendingDoubts);
router.post("/doubts/:id/respond", respondToDoubt);

module.exports = router;
