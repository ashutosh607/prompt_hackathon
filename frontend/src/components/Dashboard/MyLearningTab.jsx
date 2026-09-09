import { CheckCircle2, Play, Lock, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function MyLearningTab({ profile, onStartResource, resources }) {
  const topics = [
    { title: "Python for Data Science", status: "completed", score: "94%" },
    { title: "NumPy & Numerical Operations", status: "completed", score: "88%" },
    { title: "Pandas & Data Manipulation", status: "completed", score: "85%" },
    { title: "Data Preprocessing & Scaling", status: "completed", score: "90%" },
    { title: "Linear Regression (Current Focus)", status: "current", score: "72% Understanding", progress: 72 },
    { title: "Logistic Regression & Classification", status: "locked", score: "Prerequisite: Linear Regression" },
    { title: "Decision Trees & Random Forests", status: "locked", score: "Prerequisite: Classification" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#162F22]">My Learning Path</h2>
          <p className="text-xs text-stone-500 mt-1">
            Track milestones, review completed modules, and advance sequentially.
          </p>
        </div>

        <Button
          onClick={() => onStartResource(resources[0])}
          className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition cursor-pointer self-start sm:self-auto"
        >
          Resume Linear Regression →
        </Button>
      </div>

      <div className="space-y-3">
        {topics.map((t, idx) => {
          const isCompleted = t.status === "completed";
          const isCurrent = t.status === "current";

          return (
            <div
              key={t.title}
              className={`p-5 rounded-3xl border transition flex items-center justify-between gap-4 ${
                isCurrent
                  ? "bg-white border-[#2C573C] ring-2 ring-[#2C573C]/20 shadow-sm"
                  : isCompleted
                  ? "bg-white border-[#E3ECE0]"
                  : "bg-[#F8FAF7] border-[#E8EEE5] opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? "bg-[#1B3828] text-white"
                      : isCompleted
                      ? "bg-[#EAF3E8] text-[#245435]"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {isCompleted ? "✓" : `0${idx + 1}`}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#162F22]">{t.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{t.score}</p>
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <Button
                    onClick={() => onStartResource(resources[0])}
                    className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Continue
                  </Button>
                ) : isCompleted ? (
                  <span className="text-xs font-semibold text-emerald-800 bg-[#EAF3E8] px-3 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-stone-400 mr-2" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
