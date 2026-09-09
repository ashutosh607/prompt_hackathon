import { Award, CheckCircle2, Play, RefreshCw, Flame, Clock } from "lucide-react";
import { Button } from "../ui/button";

export default function AssessmentsTab({ onRetakeDiagnostic }) {
  const assessments = [
    {
      id: "diag-1",
      title: "Diagnostic Assessment",
      topic: "Linear Regression",
      score: "72%",
      status: "Completed",
      questions: "10 questions",
      time: "5 min",
      actionLabel: "Retake Diagnostic",
      actionType: "retake",
    },
    {
      id: "quiz-1",
      title: "Practice Quiz",
      topic: "K-Means Clustering",
      score: null,
      status: "Not started",
      questions: "8 questions",
      time: "6 min",
      actionLabel: "Start Quiz",
      actionType: "start",
    },
    {
      id: "challenge-1",
      title: "Skill Challenge",
      topic: "Decision Trees",
      score: null,
      status: "Not started",
      questions: "12 questions",
      time: "10 min",
      actionLabel: "Start Challenge →",
      actionType: "challenge",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-[#162F22]">Quizzes & Skill Assessments</h2>
        <p className="text-xs text-stone-500 mt-1">
          Validate your conceptual understanding and track score improvements through adaptive assessments.
        </p>
      </div>

      <div className="space-y-4">
        {assessments.map((item) => {
          const isCompleted = item.status === "Completed";

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm hover:border-[#2C573C] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-[#EAF3E8] text-[#245435] border border-[#D0E2CC]"
                        : "bg-[#F3F7F2] text-stone-500"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-stone-400">•</span>
                  <span className="text-xs font-bold text-stone-600">{item.title}</span>
                </div>

                <h3 className="text-lg font-bold text-[#1B3828]">{item.topic}</h3>

                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{item.questions}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                  {item.score && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-emerald-800">Score: {item.score}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isCompleted ? (
                  <Button
                    onClick={onRetakeDiagnostic}
                    variant="outline"
                    className="border-[#2C573C] text-[#2C573C] hover:bg-[#EAF3E8] rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Retake Assessment
                  </Button>
                ) : (
                  <Button
                    onClick={onRetakeDiagnostic}
                    className="bg-[#1B3828] hover:bg-[#122A1E] text-white rounded-full px-6 py-2.5 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    {item.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
