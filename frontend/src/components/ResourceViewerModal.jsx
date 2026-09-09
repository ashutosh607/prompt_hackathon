import { useState } from "react";
import { X, Play, FileText, CheckCircle2, ChevronRight, Sparkles, Award } from "lucide-react";
import { Button } from "./ui/button";

export default function ResourceViewerModal({ isOpen, onClose, initialStep = 0, onStepComplete }) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Watch: Linear Regression Visual Explanation",
      type: "video",
      duration: "18 min",
      content: (
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg relative group">
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
              <li><strong className="text-stone-800">Slope ($m$)</strong>: How much $Y$ changes for every 1 unit increase in $X$.</li>
              <li><strong className="text-stone-800">Residual ($e$)</strong>: The vertical distance between actual data points and the line.</li>
              <li><strong className="text-stone-800">Ordinary Least Squares</strong>: Finds the line that minimizes the sum of squared vertical errors.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Review: Quick Regression Notes",
      type: "notes",
      duration: "10 min",
      content: (
        <div className="space-y-4 text-xs text-stone-700">
          <div className="p-5 bg-white border border-[#E3EBE0] rounded-2xl shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-[#1B3828]">The Fundamental Equation</h4>
            <div className="p-3 bg-[#F3F7F2] font-mono text-center text-sm font-bold text-[#234A34] rounded-xl border border-[#DDE7DC]">
              ŷ = mx + b  (or  y = β₀ + β₁x + ε)
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
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
      title: "Practice: 5 Guided Concept Problems",
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
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    quizAnswer === opt.id
                      ? opt.correct
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                        : "bg-red-50 border-red-400 text-red-800"
                      : "bg-[#FBFDFB] border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span>{opt.id}. {opt.text}</span>
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
      title: "Check: Mini Concept Check Complete",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FDFEFC] border border-[#E5ECE3] rounded-3xl shadow-2xl overflow-hidden p-6 text-[#1B3828] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5ECE3]">
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Step {activeStep + 1} of {steps.length} • {current.duration}
            </span>
            <h3 className="text-lg font-bold text-[#1B3828]">{current.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 overflow-y-auto flex-1">{current.content}</div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-[#E5ECE3] flex items-center justify-between">
          <button
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:pointer-events-none"
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
    </div>
  );
}
