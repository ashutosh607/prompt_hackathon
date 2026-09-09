import { useState } from "react";
import { Sparkles, HelpCircle, Bookmark, Filter } from "lucide-react";
import { Button } from "../ui/button";

export default function RecommendedTab({
  resources,
  savedResourceIds,
  onToggleSaveResource,
  onStartResource,
  onOpenWhyThis,
}) {
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const formats = ["All", "Video", "Interactive Coding", "Article", "Project"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredResources = resources.filter((res) => {
    if (selectedFormat !== "All" && res.type !== selectedFormat) return false;
    if (selectedDifficulty !== "All" && res.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-[#162F22]">Personalized Recommendations</h2>
        <p className="text-xs text-stone-500 mt-1">
          Handpicked resources targeting your diagnosed learning gaps.
        </p>
      </div>

      {/* Lightweight Filtering (Section 16) */}
      <div className="bg-white rounded-3xl border border-[#E3ECE0] p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Format:
          </span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedFormat === fmt
                  ? "bg-[#1B3828] text-white"
                  : "bg-[#F5F8F4] text-stone-600 hover:bg-[#EAF2E8]"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-stone-500">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedDifficulty === diff
                  ? "bg-[#1B3828] text-white"
                  : "bg-[#F5F8F4] text-stone-600 hover:bg-[#EAF2E8]"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => {
          const isSaved = savedResourceIds.includes(res.id);

          return (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm hover:border-[#2C573C] transition-all flex flex-col justify-between space-y-4 group"
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
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-emerald-700" : ""}`} />
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#162F22] leading-snug group-hover:text-emerald-900 transition">
                    {res.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
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

              <div className="pt-3 border-t border-[#F0F5EE] flex items-center justify-between">
                <button
                  onClick={() => onOpenWhyThis(res)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Why this?
                </button>

                <Button
                  onClick={() => onStartResource(res)}
                  className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Start Resource →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
