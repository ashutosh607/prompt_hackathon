const { supabase, supabaseAdmin, testSupabaseConnection } = require("../config/supabase");

// Fallback seed data for instant offline/unmigrated compatibility
const MOCK_TOPICS = [
  { id: "linear-regression", title: "Linear Regression", category: "Machine Learning & Statistics", suggested: true },
  { id: "classification", title: "Classification", category: "Machine Learning", suggested: true },
  { id: "probability", title: "Probability", category: "Mathematics", suggested: true },
  { id: "matrices", title: "Matrices", category: "Linear Algebra", suggested: true },
];

const MOCK_SKILL_MAP = {
  "linear-regression": {
    topic: "Linear Regression",
    subtitle: "Let's find your starting point.",
    root: { id: "root", label: "Linear Regression", isRoot: true },
    nodes: [
      { id: "fundamentals", label: "Fundamentals", state: "unlocked", row: 1 },
      { id: "slope", label: "Slope", state: "active", highlighted: true, row: 1 },
      { id: "regression-line", label: "Regression Line", state: "locked", row: 1 },
      { id: "error", label: "Error", state: "locked", parent: "slope", row: 2 },
      { id: "practice", label: "Practice", state: "locked", parent: "slope", row: 2 },
    ],
  },
};

const MOCK_DIAGNOSTICS = {
  "linear-regression": [
    {
      id: "lr-q1",
      number: 1,
      total: 4,
      concept: "Slope Representation",
      question: "Do you understand what slope represents in a graph?",
      options: [
        { id: "opt1", label: "I can explain it", score: 3, icon: "check" },
        { id: "opt2", label: "I understand a little", score: 2, icon: "partial" },
        { id: "opt3", label: "Not really", score: 1, icon: "none" },
      ],
    },
    {
      id: "lr-q2",
      number: 2,
      total: 4,
      concept: "Line of Best Fit",
      question: "How comfortable are you with how a line of best fit minimizes errors?",
      options: [
        { id: "opt1", label: "I can explain residuals and MSE", score: 3, icon: "check" },
        { id: "opt2", label: "I understand the general idea", score: 2, icon: "partial" },
        { id: "opt3", label: "I get confused by the calculations", score: 1, icon: "none" },
      ],
    },
    {
      id: "lr-q3",
      number: 3,
      total: 4,
      concept: "Preferred Format",
      question: "What format helps you grasp tricky mathematical concepts fastest?",
      options: [
        { id: "opt1", label: "Visual animations & graphs", score: 3, icon: "check" },
        { id: "opt2", label: "Short concise reading notes", score: 2, icon: "partial" },
        { id: "opt3", label: "Step-by-step interactive practice", score: 3, icon: "check" },
      ],
    },
    {
      id: "lr-q4",
      number: 4,
      total: 4,
      concept: "Current Goal",
      question: "What is your immediate learning priority?",
      options: [
        { id: "opt1", label: "Build solid intuition before complex math", score: 3, icon: "check" },
        { id: "opt2", label: "Fast exam preparation / revision", score: 2, icon: "partial" },
        { id: "opt3", label: "Hands-on project application", score: 3, icon: "check" },
      ],
    },
  ],
};

const MOCK_RESOURCES = {
  "linear-regression": {
    featured: {
      id: "res-1",
      matchPercentage: 94,
      title: "Linear Regression Explained Visually",
      platform: "YouTube",
      duration: "18 min",
      difficulty: "Beginner",
      style: "Visual",
      thumbnail: "/linear-regression-thumb.jpg",
      videoUrl: "https://www.youtube.com/watch?v=nk2CQITm_eo",
      predictedGain: "+18% predicted learning gain",
      matchReasons: [
        "Builds slope intuition",
        "Visual explanation",
        "Beginner friendly",
        "Fits your available time",
      ],
    },
    additional: [
      {
        id: "res-2",
        type: "pdf",
        title: "Quick Regression Notes",
        meta: "PDF • 10 min",
        description: "Concise formula reference and geometric slope breakdown.",
      },
      {
        id: "res-3",
        type: "practice",
        title: "Practice: 5 Problems",
        meta: "Practice • 20 min",
        description: "Interactive questions with instant graphical explanations.",
      },
    ],
    skipped: [
      {
        id: "res-skipped-1",
        title: "Mathematical Derivation",
        reasons: ["High difficulty", "High reading load", "Useful later"],
      },
    ],
    questPath: [
      {
        stepNumber: "01",
        type: "WATCH",
        badgeColor: "emerald",
        title: "Linear Regression Visual Explanation",
        duration: "18 min",
        format: "video",
        url: "https://www.youtube.com/watch?v=nk2CQITm_eo",
      },
      {
        stepNumber: "02",
        type: "REVIEW",
        badgeColor: "slate",
        title: "Quick Regression Notes",
        duration: "10 min",
        format: "notes",
      },
      {
        stepNumber: "03",
        type: "PRACTICE",
        badgeColor: "slate",
        title: "5 guided problems",
        duration: "20 min",
        format: "interactive",
      },
      {
        stepNumber: "04",
        type: "CHECK",
        badgeColor: "amber",
        title: "Mini concept check",
        duration: "5 min",
        format: "quiz",
      },
    ],
    totalMinutes: 53,
  },
};

