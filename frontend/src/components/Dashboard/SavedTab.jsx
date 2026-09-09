import { Bookmark, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function SavedTab({
  resources,
  savedResourceIds,
  onToggleSaveResource,
  onStartResource,
  onOpenWhyThis,
}) {
  const savedResources = resources.filter((res) => savedResourceIds.includes(res.id));

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-[#162F22]">Saved Learning Resources</h2>
        <p className="text-xs text-stone-500 mt-1">
          Resources you have bookmarked for deep study or practical review.
        </p>
      </div>

      {savedResources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E3ECE0] p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EAF3E8] flex items-center justify-center text-emerald-800">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#1B3828]">No saved resources yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the bookmark icon on any recommended resource card to save it for later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-[#E3ECE0] p-6 shadow-sm hover:border-[#2C573C] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#245435] bg-[#EAF3E8] px-2.5 py-0.5 rounded-full">
                    {res.matchPercentage}% MATCH
                  </span>
                  <button
                    onClick={() => onToggleSaveResource(res.id)}
                    className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
                    title="Remove from saved"
                  >
                    <Bookmark className="w-4 h-4 fill-emerald-700" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-[#162F22] leading-snug">
                  {res.title}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {res.reasonSnippet}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                  <span>{res.type}</span>
                  <span>•</span>
                  <span>{res.duration}</span>
                  <span>•</span>
                  <span>{res.difficulty}</span>
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
                  Start →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
