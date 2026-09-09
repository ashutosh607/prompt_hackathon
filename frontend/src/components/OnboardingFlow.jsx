import { useState } from "react";
import { DOMAINS } from "../data/curriculumData";
import {
  Brain,
  Code2,
  Check,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";

export default function OnboardingFlow({ onComplete, onBackToLanding }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [studyLevel, setStudyLevel] = useState("Undergraduate");
  const [goal, setGoal] = useState("Build Projects");
  const [domain, setDomain] = useState("ml");
  const [selectedTopic, setSelectedTopic] = useState("Linear Regression");
  const [selfLevel, setSelfLevel] = useState("Intermediate");
  const [confidenceSlider, setConfidenceSlider] = useState(65);
  const [preferences, setPreferences] = useState([
    "Videos",
    "Visual Explanations",
    "Interactive Examples",
    "Coding Practice",
  ]);
  const [explanationStyle, setExplanationStyle] = useState("Visual diagrams");
  const [dailyTime, setDailyTime] = useState("30–60 minutes");
  const [preferredDifficulty, setPreferredDifficulty] = useState("Moderate — Balanced learning");

  const studyLevelOptions = [
    "School",
    "Diploma",
    "Undergraduate",
    "Postgraduate",
    "Self-learning",
    "Other",
  ];

  const goalOptions = [
    "Exam Preparation",
    "Understand Concepts",
    "Build Projects",
    "Placement / Interview Preparation",
    "Explore the Subject",
    "Complete Assignments",
  ];

  const familiarityOptions = [
    { label: "Beginner", desc: "I'm completely new", defaultConfidence: 20 },
    { label: "Basic", desc: "I know the fundamentals", defaultConfidence: 45 },
    { label: "Intermediate", desc: "I understand the core concepts", defaultConfidence: 65 },
    { label: "Advanced", desc: "I can apply it independently", defaultConfidence: 90 },
  ];

  const formatOptions = [
    "Videos",
    "Notes / Articles",
    "Visual Explanations",
    "Interactive Examples",
    "Coding Practice",
    "Projects",
  ];

  const explanationOptions = [
    "Simple explanations",
    "Step-by-step explanations",
    "Real-world examples",
    "Code-first",
    "Visual diagrams",
    "Theory + examples",
  ];

  const timeOptions = [
    "Less than 15 minutes",
    "15–30 minutes",
    "30–60 minutes",
    "1–2 hours",
    "2+ hours",
  ];

  const difficultyOptions = [
    { label: "Easy", desc: "Build my fundamentals" },
    { label: "Moderate", desc: "Balanced learning" },
    { label: "Challenging", desc: "Push my limits" },
  ];

  const togglePreference = (pref) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Completed onboarding -> proceed to diagnostic quiz intro
      onComplete({
        studyLevel,
        goal,
        domain: domain === "ml" ? "Machine Learning" : "Web Development",
        topic: selectedTopic,
        selfLevel,
        confidenceSlider,
        preferences,
        explanationStyle,
        dailyStudyTime: dailyTime,
        preferredDifficulty,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] font-sans flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header with Progress */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep((prev) => prev - 1);
              else if (onBackToLanding) onBackToLanding();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentStep === 1 ? "Back to Home" : "Previous Step"}
          </button>

          <span className="text-xs font-mono font-bold text-stone-400">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#E6ECE3] rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-[#1B3828] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF3E8] text-[#245435] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Step {currentStep} of 5
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#162F22] tracking-tight">
            Let's personalize your learning
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Tell us a little about yourself so we can build a learning path that actually fits you.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: Academic Profile */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-7 animate-in fade-in">
            {/* Question 1: What are you currently studying? */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                What are you currently studying?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {studyLevelOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStudyLevel(opt)}
                    className={`py-2.5 px-3.5 rounded-2xl text-xs font-medium border transition cursor-pointer text-left ${
                      studyLevel === opt
                        ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold ring-1 ring-[#2C573C]"
                        : "bg-[#FAFBF9] border-[#E5EDE3] hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Primary Goal */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                What is your primary goal?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goalOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGoal(opt)}
                    className={`py-3 px-4 rounded-2xl text-xs font-medium border transition cursor-pointer flex items-center justify-between ${
                      goal === opt
                        ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold ring-1 ring-[#2C573C]"
                        : "bg-[#FAFBF9] border-[#E5EDE3] hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    <span>{opt}</span>
                    {goal === opt && <Check className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Choose Your Learning Domain & Topic */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Machine Learning */}
              <div
                onClick={() => {
                  setDomain("ml");
                  setSelectedTopic("Linear Regression");
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  domain === "ml"
                    ? "bg-white border-[#2C573C] ring-2 ring-[#2C573C]/20 shadow-md"
                    : "bg-white/80 border-[#E3ECE0] hover:border-stone-400"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3E8] text-[#245435] flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    AI & Predictive Models
                  </span>
                  <h4 className="text-lg font-bold text-[#1B3828]">Machine Learning</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Master algorithms, neural networks, data transformations, and mathematical modeling.
                  </p>
                </div>
              </div>

              {/* Card 2: Web Development */}
              <div
                onClick={() => {
                  setDomain("webdev");
                  setSelectedTopic("React");
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                  domain === "webdev"
                    ? "bg-white border-[#2C573C] ring-2 ring-[#2C573C]/20 shadow-md"
                    : "bg-white/80 border-[#E3ECE0] hover:border-stone-400"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3E8] text-[#245435] flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Full Stack Engineering
                  </span>
                  <h4 className="text-lg font-bold text-[#1B3828]">Web Development</h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Build responsive frontend applications, backend REST APIs, and database architecture.
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Topics List for Selected Domain */}
            <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
                Select Your Focus Topic in {DOMAINS[domain].title}
              </span>
              <div className="flex flex-wrap gap-2">
                {DOMAINS[domain].topics.map((top) => (
                  <button
                    key={top}
                    onClick={() => setSelectedTopic(top)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      selectedTopic === top
                        ? "bg-[#1B3828] text-white shadow-sm font-semibold"
                        : "bg-[#F3F7F2] text-stone-700 hover:bg-[#EAF2E8]"
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Current Knowledge (Self-Assessment) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Topic: {selectedTopic}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#1B3828] mt-1">
                How familiar are you with this topic?
              </h3>
            </div>

            <div className="space-y-3">
              {familiarityOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setSelfLevel(opt.label);
                    setConfidenceSlider(opt.defaultConfidence);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                    selfLevel === opt.label
                      ? "bg-[#EAF3E8] border-[#2C573C] ring-1 ring-[#2C573C] shadow-sm"
                      : "bg-[#FAFBF9] border-[#E3ECE0] hover:border-stone-400"
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold text-[#1B3828] block">{opt.label}</span>
                    <span className="text-xs text-stone-500">{opt.desc}</span>
                  </div>
                  {selfLevel === opt.label && <Check className="w-5 h-5 text-emerald-700" />}
                </button>
              ))}
            </div>

            {/* Visual Confidence Slider */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>Self-Perceived Confidence</span>
                <span className="text-[#1B3828] font-bold font-mono">{confidenceSlider}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={confidenceSlider}
                onChange={(e) => setConfidenceSlider(Number(e.target.value))}
                className="w-full accent-[#1B3828] cursor-pointer"
              />
            </div>

            {/* Prominent Disclaimer (Prompt Requirement) */}
            <div className="p-4 bg-[#F5F8F3] rounded-2xl border border-[#DFEAE0] flex items-start gap-3 text-xs text-stone-600">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-stone-800">Don't worry about getting this perfect.</strong>{" "}
                We'll verify your level with a short diagnostic quiz right after this.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Learning Preferences */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-7 animate-in fade-in">
            {/* Multi-select formats */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                  How do you learn best?
                </h3>
                <span className="text-xs text-stone-400">Select all formats you enjoy</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {formatOptions.map((fmt) => {
                  const isChecked = preferences.includes(fmt);
                  return (
                    <button
                      key={fmt}
                      onClick={() => togglePreference(fmt)}
                      className={`p-3 rounded-2xl text-xs font-medium border text-left transition cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold"
                          : "bg-[#FAFBF9] border-[#E3ECE0] hover:border-stone-400 text-stone-700"
                      }`}
                    >
                      <span>{fmt}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation preference */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                What type of explanation helps you most?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {explanationOptions.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setExplanationStyle(exp)}
                    className={`py-3 px-4 rounded-2xl text-xs font-medium border text-left transition cursor-pointer flex items-center justify-between ${
                      explanationStyle === exp
                        ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold ring-1 ring-[#2C573C]"
                        : "bg-[#FAFBF9] border-[#E3ECE0] hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    <span>{exp}</span>
                    {explanationStyle === exp && <Check className="w-4 h-4 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: Study Availability & Difficulty */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-7 animate-in fade-in">
            {/* Daily Study Time */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                How much time can you spend learning each day?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDailyTime(t)}
                    className={`p-3 rounded-2xl text-xs font-medium border text-left transition cursor-pointer flex items-center justify-between ${
                      dailyTime === t
                        ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] font-semibold ring-1 ring-[#2C573C]"
                        : "bg-[#FAFBF9] border-[#E3ECE0] hover:border-stone-400 text-stone-700"
                    }`}
                  >
                    <span>{t}</span>
                    {dailyTime === t && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Difficulty */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1B3828]">
                What difficulty would you prefer?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {difficultyOptions.map((diff) => {
                  const isSelected = preferredDifficulty.startsWith(diff.label);
                  return (
                    <button
                      key={diff.label}
                      onClick={() => setPreferredDifficulty(`${diff.label} — ${diff.desc}`)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-[#EAF3E8] border-[#2C573C] ring-1 ring-[#2C573C]"
                          : "bg-[#FAFBF9] border-[#E3ECE0] hover:border-stone-400"
                      }`}
                    >
                      <span className="text-xs font-bold text-[#1B3828] block">{diff.label}</span>
                      <span className="text-[11px] text-stone-500 block leading-tight">{diff.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="flex justify-end pt-8">
          <Button
            onClick={handleNext}
            className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            {currentStep === 5 ? "Build My Learning Profile" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer reassurance */}
      <footer className="text-center py-4 text-xs text-stone-400">
        Personalized AI Engine • StudyMatch
      </footer>
    </div>
  );
}
