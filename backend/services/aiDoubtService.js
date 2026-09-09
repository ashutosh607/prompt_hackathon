/**
 * AI Doubt Analysis Service:
 * Combines current learning resource context + student profile + ML model prediction
 * to evaluate whether the AI can confidently resolve the doubt or should escalate to a teacher.
 */

const CONFIDENCE_THRESHOLD = 0.70;

// Contextual knowledge base of the active resources (Linear Regression, etc.)
const TOPIC_CURRICULUM_CONTEXT = {
  "linear-regression": {
    topic: "Linear Regression",
    core_concepts: [
      "slope",
      "m",
      "rate of change",
      "intercept",
      "b",
      "residuals",
      "line of best fit",
      "ordinary least squares",
      "ols",
      "squared errors",
      "cost function",
      "mse",
      "negative slope",
      "positive slope",
      "scatter plot",
    ],
    explanations: {
      "negative_slope": {
        keywords: ["negative slope", "slope negative", "downward", "goes down", "slopes down"],
        response:
          "A negative slope means that as the independent variable ($X$) increases, the dependent variable ($Y$) decreases. In the context of this graph, there is an inverse relationship between the two features—every 1 unit step to the right causes the line to move downwards by the magnitude of $|m|$.",
        confidence: 0.94,
        reason: "Core geometric definition of negative slope is well-defined in the visual lesson.",
      },
      "ols_residuals": {
        keywords: ["least squares", "ols", "residuals", "error", "minimize", "how does it work"],
        response:
          "Ordinary Least Squares (OLS) calculates the vertical distance (residual) between every data point and the candidate line, squares each residual (to eliminate negative signs and penalize larger outliers), and finds the line parameters ($m$ and $b$) that produce the minimum total sum of squared errors.",
        confidence: 0.92,
        reason: "Core optimization principle of linear regression is directly covered in the resource highlights.",
      },
      "equation_meaning": {
        keywords: ["equation", "formula", "mx + b", "beta", "y =", "hat"],
        response:
          "In $\\hat{y} = mx + b$, $\\hat{y}$ is your predicted outcome, $m$ is the slope (the multiplier for each unit change in $x$), and $b$ is the y-intercept (where the line crosses the vertical axis when $x = 0$).",
        confidence: 0.95,
        reason: "Standard mathematical formula definition fully covered in the notes.",
      },
    },
    // Trigger criteria for questions that strictly require teacher intervention
    escalation_triggers: [
      {
        pattern: /when (this|that) point is removed|outlier removal|remove (the|a) point|leverage point/i,
        reason: "Evaluating the leverage and influence of a specific outlier on the regression slope requires human visual inspection of the dataset.",
        confidence: 0.41,
      },
      {
        pattern: /why is my (answer|result|calculation) different|why did i get|my answer is wrong/i,
        reason: "Student calculation discrepancies require direct human teacher step-by-step diagnostic review.",
        confidence: 0.38,
      },
      {
        pattern: /in my project|my assignment|my homework|my dataset/i,
        reason: "Student is asking about an external project outside the current resource scope.",
        confidence: 0.35,
      },
      {
        pattern: /can you prove|formal derivation of normal equations|derive matrix calculus/i,
        reason: "Advanced algebraic derivation exceeds the current beginner visual learning scope.",
        confidence: 0.48,
      },
    ],
  },
};

/**
 * Analyzes the student doubt in real time.
 */
