import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Sparkles,
  User,
  ArrowRight,
  Send,
  RefreshCw,
  Search,
  Filter,
  Brain,
} from "lucide-react";
import { Button } from "../ui/button";
import { socket } from "../../lib/socket";

export default function TeacherDashboard({ onBackToStudent }) {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [teacherReply, setTeacherReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filterTopic, setFilterTopic] = useState("all");

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/doubts/pending");
      const data = await res.json();
      if (data.success) {
        setDoubts(data.doubts || []);
      }
    } catch (err) {
      console.warn("[TeacherDashboard] Error fetching doubts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();

    // Listen for real-time doubts escalated by students
    const handleNewDoubt = (newDoubt) => {
      console.log("[TeacherDashboard] Received real-time doubt:escalated:", newDoubt);
      setDoubts((prev) => [newDoubt, ...prev.filter((d) => d.id !== newDoubt.id)]);
    };

    socket.on("doubt:escalated", handleNewDoubt);

    return () => {
      socket.off("doubt:escalated", handleNewDoubt);
    };
  }, []);

  const handleSendResponse = async (doubtId) => {
    if (!teacherReply.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`http://localhost:5000/api/doubts/${doubtId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherMessage: teacherReply.trim(),
          teacherName: "Prof. Sharma",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setDoubts((prev) =>
          prev.map((d) => (d.id === doubtId ? data.doubt : d))
        );
        setSelectedDoubt(data.doubt);
        setTeacherReply("");
      }
    } catch (err) {
      console.error("[TeacherDashboard] Respond error:", err);
    } finally {
      setSending(false);
    }
  };

  const pendingDoubts = doubts.filter((d) => d.status === "WAITING_FOR_TEACHER");
  const resolvedDoubts = doubts.filter((d) => d.status === "RESOLVED");

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828]">
      {/* Top Teacher Navigation */}
      <header className="h-16 px-6 sm:px-10 border-b border-[#E2EAE0] bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1B3828] text-emerald-300 flex items-center justify-center font-bold text-sm shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#1B3828]">
                StudyMatch Teacher Portal
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3E8] border border-[#D0E3CD] text-[#224A2E]">
                ● Live Real-Time
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Escalation Queue & AI-Assisted Intervention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchDoubts}
            variant="outline"
            className="rounded-full px-3 py-1.5 text-xs text-stone-600 border-[#D8E3D5] hover:bg-[#F2F6F1] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={onBackToStudent}
            className="bg-[#1B3828] hover:bg-[#132A1D] text-white rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer shadow-sm"
          >
            ← Back to Student View
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8">
        {/* Banner Alert if pending doubts exist */}
        {pendingDoubts.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold">
                  {pendingDoubts.length} student {pendingDoubts.length === 1 ? "doubt requires" : "doubts require"} your attention
                </h3>
                <p className="text-[11px] text-amber-800">
                  The StudyMatch AI identified high-ambiguity or personalized questions and escalated them to avoid student confusion.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#EAF3E8] border border-[#D0E3CD] text-[#224A2E] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">
              All student doubts have been reviewed! Your queue is currently clear.
            </span>
          </div>
        )}

        {/* Section: Needs Your Attention */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Priority Queue
              </span>
              <h2 className="text-lg font-bold text-[#1B3828]">Needs Your Attention</h2>
            </div>
            <span className="text-xs text-stone-500">
              Auto-dispatched via Socket.IO
            </span>
          </div>

          {pendingDoubts.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#E3ECE0] rounded-3xl text-stone-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-emerald-600/40" />
              <p className="text-xs">No pending student doubts at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingDoubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wide">
                        <Clock className="w-2.5 h-2.5" /> New Doubt
                      </span>
                      {doubt.priority === "HIGH" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                          ⚡ High Priority (Pro)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3E8] text-[#204930] border border-[#CFE4CD] uppercase">
                          Plus Plan
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {doubt.topic}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EBF4E9] text-[#1B3828] font-bold text-xs flex items-center justify-center border border-[#D5E5D3]">
                        {doubt.studentAvatar || doubt.studentName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        {doubt.studentName}
                      </span>
                      <span className="text-[11px] text-stone-400">• in {doubt.resourceTitle}</span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="p-3 bg-[#FCFDFB] border border-[#E5EFE2] rounded-2xl">
                    <span className="text-[10px] font-bold text-stone-400 block mb-1">
                      STUDENT QUESTION:
                    </span>
                    <p className="text-xs font-semibold text-[#1B3828] italic">
                      &quot;{doubt.question}&quot;
                    </p>
                  </div>

                  {/* AI & ML Context */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-[#FAFBF9] rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">AI Confidence:</span>
                      <span className="font-bold text-amber-800">
                        {Math.round((doubt.aiConfidence || 0.41) * 100)}%
                      </span>
                    </div>

                    <div className="p-2 bg-[#FAFBF9] rounded-xl border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">ML Action:</span>
                      <span className="font-bold text-emerald-800">
                        {doubt.mlContext?.predictedAction || "Build Concept"}
                      </span>
                    </div>
                  </div>

                  {/* Reason for Escalation */}
                  <div className="text-[11px] text-[#7A6122] bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                    <strong>Reason:</strong> {doubt.escalationReason || "Requires teacher personalization."}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedDoubt(doubt);
                      setTeacherReply("");
                    }}
                    className="w-full bg-[#1B3828] hover:bg-[#132A1D] text-white rounded-full py-2 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Review Doubt & Respond →
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Resolved Doubts History */}
        {resolvedDoubts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#E3ECE0]">
            <h3 className="text-sm font-bold text-[#1B3828]">Recently Resolved Doubts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resolvedDoubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="bg-white border border-[#E3ECE0] rounded-2xl p-4 space-y-2 opacity-90"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{doubt.studentName}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 truncate">&quot;{doubt.question}&quot;</p>
                  {doubt.teacherResponse && (
                    <div className="p-2 bg-[#F3F8F2] rounded-xl text-[11px] text-[#204930]">
                      <strong>Teacher reply:</strong> {doubt.teacherResponse.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Review & Respond Modal */}
      {selectedDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#FDFEFC] border border-[#E2EBE0] rounded-3xl shadow-2xl overflow-hidden p-6 text-[#1B3828] max-h-[90vh] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3ECE0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center text-xs font-bold">
                  {selectedDoubt.studentAvatar || "S"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1B3828]">
                    Reviewing Doubt: {selectedDoubt.studentName}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Topic: {selectedDoubt.topic} • {selectedDoubt.resourceTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoubt(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conversation Transcript */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#FAFBF9] rounded-2xl border border-[#E5EFE2]">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Session Transcript:
              </div>

              {selectedDoubt.conversation?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs ${
                    msg.sender === "student"
                      ? "bg-stone-100 text-stone-900 ml-4"
                      : msg.sender === "teacher"
                      ? "bg-emerald-100/70 border border-emerald-200 text-emerald-950 ml-2 font-medium"
                      : "bg-white border border-[#E2EBE0] text-stone-700 mr-4"
                  }`}
                >
                  <div className="text-[10px] font-bold mb-1 opacity-70">
                    {msg.sender === "student"
                      ? `${selectedDoubt.studentName} (Student)`
                      : msg.sender === "teacher"
                      ? "You (Teacher)"
                      : "StudyMatch AI"}
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* ML & Diagnostic Guidance */}
            <div className="p-3 bg-[#F4F9F2] rounded-2xl border border-[#D5E8D3] text-xs text-[#1E452B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Brain className="w-4 h-4 text-emerald-700" />
                <span>ML Model Context & Recommendation:</span>
              </div>
              <p className="text-[11px] text-[#295938]">
                Predicted Target: <strong>{selectedDoubt.mlContext?.predictedAction || "Build Concept"}</strong> (Confidence: {Math.round((selectedDoubt.mlContext?.confidence || 0.72) * 100)}%).
                Student prefers visual graphs over formulas.
              </p>
            </div>

            {/* Response Input Box */}
            <div className="space-y-2 pt-2 border-t border-[#E3ECE0]">
              <label className="text-xs font-bold text-stone-700 block">
                Your Explanation to {selectedDoubt.studentName}:
              </label>

              <textarea
                rows={3}
                value={teacherReply}
                onChange={(e) => setTeacherReply(e.target.value)}
                placeholder="The reason the slope changes is because removing that point shifts the center of gravity of the residuals..."
                className="w-full p-3 bg-white border border-[#D5E0D2] focus:border-[#1B3828] rounded-2xl text-xs text-[#1B3828] placeholder-stone-400 outline-none transition"
              />

              {/* Quick Template Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Removing a high leverage outlier changes the OLS line steepness.",
                  "Think of the regression line as balancing on a fulcrum point.",
                  "Check your second calculation step where the negative sign was applied.",
                ].map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTeacherReply(template)}
                    className="text-[10px] px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 rounded-full border border-stone-200 text-stone-700 transition cursor-pointer"
                  >
                    + {template}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setSelectedDoubt(null)}
                  variant="outline"
                  className="rounded-full px-4 py-2 text-xs text-stone-600 border-stone-200 cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleSendResponse(selectedDoubt.id)}
                  disabled={!teacherReply.trim() || sending}
                  className="bg-[#1B3828] hover:bg-[#132A1D] text-white rounded-full px-5 py-2 text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sending..." : "Respond to Student"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
