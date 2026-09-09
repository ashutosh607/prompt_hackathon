import { useState } from "react";
import { X, ThumbsUp, Smile, Meh, ThumbsDown, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function FeedbackModal({ resource, isOpen, onClose, onSubmitFeedback }) {
  const [helpfulRating, setHelpfulRating] = useState("very");
  const [difficultyRating, setDifficultyRating] = useState("just_right");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !resource) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitFeedback) {
      onSubmitFeedback(resource.id, {
        helpful: helpfulRating,
        difficulty: difficultyRating,
      });
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFEFC] border border-[#E5ECE3] rounded-3xl shadow-2xl p-6 sm:p-7 text-[#1B3828] space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1B3828]">Feedback Recorded!</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Your learning profile and recommendation weights have been calibrated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E8] text-[#245435] text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Adaptive Feedback Loop
              </div>
              <h3 className="text-xl font-bold text-[#162F22]">
                Was this resource helpful?
              </h3>
              <p className="text-xs text-stone-500 mt-1 truncate">
                {resource.title}
              </p>
            </div>

            {/* Helpful Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setHelpfulRating("very")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  helpfulRating === "very"
                    ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] ring-1 ring-[#2C573C]"
                    : "bg-[#FAFBF9] border-[#E3ECE0] text-stone-700 hover:border-stone-400"
                }`}
              >
                <span>👍</span>
                <span>Very Helpful</span>
              </button>

              <button
                type="button"
                onClick={() => setHelpfulRating("helpful")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  helpfulRating === "helpful"
                    ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] ring-1 ring-[#2C573C]"
                    : "bg-[#FAFBF9] border-[#E3ECE0] text-stone-700 hover:border-stone-400"
                }`}
              >
                <span>🙂</span>
                <span>Helpful</span>
              </button>

              <button
                type="button"
                onClick={() => setHelpfulRating("not_very")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  helpfulRating === "not_very"
                    ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] ring-1 ring-[#2C573C]"
                    : "bg-[#FAFBF9] border-[#E3ECE0] text-stone-700 hover:border-stone-400"
                }`}
              >
                <span>😐</span>
                <span>Not Very Useful</span>
              </button>

              <button
                type="button"
                onClick={() => setHelpfulRating("not")}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  helpfulRating === "not"
                    ? "bg-[#EAF3E8] border-[#2C573C] text-[#1B3828] ring-1 ring-[#2C573C]"
                    : "bg-[#FAFBF9] border-[#E3ECE0] text-stone-700 hover:border-stone-400"
                }`}
              >
                <span>👎</span>
                <span>Not Helpful</span>
              </button>
            </div>

            {/* Difficulty Rating */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-stone-700 block">
                Was it too easy or too difficult?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: "too_easy", label: "Too Easy" },
                  { id: "just_right", label: "Just Right" },
                  { id: "too_difficult", label: "Too Difficult" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficultyRating(item.id)}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition cursor-pointer ${
                      difficultyRating === item.id
                        ? "bg-[#1B3828] text-white border-[#1B3828] font-bold"
                        : "bg-[#FAFBF9] border-[#E3ECE0] text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1B3828] hover:bg-[#122A1E] text-white py-3 rounded-full text-xs font-semibold shadow-md transition cursor-pointer mt-2"
            >
              Submit Feedback & Recalibrate →
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
