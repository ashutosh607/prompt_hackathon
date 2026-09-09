import { useState } from "react";
import { X, Play, FileText, CheckCircle2, ChevronRight, Sparkles, Award } from "lucide-react";
import { Button } from "./ui/button";
import StudyMatchAITutor from "./StudyMatchAITutor";

export default function ResourceViewerModal({
  isOpen,
  onClose,
  initialStep = 0,
  onStepComplete,
  topic = "Linear Regression",
  learnerProfile = {},
  onDoubtEscalated,
  onOpenPricing,
  onOpenTeacherSession,
}) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Linear Regression Explained Visually",
      subtitle: "Watch • Visual Intuition",
      type: "video",
      duration: "18 min",
      content: (
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg relative group border border-[#D5E5D4]">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/nk2CQITm_eo?autoplay=1"
              title="Linear Regression Explained Visually"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-[#F6FAF4] p-4 rounded-2xl border border-[#DFEDE0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#204930]">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Key Intuition Highlights:
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-stone-800">Slope ($m$)</strong>: How much $Y$ changes for every 1 unit increase in $X$.
              </li>
              <li>
                <strong className="text-stone-800">Residual ($e$)</strong>: The vertical distance between actual data points and the line.
              </li>
              <li>
                <strong className="text-stone-800">Ordinary Least Squares</strong>: Finds the line that minimizes the sum of squared vertical errors.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Quick Regression Notes",
      subtitle: "Review • Concept Formula Reference",
      type: "notes",
      duration: "10 min",
      content: (
        <div className="space-y-4 text-xs text-stone-700">
          <div className="p-5 bg-white border border-[#E3EBE0] rounded-2xl shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-[#1B3828]">The Fundamental Equation</h4>
            <div className="p-3 bg-[#F3F7F2] font-mono text-center text-sm font-bold text-[#234A34] rounded-xl border border-[#DDE7DC]">
              ŷ = mx + b (or y = β₀ + β₁x + ε)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Slope (m):</span>
                <span>Measures the rate of change or steepness. Positive slope = upward trend; Negative = downward.</span>
              </div>
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">Y-Intercept (b):</span>
                <span>The expected value of Y when X is zero. The point where line crosses vertical axis.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "5 Guided Concept Problems",
      subtitle: "Practice • Interactive Step-by-Step",
      type: "practice",
      duration: "20 min",
      content: (
        <div className="space-y-4">
          <div className="p-5 bg-white border border-[#E3EBE0] rounded-2xl shadow-sm space-y-4">
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Problem 1 of 5</div>
            <p className="text-sm font-medium text-stone-900">
              If a study time vs test score model has slope <span className="font-mono font-bold text-emerald-700">m = +4.5</span>, what happens to the predicted test score if study time increases by 2 hours?
            </p>
            <div className="space-y-2 text-xs">
              {[
                { id: "A", text: "Increases by 4.5 points", correct: false },
                { id: "B", text: "Increases by 9.0 points (4.5 × 2)", correct: true },
                { id: "C", text: "Decreases by 4.5 points", correct: false },
                { id: "D", text: "Stays unchanged", correct: false },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQuizAnswer(opt.id);
                    setQuizSubmitted(true);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                    quizAnswer === opt.id
                      ? opt.correct
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                        : "bg-red-50 border-red-400 text-red-800"
                      : "bg-[#FBFDFB] border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span>
                    {opt.id}. {opt.text}
                  </span>
                  {quizAnswer === opt.id && (
                    <span>{opt.correct ? "✓ Correct!" : "✗ Try again"}</span>
                  )}
                </button>
              ))}
            </div>
            {quizSubmitted && quizAnswer === "B" && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                🎯 Excellent! Since slope is rate of change per 1 unit, 2 units change yields 2 × 4.5 = 9.0 points.
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Mini Concept Check Complete",
      subtitle: "Milestone • Knowledge Gain Unlocked",
      type: "check",
      duration: "5 min",
      content: (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-[#1B3828]">Quest Milestones Unlocked!</h4>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            You successfully strengthened your slope intuition and completed the first learning cycle for Linear Regression.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> +18% Predicted Knowledge Gain Earned
          </div>
        </div>
      ),
    },
  ];

  const current = steps[activeStep] || steps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-6xl w-[96vw] h-[92vh] bg-[#FDFEFC] border border-[#E5ECE3] rounded-3xl shadow-2xl overflow-hidden text-[#1B3828] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E5ECE3] bg-white/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF3E8] border border-[#D2E4CE] text-[#204930]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {topic}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828] leading-tight">
                {current.title}
              </h3>
              <p className="text-[11px] text-stone-500">
                Step {activeStep + 1} of {steps.length} • {current.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Split View: Left (Learning Resource) + Right (StudyMatch AI Tutor) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT: Video / Notes / Practice Resource */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto bg-[#FAFCF9]">
            <div className="flex-1">{current.content}</div>

            {/* In-Resource Step Controls */}
            <div className="pt-4 mt-6 border-t border-[#E5ECE3] flex items-center justify-between shrink-0">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                ← Previous Step
              </button>

              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      idx === activeStep ? "bg-[#1B3828] scale-110" : "bg-stone-200"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={() => {
                  if (activeStep < steps.length - 1) {
                    setActiveStep((prev) => prev + 1);
                    if (onStepComplete) onStepComplete(activeStep);
                  } else {
                    onClose();
                  }
                }}
                className="bg-[#1B3828] hover:bg-[#132A1D] text-white rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
              >
                {activeStep === steps.length - 1 ? "Complete Quest ✓" : "Next Step →"}
              </Button>
            </div>
          </div>

          {/* RIGHT: StudyMatch AI Tutor Companion Sidebar */}
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 border-t lg:border-t-0 lg:border-l border-[#E2EBE0] flex flex-col h-[320px] lg:h-full bg-[#FAFBF9]">
            <StudyMatchAITutor
              topic={topic}
              resource={{
                title: current.title,
                type: current.type,
              }}
              learnerProfile={learnerProfile}
              onDoubtEscalated={onDoubtEscalated}
              onOpenPricing={onOpenPricing}
              onOpenTeacherSession={onOpenTeacherSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