async function analyzeDoubt({
  question,
  topic = "Linear Regression",
  resource = {},
  learnerProfile = {},
  mlPrediction = {},
  conversationHistory = [],
}) {
  const normalizedTopic = (topic || "linear-regression").toLowerCase().replace(/\s+/g, "-");
  const curriculum = TOPIC_CURRICULUM_CONTEXT[normalizedTopic] || TOPIC_CURRICULUM_CONTEXT["linear-regression"];
  const lowerQ = question.toLowerCase();

  // 1. Check if external LLM API is available (OpenAI / Gemini)
  if (process.env.OPENAI_API_KEY) {
    try {
      const llmResult = await callOpenAIEvaluator({
        question,
        curriculum,
        resource,
        learnerProfile,
        mlPrediction,
        conversationHistory,
      });
      if (llmResult) return llmResult;
    } catch (llmErr) {
      console.warn("[AI Doubt Service] External LLM error, falling back to embedded reasoning engine:", llmErr.message);
    }
  }

  // 2. Check for escalation triggers (outlier removal, personal calculation errors, etc.)
  for (const trigger of curriculum.escalation_triggers) {
    if (trigger.pattern.test(lowerQ)) {
      return {
        can_resolve: false,
        confidence: trigger.confidence,
        response: null,
        reason: trigger.reason,
        needs_teacher: true,
        ml_context: {
          predicted_action: mlPrediction.predicted_action || "Build Concept",
          confidence: mlPrediction.confidence || 0.65,
          guidance: mlPrediction.guidance || "Requires teacher personalization.",
        },
      };
    }
  }

  // 3. Check for specific matching core concept explanations
  for (const expKey of Object.keys(curriculum.explanations)) {
    const exp = curriculum.explanations[expKey];
    const matchesKeyword = exp.keywords.some((kw) => lowerQ.includes(kw));

    if (matchesKeyword) {
      // Enrich explanation with ML-informed context
      let enrichedResponse = exp.response;
      if (mlPrediction.predicted_action === "Build Concept") {
        enrichedResponse += `\n\n💡 *Tip for your learning path*: Based on your visual profile, picture the line as a balance beam—each point exerts torque proportional to its distance!`;
      }

      return {
        can_resolve: true,
        confidence: exp.confidence,
        response: enrichedResponse,
        reason: exp.reason,
        needs_teacher: false,
        ml_context: {
          predicted_action: mlPrediction.predicted_action || "Build Concept",
          confidence: mlPrediction.confidence || 0.72,
          guidance: mlPrediction.guidance || "Suited to your current level.",
        },
      };
    }
  }

  // 4. General topic relevance check
  const isRelevant = curriculum.core_concepts.some((concept) => lowerQ.includes(concept));

  if (isRelevant) {
    return {
      can_resolve: true,
      confidence: 0.82,
      response: `In ${topic}, this concept relates directly to how the model measures relationships between variables. When analyzing ${resource.title || "this resource"}, remember that the regression model attempts to capture the central trend while accounting for natural variance in your data points.`,
      reason: "The question addresses key curriculum vocabulary covered in this module.",
      needs_teacher: false,
      ml_context: {
        predicted_action: mlPrediction.predicted_action || "Build Concept",
        confidence: mlPrediction.confidence || 0.65,
        guidance: mlPrediction.guidance,
      },
    };
  }

  // 5. If question is completely outside or ambiguous, escalate to teacher safely
  return {
    can_resolve: false,
    confidence: 0.42,
    response: null,
    reason: "The student's question requires personalized teacher interpretation and context.",
    needs_teacher: true,
    ml_context: {
      predicted_action: mlPrediction.predicted_action || "Build Concept",
      confidence: mlPrediction.confidence || 0.55,
      guidance: mlPrediction.guidance,
    },
  };
}

/**
 * Optional OpenAI invocation with strict structured JSON output
 */
async function callOpenAIEvaluator({ question, curriculum, resource, learnerProfile, mlPrediction }) {
  const prompt = `You are the StudyMatch AI Tutor companion assisting a student who is actively watching/reading "${resource.title || "Linear Regression Explained Visually"}".
Student's question: "${question}"
Student Profile: ${JSON.stringify({
    level: learnerProfile.level || "Beginner",
    style: learnerProfile.style || "Visual",
    knowledge_gap: learnerProfile.confidence ? 100 - learnerProfile.confidence : 35,
  })}
ML Model Prediction: ${JSON.stringify(mlPrediction)}

Analyze whether you can answer this question with high confidence without hallucinating or if it needs teacher escalation (e.g. outlier removal, student specific calculations, subjective assignments).
Respond ONLY with a JSON object:
{
  "can_resolve": boolean,
  "confidence": number between 0 and 1,
  "response": string or null,
  "reason": string,
  "needs_teacher": boolean
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return {
      ...parsed,
      ml_context: {
        predicted_action: mlPrediction.predicted_action,
        confidence: mlPrediction.confidence,
        guidance: mlPrediction.guidance,
      },
    };
  }
  return null;
}

module.exports = {
  analyzeDoubt,
  CONFIDENCE_THRESHOLD,
};
