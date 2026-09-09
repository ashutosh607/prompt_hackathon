const { predictLearningAction } = require("../services/mlService");
const { analyzeDoubt } = require("../services/aiDoubtService");

// In-memory store for active doubts (with seed doubts for instant demonstration)
let activeDoubts = [
  {
    id: "doubt-seed-1",
    studentName: "Aarav Sharma",
    studentAvatar: "A",
    topic: "Linear Regression",
    resourceTitle: "Linear Regression Explained Visually",
    resourceType: "video",
    question: "Why does the slope change when this point is removed?",
    aiConfidence: 0.41,
    escalationReason: "Student's question requires personalized interpretation of leverage points.",
    status: "WAITING_FOR_TEACHER",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    mlContext: {
      predictedAction: "Build Concept",
      confidence: 0.72,
      knowledgeGap: 32,
      learningStyle: "Visual",
      guidance: "Emphasize visual intuition and graphical slope meaning.",
    },
    conversation: [
      { sender: "student", text: "Why does the slope change when this point is removed?", timestamp: "12m ago" },
      { sender: "ai", text: "I don't want to give you a misleading explanation. This one needs a teacher's attention.", isEscalationNotice: true, timestamp: "12m ago" },
    ],
    teacherResponse: null,
  },
];

/**
 * Handle student doubt submission from within the learning resource.
 */
const askDoubt = async (req, res) => {
  try {
    const {
      question,
      topic = "Linear Regression",
      resource = {},
      learnerProfile = {},
      conversationHistory = [],
      studentName = "Aarav",
      sessionId,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: "Question cannot be empty" });
    }

    // 1. Query existing ML model for learning action prediction
    const mlResult = await predictLearningAction(learnerProfile, topic);

    // 2. Run AI reasoning pipeline combining question, resource context, and ML output
    const decision = await analyzeDoubt({
      question,
      topic,
      resource,
      learnerProfile,
      mlPrediction: mlResult,
      conversationHistory,
    });

    let createdDoubt = null;

    // 3. If teacher intervention is necessary, escalate and notify via Socket.IO
    if (decision.needs_teacher) {
      createdDoubt = {
        id: `doubt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sessionId: sessionId || "default-session",
        studentName: learnerProfile.name || studentName || "Student",
        studentAvatar: (learnerProfile.name || studentName || "S").charAt(0).toUpperCase(),
        topic: topic || "Linear Regression",
        resourceTitle: resource.title || "Linear Regression Explained Visually",
        resourceType: resource.type || "video",
        question: question.trim(),
        aiConfidence: decision.confidence,
        escalationReason: decision.reason,
        status: "WAITING_FOR_TEACHER",
        timestamp: new Date().toISOString(),
        mlContext: {
          predictedAction: mlResult.predicted_action || "Build Concept",
          confidence: mlResult.confidence || 0.72,
          knowledgeGap: 100 - (learnerProfile.confidence || 72),
          learningStyle: learnerProfile.style || "Visual",
          guidance: mlResult.guidance,
        },
        conversation: [
          ...conversationHistory,
          { sender: "student", text: question.trim(), timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
          { sender: "ai", text: "I don't want to give you a misleading explanation. This one needs a teacher's attention.", isEscalationNotice: true, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ],
        teacherResponse: null,
      };

      activeDoubts.unshift(createdDoubt);

      // Emit real-time Socket.IO notification to Teacher room
      const io = req.app.get("io");
      if (io) {
        io.emit("doubt:escalated", createdDoubt);
        console.log(`[Socket.IO] Dispatched doubt:escalated for doubt ${createdDoubt.id}`);
      }
    }

    return res.status(200).json({
      success: true,
      analysis: decision,
      mlResult,
      doubt: createdDoubt,
    });
  } catch (error) {
    console.error("[Doubt Controller] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all pending/escalated doubts for the Teacher Dashboard.
 */
const getPendingDoubts = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      doubts: activeDoubts,
      count: activeDoubts.filter((d) => d.status === "WAITING_FOR_TEACHER").length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Teacher responds to an escalated student doubt.
 */
const respondToDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherMessage, teacherName = "Prof. Sharma" } = req.body;

    if (!teacherMessage || !teacherMessage.trim()) {
      return res.status(400).json({ success: false, message: "Response cannot be empty" });
    }

    const doubtIndex = activeDoubts.findIndex((d) => d.id === id);
    if (doubtIndex === -1) {
      return res.status(404).json({ success: false, message: "Doubt not found" });
    }

    const doubt = activeDoubts[doubtIndex];
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    doubt.status = "RESOLVED";
    doubt.teacherResponse = {
      message: teacherMessage.trim(),
      teacherName,
      timestamp,
    };

    doubt.conversation.push({
      sender: "teacher",
      teacherName,
      text: teacherMessage.trim(),
      timestamp,
    });

    // Emit real-time Socket.IO event to student's chatbot panel
    const io = req.app.get("io");
    if (io) {
      io.emit("teacher:response", {
        doubtId: doubt.id,
        sessionId: doubt.sessionId,
        teacherName,
        message: teacherMessage.trim(),
        timestamp,
        doubt,
      });
      console.log(`[Socket.IO] Dispatched teacher:response for doubt ${doubt.id}`);
    }

    return res.status(200).json({
      success: true,
      message: "Teacher response submitted and broadcasted.",
      doubt,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  askDoubt,
  getPendingDoubts,
  respondToDoubt,
};