// Health Check
const checkHealth = async (req, res) => {
  try {
    const supabaseHealth = await testSupabaseConnection();
    return res.status(200).json({
      status: "online",
      serverTime: new Date().toISOString(),
      supabase: supabaseHealth,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
};

// Get list of topics
const getTopics = async (req, res) => {
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.from("topics").select("*");
    if (error || !data || data.length === 0) {
      return res.status(200).json({ success: true, topics: MOCK_TOPICS });
    }
    return res.status(200).json({ success: true, topics: data });
  } catch {
    return res.status(200).json({ success: true, topics: MOCK_TOPICS });
  }
};

// Get skill map for a topic
const getSkillMap = async (req, res) => {
  const topicId = (req.params.topic || "linear-regression").toLowerCase();
  const mapData = MOCK_SKILL_MAP[topicId] || MOCK_SKILL_MAP["linear-regression"];
  return res.status(200).json({ success: true, skillMap: mapData });
};

// Get diagnostic questions for topic
const getDiagnosticQuestions = async (req, res) => {
  const topicId = (req.params.topic || "linear-regression").toLowerCase();
  try {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from("diagnostic_questions")
      .select("*")
      .eq("topic_id", topicId)
      .order("question_order");

    if (error || !data || data.length === 0) {
      const questions = MOCK_DIAGNOSTICS[topicId] || MOCK_DIAGNOSTICS["linear-regression"];
      return res.status(200).json({ success: true, questions });
    }

    return res.status(200).json({ success: true, questions: data });
  } catch {
    const questions = MOCK_DIAGNOSTICS[topicId] || MOCK_DIAGNOSTICS["linear-regression"];
    return res.status(200).json({ success: true, questions });
  }
};

// Evaluate diagnostic answers and return personal focus
const evaluateDiagnostic = async (req, res) => {
  try {
    const { answers, topic = "linear-regression" } = req.body;

    // Calculate confidence score based on answers
    let totalScore = 0;
    let answeredCount = 0;

    if (answers && typeof answers === "object") {
      Object.values(answers).forEach((score) => {
        totalScore += Number(score) || 2;
        answeredCount += 1;
      });
    }

    // Baseline confidence around 70-85% for targeted demo
    const average = answeredCount > 0 ? totalScore / (answeredCount * 3) : 0.72;
    const confidenceScore = Math.min(Math.max(Math.round(average * 100), 55), 90);

    const evaluationResult = {
      focusArea: "Slope + Visual Intuition",
      confidence: confidenceScore || 72,
      recommendationNote: "You're not far away. Let's strengthen your slope intuition first.",
      highlightNode: "slope",
      recommendedNext: "View recommended resources",
    };

    return res.status(200).json({ success: true, evaluation: evaluationResult });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get personalized matching resources
const getMatchingResources = async (req, res) => {
  const topicId = (req.params.topic || "linear-regression").toLowerCase();
  const resourcesData = MOCK_RESOURCES[topicId] || MOCK_RESOURCES["linear-regression"];
  return res.status(200).json({ success: true, ...resourcesData });
};

// Save a student quest in Supabase
const saveQuest = async (req, res) => {
  try {
    const { userId, topicId = "linear-regression", focusArea, confidenceScore, steps } = req.body;
    const client = supabaseAdmin || supabase;

    const { data, error } = await client
      .from("student_quests")
      .insert([
        {
          user_id: userId || null,
          topic_id: topicId,
          focus_area: focusArea || "Slope + Visual Intuition",
          confidence_score: confidenceScore || 72,
          steps: steps || [],
        },
      ])
      .select();

    if (error) {
      // Return success with local mock id if table not yet run in DB
      return res.status(200).json({
        success: true,
        savedLocally: true,
        quest: { id: "local-quest-1", topicId, focusArea, confidenceScore },
      });
    }

    return res.status(201).json({ success: true, quest: data?.[0] });
  } catch (err) {
    return res.status(200).json({
      success: true,
      savedLocally: true,
      message: err.message,
    });
  }
};

module.exports = {
  checkHealth,
  getTopics,
  getSkillMap,
  getDiagnosticQuestions,
  evaluateDiagnostic,
  getMatchingResources,
  saveQuest,
};
