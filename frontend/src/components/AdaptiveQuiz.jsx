import { useState } from "react";
import { ADAPTIVE_QUESTIONS } from "../data/curriculumData";
import { calculateQuizResults } from "../lib/personalizationEngine";
import {
  Compass,
  Clock,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";

export default function AdaptiveQuiz({ profile, onComplete, onCancel }) {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentDifficulty, setCurrentDifficulty] = useState("Basic");

  const topicName = profile?.topic || "Linear Regression";
  const domainName = profile?.domain || "Machine Learning";

  // Pre-quiz briefing screen (Section 2)
  if (!started) {
    return (
      <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] font-sans flex flex-col justify-between p-6 sm:p-12">
        <div className="max-w-xl mx-auto w-full space-y-8 my-auto text-center">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-[#EAF3E8] border border-[#D5E5D1] flex items-center justify-center text-[#234A34] shadow-sm">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3E9] text-[#2C573C] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnostic Stage
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#162F22] tracking-tight">
              Let's understand what you already know.
            </h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              We'll ask a few questions and identify the concepts you already understand and the areas where you need help.
            </p>
          </div>

          {/* Diagnostic Info Card */}
          <div className="bg-white rounded-3xl border border-[#E3EBE0] p-6 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF3EC]">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Topic Selected
              </span>
              <span className="text-xs font-bold text-[#1B3828] bg-[#EAF3E8] px-3 py-1 rounded-full">
                {domainName} → {topicName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>10 adaptive questions</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>~5 minutes</span>
              </div>
            </div>

            <div className="p-3 bg-[#F6FAF4] rounded-2xl border border-[#E0EFE0] text-xs text-stone-600 flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Adaptive progression:</strong> Questions dynamically adjust from Basic to Advanced as you answer.
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <Button
              onClick={() => setStarted(true)}
              className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
            >
              Start Diagnostic
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <footer className="text-center text-xs text-stone-400">
          Adaptive Diagnostic System • StudyMatch
        </footer>
      </div>
    );
  }

  // Active Quiz Interface (Section 3 & 4)
  const currentQuestion = ADAPTIVE_QUESTIONS[currentIdx] || ADAPTIVE_QUESTIONS[0];
  const totalQuestions = ADAPTIVE_QUESTIONS.length;
  const isSelected = answers[currentQuestion.id] !== undefined;

  const handleSelectOption = (optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    // Adaptive difficulty adjustment preview
    const correctOpt = currentQuestion.options.find((opt) => opt.correct);
    if (correctOpt?.id === optionId) {
      if (currentDifficulty === "Basic") setCurrentDifficulty("Intermediate");
      else if (currentDifficulty === "Intermediate") setCurrentDifficulty("Advanced");
    } else {
      if (currentDifficulty === "Advanced") setCurrentDifficulty("Intermediate");
      else if (currentDifficulty === "Intermediate") setCurrentDifficulty("Basic");
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed all questions -> compute results
      const results = calculateQuizResults(ADAPTIVE_QUESTIONS, answers);
      onComplete(results);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] font-sans flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              {domainName}
            </span>
            <span className="text-sm font-bold text-[#1B3828]">{topicName}</span>
          </div>

          <span className="text-xs font-mono font-bold text-stone-500">
            Question {currentIdx + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#E6ECE3] rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-[#1B3828] transition-all duration-300 rounded-full"
            style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 bg-[#EAF3E8] px-3 py-1 rounded-full">
              Category: {currentQuestion.category}
            </span>
            <span className="text-xs font-medium text-stone-400">
              Difficulty:{" "}
              <strong
                className={
                  currentQuestion.tier === "Advanced"
                    ? "text-rose-600"
                    : currentQuestion.tier === "Intermediate"
                    ? "text-amber-600"
                    : "text-emerald-700"
                }
              >
                {currentQuestion.tier}
              </strong>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#162F22] leading-snug">
            {currentQuestion.question}
          </h3>

          {/* 4 Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const active = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold ring-1 ring-[#2C573C] shadow-sm"
                      : "bg-[#FAFBF9] border-[#E5EDE3] hover:border-stone-400 text-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        active
                          ? "bg-[#1B3828] text-white"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </div>
                  {active && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-8">
          <button
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <Button
            onClick={handleNext}
            disabled={!isSelected}
            className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-7 py-3 rounded-full font-semibold text-xs shadow-md disabled:opacity-40 transition cursor-pointer flex items-center gap-2"
          >
            {currentIdx === totalQuestions - 1 ? "Complete Diagnostic" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-stone-400">
        Adaptive Diagnostic Session • Distraction-free Mode
      </footer>
    </div>
  );
}
