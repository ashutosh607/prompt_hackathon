const { execFile } = require("child_process");
const path = require("path");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5002";
const PYTHON_SCRIPT_PATH = path.resolve(__dirname, "../../ml/predict_service.py");

/**
 * Predicts the student's next pedagogical action and suitability
 * using the existing Random Forest model (edtech_random_forest_model.pkl).
 */
async function predictLearningAction(profile = {}, topic = "Linear Regression") {
  // Map learner profile to the model's exact 18 feature schema
  const featurePayload = {
    topic: topic || profile.topic || "Linear Regression",
    field_of_interest: profile.domain || "Machine Learning",
    prior_experience: profile.level || "Beginner",
    preferred_content: profile.style === "Visual" ? "Video" : "Article",
    learning_style: profile.style || "Visual",
    difficulty_preference: profile.level || "Beginner",
    quiz_score: Number(profile.stats?.accuracy) || 68.0,
    concept_score: Number(profile.conceptScore) || 62.0,
    practical_score: Number(profile.practicalScore) || 55.0,
    confidence: Number(profile.confidence) || 72.0,
    hours_per_week: Number(profile.hoursPerWeek) || 6.0,
    completion_rate: Number(profile.stats?.completedQuests ? profile.stats.completedQuests * 20 : 45.0),
    avg_session_minutes: Number(profile.avgSessionMinutes) || 25.0,
    quiz_attempts: Number(profile.quizAttempts) || 2,
    needs_revision: profile.needsRevision ? 1 : 0,
    topic_prerequisite_score: 70.0,
    interest_score: 85.0,
    knowledge_gap: Math.max(10, 100 - (Number(profile.confidence) || 72)),
  };

  // 1. Try fast HTTP microservice
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(featurePayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        source: "ml_model_live",
        ...data,
      };
    }
  } catch (httpErr) {
    // HTTP service unavailable or timed out, fallback to CLI execution
  }

  // 2. Direct Python CLI execution fallback
  return new Promise((resolve) => {
    const jsonArg = JSON.stringify(featurePayload);
    execFile(
      "python",
      [PYTHON_SCRIPT_PATH, "--json", jsonArg],
      { timeout: 5000 },
      (error, stdout, stderr) => {
        if (!error && stdout) {
          try {
            // Find JSON output in stdout (ignoring warning lines)
            const lines = stdout.trim().split("\n");
            const lastJsonLine = lines.filter((l) => l.trim().startsWith("{")).pop();
            if (lastJsonLine) {
              const parsed = JSON.parse(lastJsonLine);
              return resolve({
                source: "ml_model_cli",
                ...parsed,
              });
            }
          } catch (parseErr) {
            console.warn("[ML Service] Fallback parse error:", parseErr);
          }
        }

        // 3. Fallback safe calculation if Python is not reachable
        resolve({
          source: "ml_fallback_heuristic",
          success: true,
          predicted_action: "Build Concept",
          confidence: 0.65,
          probabilities: { "Build Concept": 0.65, "Learn Fundamentals": 0.2, "Practice": 0.15 },
          guidance: "Focus on visual intuition and graphical slope interpretation.",
        });
      }
    );
  });
}

module.exports = {
  predictLearningAction,
};
