import { useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  BookOpen,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Bookmark,
  Play,
  FileText,
  Code,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";

export default function OverviewTab({
  profile,
  resources,
  savedResourceIds,
  onToggleSaveResource,
  onStartResource,
  onOpenWhyThis,
}) {
  const studentName = profile?.name || "Student";
  const domainName = profile?.domain || "Machine Learning";

  const stats = [
    { label: "Overall Skill", value: `${profile?.stats?.overallSkill || 72}%`, icon: TrendingUp },
    { label: "Topics Done", value: profile?.stats?.topicsDone || "8 / 20", icon: BookOpen },
    { label: "Learning Time", value: profile?.stats?.learningHours || "12.5 hrs", icon: Clock },
    { label: "Current Streak", value: profile?.stats?.currentStreak || "7 days", icon: Flame },
  ];

  // Learning Roadmap Nodes (Section 10)
  const roadmapNodes = [
    { name: "Python", status: "completed" },
    { name: "NumPy", status: "completed" },
    { name: "Pandas", status: "completed" },
    { name: "Data Preprocessing", status: "completed" },
    { name: "Linear Regression", status: "current", progress: 72 },
    { name: "Logistic Regression", status: "locked" },
    { name: "Decision Trees", status: "locked" },
  ];

  // Sequenced Recommended Path (Section 13)
  const recommendedSteps = [
    { num: "01", label: "Fundamentals Review", status: "completed" },
    { num: "02", label: "Linear Regression Concepts", status: "completed" },
    { num: "03", label: "Linear Regression Implementation", status: "current" },
    { num: "04", label: "Model Evaluation & Loss", status: "upcoming" },
    { num: "05", label: "Housing Price Mini Project", status: "upcoming" },
    { num: "06", label: "Regularization & Advanced Regression", status: "upcoming" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 1. Greeting & Subtitle (Section 9) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#162F22] tracking-tight">
            Good evening, {studentName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Continue building your {domainName} skills based on your adaptive diagnostic.
          </p>
        </div>

        <Button
          onClick={() => onStartResource(resources[0])}
          className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          Continue Learning →
        </Button>
      </div>

      {/* 2. Four Stats Cards (Section 9) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#1B3828] font-mono mt-0.5 block">
                  {stat.value}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#EAF3E8] text-[#245435] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Section 19: "Why Personalized?" Visual Pipeline */}
      <div className="bg-gradient-to-r from-[#F3F8F2] via-[#EDF5EC] to-[#F3F8F2] rounded-3xl border border-[#D5E5D1] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E482D] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          The StudyMatch Personalization Engine
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 bg-white rounded-2xl border border-[#DCE8D9] shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block">01 PROFILE</span>
            <span className="font-bold text-stone-800 text-[11px]">Intermediate</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#DCE8D9] shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block">02 FOUNDATION</span>
            <span className="font-bold text-emerald-700 text-[11px]">85% Basics</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#DCE8D9] shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block">03 TARGET GAP</span>
            <span className="font-bold text-amber-700 text-[11px]">45% Coding</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#DCE8D9] shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block">04 FORMAT</span>
            <span className="font-bold text-stone-800 text-[11px]">Visual + Code</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-[#DCE8D9] shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block">05 TIME</span>
            <span className="font-bold text-stone-800 text-[11px]">30–60m / day</span>
          </div>

          <div className="p-3 bg-[#1B3828] text-white rounded-2xl shadow-sm">
            <span className="text-[10px] text-emerald-300 font-bold block">RESULT</span>
            <span className="font-bold text-[11px]">3 Curated Units</span>
          </div>
        </div>
      </div>

      {/* 4. Current Learning Path (Section 10) */}
      <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B3828]">Current Learning Path</h3>
            <p className="text-xs text-stone-500">Your structured roadmap through Machine Learning</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-[#EAF3E8] px-3 py-1 rounded-full">
            Active: Linear Regression
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-2 min-w-[640px] pt-1">
            {roadmapNodes.map((node, i) => (
              <div key={node.name} className="flex items-center gap-2">
                <div
                  className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition ${
                    node.status === "completed"
                      ? "bg-[#EAF3E8] text-[#245435] border border-[#CFE1CA]"
                      : node.status === "current"
                      ? "bg-[#1B3828] text-white ring-2 ring-[#2C573C] shadow-sm"
                      : "bg-[#F7F9F6] text-stone-400 border border-[#E5ECE3]"
                  }`}
                >
                  {node.status === "completed" && "✓ "}
                  {node.name}
                  {node.progress && ` (${node.progress}%)`}
                </div>
                {i < roadmapNodes.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recommended For You (Section 11) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#162F22]">Recommended For You</h3>
            <p className="text-xs text-stone-500">
              Only 3–5 high-signal resources matched specifically to your skill gaps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.slice(0, 4).map((res) => {
            const isSaved = savedResourceIds.includes(res.id);
            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-[#E3ECE0] p-5 shadow-sm hover:border-[#2C573C] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#245435] bg-[#EAF3E8] px-2.5 py-0.5 rounded-full border border-[#D1E4CD]">
                      {res.matchPercentage}% MATCH
                    </span>

                    <button
                      onClick={() => onToggleSaveResource(res.id)}
                      className={`p-1.5 rounded-full transition cursor-pointer ${
                        isSaved ? "text-emerald-700" : "text-stone-300 hover:text-stone-600"
                      }`}
                      title={isSaved ? "Saved" : "Save resource"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-emerald-700" : ""}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#162F22] leading-snug group-hover:text-emerald-900 transition">
                      {res.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                      {res.reasonSnippet}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                    <span>{res.type}</span>
                    <span>•</span>
                    <span>{res.duration}</span>
                    <span>•</span>
                    <span>{res.difficulty}</span>
                    <span>•</span>
                    <span className="text-stone-600">{res.source}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0F5EE] flex items-center justify-between">
                  <button
                    onClick={() => onOpenWhyThis(res)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Why this?
                  </button>

                  <Button
                    onClick={() => onStartResource(res)}
                    className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition cursor-pointer"
                  >
                    Start →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Section 13: Your Recommended Path (Sequenced Steps) */}
      <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#1B3828]">Your Recommended Path</h3>
          <p className="text-xs text-stone-500">Step-by-step sequence calibrated for your goals</p>
        </div>

        <div className="space-y-2.5">
          {recommendedSteps.map((step) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div
                key={step.num}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  isCurrent
                    ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] ring-1 ring-[#2C573C] shadow-sm font-semibold"
                    : isCompleted
                    ? "bg-[#FAFBF9] border-[#E5EDE3] text-stone-600"
                    : "bg-white border-[#E5EDE3] text-stone-400"
                }`}
              >
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-[11px] ${
                      isCurrent
                        ? "bg-[#1B3828] text-white"
                        : isCompleted
                        ? "bg-[#D8E9D5] text-[#245435]"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {isCompleted ? "✓" : step.num}
                  </span>
                  <span className="font-medium text-stone-900">{step.label}</span>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1B3828] text-white px-2.5 py-0.5 rounded-full">
                    CURRENT
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
