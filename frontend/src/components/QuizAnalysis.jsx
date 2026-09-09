import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Compass,
} from "lucide-react";
import { Button } from "./ui/button";

export default function QuizAnalysis({ profile, quizResults, onContinueToDashboard }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const overall = quizResults?.overallScore || 72;
  const skillScores = quizResults?.skillScores || {
    fundamentals: 85,
    concepts: 75,
    problemSolving: 62,
    implementation: 45,
    advanced: 30,
  };

  const learningGaps = quizResults?.learningGaps || {
    strong: ["Basic Linear Regression", "Understanding variables", "Regression intuition"],
    needsPractice: ["Model implementation", "Error metrics", "Advanced regression concepts"],
  };

  const selfLevel = profile?.selfLevel || "Intermediate";

  // Number animation on mount
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= overall) {
        setAnimatedScore(overall);
        clearInterval(interval);
      } else {
        setAnimatedScore(start);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [overall]);

  const skillBars = [
    { label: "Fundamentals", score: skillScores.fundamentals, color: "bg-emerald-600" },
    { label: "Concepts", score: skillScores.concepts, color: "bg-emerald-500" },
    { label: "Problem Solving", score: skillScores.problemSolving, color: "bg-teal-600" },
    { label: "Implementation", score: skillScores.implementation, color: "bg-amber-500" },
    { label: "Advanced", score: skillScores.advanced, color: "bg-stone-400" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] font-sans flex flex-col justify-between p-4 sm:p-8">
      <main className="max-w-3xl mx-auto w-full space-y-8 my-auto py-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E8] text-[#245435] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnostic Analysis Complete
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#162F22] tracking-tight">
            We've mapped your learning profile.
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
            Based on your responses, we've identified where your foundation is solid and precisely where practical resources will boost you most.
          </p>
        </div>

        {/* Section 5: Overall Score & Skill Breakdown Card */}
        <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Overall Score Circle (Left) */}
          <div className="md:col-span-4 text-center md:border-r border-[#EEF3EC] md:pr-6 space-y-2">
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-[#EAF3E8] to-white border-4 border-[#CBE0C7] flex flex-col items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-[#1B3828] font-mono leading-none">
                {animatedScore}%
              </span>
              <span className="text-[11px] font-semibold text-stone-500 mt-1">
                Understanding
              </span>
            </div>
            <div className="text-xs font-semibold text-emerald-800">
              Proficiency Benchmark
            </div>
          </div>

          {/* Skill Breakdown Bars (Right) */}
          <div className="md:col-span-8 space-y-3.5">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Skill Category Breakdown
            </span>
            {skillBars.map((skill) => (
              <div key={skill.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>{skill.label}</span>
                  <span className="font-mono font-bold">{skill.score}%</span>
                </div>
                <div className="w-full h-2 bg-[#EEF3EC] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Learning Gaps (Strong vs Needs Practice) */}
        <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#1B3828] flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-700" />
            Your Learning Gaps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strong */}
            <div className="p-4 bg-[#F5FAF3] rounded-2xl border border-[#DFEDE0] space-y-2.5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Strong Competencies
              </span>
              <ul className="space-y-2 text-xs text-stone-700">
                {learningGaps.strong.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs Practice */}
            <div className="p-4 bg-[#FFFBF2] rounded-2xl border border-[#F6E9CF] space-y-2.5">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Needs Practice & Focus
              </span>
              <ul className="space-y-2 text-xs text-stone-700">
                {learningGaps.needsPractice.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 7: Final Personalized Level Comparison */}
        <div className="bg-gradient-to-r from-[#F4F8F3] to-[#EEF5EC] rounded-3xl border border-[#D5E5D1] p-6 sm:p-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xl/5">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                You Selected
              </span>
              <span className="text-sm font-bold text-[#1B3828] uppercase mt-0.5 block">
                {selfLevel}
              </span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xl/5">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Our Assessment
              </span>
              <span className="text-sm font-bold text-emerald-800 uppercase mt-0.5 block">
                {selfLevel} with strong fundamentals
              </span>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xl/5">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Recommended Focus
              </span>
              <span className="text-sm font-bold text-[#1B3828] uppercase mt-0.5 block">
                Intermediate → Practical
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Your self-assessment matched your conceptual score, but your implementation score (45%) shows you'll progress fastest with hands-on coding and visual walkthroughs rather than pure theory.
          </p>
        </div>

        {/* CTA to Dashboard */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onContinueToDashboard}
            className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            Enter My Personalized Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
