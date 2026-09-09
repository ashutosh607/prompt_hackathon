import { X, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export default function WhyThisModal({ resource, isOpen, onClose }) {
  if (!isOpen || !resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFEFC] border border-[#E5ECE3] rounded-3xl shadow-2xl p-6 sm:p-7 text-[#1B3828] space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E8] text-[#245435] text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Recommendation Transparency
          </div>
          <h3 className="text-xl font-bold text-[#162F22]">
            Why we're recommending this
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {resource.title}
          </p>
        </div>

        {/* Criteria Checklist */}
        <div className="space-y-2.5 bg-[#F6FAF4] p-4 rounded-2xl border border-[#DFEDE0]">
          {resource.criteria?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between p-4 bg-[#FAFBF9] rounded-2xl border border-[#E3ECE0]">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              Confidence Score
            </span>
            <span className="text-xs font-semibold text-stone-600">
              Multi-Factor Match Score
            </span>
          </div>
          <span className="text-2xl font-black text-[#1B3828] font-mono">
            {resource.matchPercentage}%
          </span>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-[#1B3828] hover:bg-[#122A1E] text-white py-2.5 rounded-full text-xs font-semibold shadow-sm transition"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
