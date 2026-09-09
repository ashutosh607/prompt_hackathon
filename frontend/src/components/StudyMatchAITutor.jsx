import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Compass,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  Bot,
} from "lucide-react";
import { Button } from "./ui/button";
import { socket } from "../lib/socket";

export default function StudyMatchAITutor({
  topic = "Linear Regression",
  resource = {},
  learnerProfile = {},
  onDoubtEscalated,
}) {
  const [messages, setMessages] = useState([
    {
      id: "initial-1",
      sender: "ai",
      text: "I'm here while you learn. Ask me whenever you get stuck with the concepts or calculations.",
      timestamp: "Just now",
      isWelcome: true,
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Listen for real-time teacher response via Socket.IO
  useEffect(() => {
    const handleTeacherResponse = (data) => {
      console.log("[AITutor] Received teacher:response via Socket.IO:", data);

      setMessages((prev) => [
        ...prev,
        {
          id: `teacher-${Date.now()}`,
          sender: "teacher",
          teacherName: data.teacherName || "Your Teacher",
          text: data.message,
          timestamp: data.timestamp || "Just now",
        },
      ]);

      if (activeDoubt && activeDoubt.id === data.doubtId) {
        setActiveDoubt((prev) => (prev ? { ...prev, status: "RESOLVED" } : null));
      }
    };

    socket.on("teacher:response", handleTeacherResponse);

    return () => {
      socket.off("teacher:response", handleTeacherResponse);
    };
  }, [activeDoubt]);

  const handleSendQuestion = async (queryText) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isThinking) return;

    const userMessageId = `msg-student-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: "student",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    try {
      const response = await fetch("http://localhost:5000/api/doubts/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          topic: topic || "Linear Regression",
          resource: {
            title: resource.title || "Linear Regression Explained Visually",
            type: resource.type || "video",
          },
          learnerProfile: {
            name: learnerProfile.name || "Aarav",
            level: learnerProfile.level || "Beginner",
            style: learnerProfile.style || "Visual",
            confidence: learnerProfile.confidence || 72,
            stats: learnerProfile.stats,
          },
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      setIsThinking(false);

      if (data.success && data.analysis) {
        const analysis = data.analysis;

        if (analysis.can_resolve) {
          // AI can confidently answer
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: "ai",
              text: analysis.response,
              confidence: analysis.confidence,
              mlContext: analysis.ml_context,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } else {
          // AI decides human teacher intervention is necessary (anti-hallucination USP)
          const newDoubt = data.doubt || {
            id: `doubt-local-${Date.now()}`,
            topic: topic || "Linear Regression",
            resourceTitle: resource.title || "Linear Regression Explained Visually",
            status: "WAITING_FOR_TEACHER",
            reason: analysis.reason,
            confidence: analysis.confidence,
            mlContext: analysis.ml_context,
          };

          setActiveDoubt(newDoubt);
          if (onDoubtEscalated) onDoubtEscalated(newDoubt);

          setMessages((prev) => [
            ...prev,
            {
              id: `ai-escalate-text-${Date.now()}`,
              sender: "ai",
              text: "I don't want to give you a misleading explanation. This one needs a teacher's attention.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
            {
              id: `ai-escalate-card-${Date.now()}`,
              sender: "escalation_card",
              doubt: newDoubt,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      } else {
        // Fallback response
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Let's review the main intuition: in linear regression, the slope represents how much Y shifts whenever X increases by one unit.",
            timestamp: "Just now",
          },
        ]);
      }
    } catch (err) {
      console.error("[StudyMatch AI] Ask error:", err);
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "I'm temporarily unable to reach the server, but keep watching! A negative slope indicates an inverse downward relationship in your data points.",
          timestamp: "Just now",
        },
      ]);
    }
  };

  const quickQuestions = [
    { text: "Why is the slope negative here?", label: "Negative slope" },
    { text: "How does Ordinary Least Squares work?", label: "Least squares intuition" },
    { text: "Why does the slope change when this point is removed?", label: "Outlier point (Escalates to Teacher)" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FAFBF9] border-l border-[#E2EBE0] text-[#1B3828]">
      {/* Companion Top Banner */}
      <div className="px-4 py-3 bg-[#F0F6EE] border-b border-[#E0ECE0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1B3828] flex items-center justify-center text-emerald-300 shadow-sm">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1B3828]">StudyMatch AI Tutor</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> ML Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
              {resource.title || "Learning Companion"}
            </p>
          </div>
        </div>

        {activeDoubt && activeDoubt.status === "WAITING_FOR_TEACHER" && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3" /> Teacher Escalated
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {messages.map((msg) => {
          if (msg.sender === "student") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] bg-[#1B3828] text-white p-3 rounded-2xl rounded-tr-sm text-xs shadow-sm space-y-1">
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-emerald-300 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          if (msg.sender === "teacher") {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[90%] bg-gradient-to-br from-[#EEF7EC] to-[#E5F2E3] border border-[#CDE3CB] p-3.5 rounded-2xl rounded-tl-sm text-xs shadow-sm space-y-2 text-[#1B3828]">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-[#D4EAD2] text-emerald-900">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-[11px]">{msg.teacherName} (Teacher)</span>
                    <span className="text-[10px] text-stone-500 ml-auto">{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold pt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Direct teacher clarification received
                  </div>
                </div>
              </div>
            );
          }

          if (msg.sender === "escalation_card") {
            const doubt = msg.doubt || {};
            return (
              <div key={msg.id} className="p-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F3E6BA] shadow-sm space-y-2.5 text-xs text-[#523B08]">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Teacher help requested</span>
                </div>
                <p className="text-[11px] text-[#69501B]">
                  I&apos;ve sent this doubt to your teacher so you get an accurate, verified explanation without guesswork.
                </p>

                <div className="p-2.5 bg-white/80 rounded-xl border border-[#EFE1AF] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Topic:</span>
                    <span className="font-semibold text-stone-800">{doubt.topic || topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Resource:</span>
                    <span className="font-semibold text-stone-800 truncate max-w-[150px]">
                      {doubt.resourceTitle || resource.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#F2E5B5]">
                    <span className="text-stone-500">Status:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                      <Clock className="w-2.5 h-2.5 animate-spin" /> WAITING FOR TEACHER
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-500 italic">
                  Feel free to continue watching or reading—your teacher&apos;s answer will pop up right here in this chat!
                </p>
              </div>
            );
          }

          // Default AI Tutor Message
          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[88%] bg-white border border-[#E3ECE0] p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm space-y-2 text-stone-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1B3828]">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>StudyMatch AI</span>
                  {msg.confidence && (
                    <span className="ml-auto text-[9px] text-stone-400 font-normal">
                      Match Confidence: {Math.round(msg.confidence * 100)}%
                    </span>
                  )}
                </div>

                <p className="leading-relaxed whitespace-pre-line text-stone-700">{msg.text}</p>

                {msg.mlContext && msg.mlContext.predicted_action && (
                  <div className="p-2 rounded-xl bg-[#F4F9F2] border border-[#E0EDE0] text-[10px] text-[#224A2E] flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>ML Suggestion ({msg.mlContext.predicted_action})</strong>:{" "}
                      {msg.mlContext.guidance || "Tailored to your learning style."}
                    </span>
                  </div>
                )}

                <span className="text-[9px] text-stone-400 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E3ECE0] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-xs shadow-sm flex items-center gap-2 text-stone-500">
              <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span className="italic font-medium">Let me look at that...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Doubt Chips */}
      <div className="px-3 py-2 bg-[#F3F7F2] border-t border-[#E3EBE0]">
        <div className="text-[10px] font-bold text-stone-500 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q.text)}
              disabled={isThinking}
              className="text-left text-[11px] px-2.5 py-1.5 bg-white border border-[#DCE6D9] hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl text-stone-700 transition cursor-pointer truncate shadow-2xs"
            >
              {q.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer */}
      <div className="p-3 bg-white border-t border-[#E2EBE0]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about this resource..."
            disabled={isThinking}
            className="flex-1 bg-[#F5F8F4] border border-[#D8E4D5] focus:border-[#1B3828] focus:bg-white rounded-full px-3.5 py-2 text-xs text-[#1B3828] placeholder-stone-400 outline-none transition"
          />
          <Button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="w-8 h-8 rounded-full bg-[#1B3828] hover:bg-[#132A1D] text-white p-0 flex items-center justify-center shrink-0 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
        <p className="text-[9px] text-stone-400 text-center mt-1.5">
          ML Guided • Unsure questions auto-escalate to your teacher
        </p>
      </div>
    </div>
  );
}
