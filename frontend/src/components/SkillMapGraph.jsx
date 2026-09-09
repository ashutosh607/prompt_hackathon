import { Star, Lock } from "lucide-react";

export default function SkillMapGraph({ compact = false, activeNode = "slope" }) {
  return (
    <div
      className={`relative w-full flex items-center justify-center select-none overflow-hidden ${
        compact ? "h-[220px] p-2" : "h-[360px] p-4"
      }`}
    >
      {/* Background Stylized Trees and Foliage (Matching Screenshot) */}
      {!compact && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 500 320" fill="none">
            {/* Tree left 1 */}
            <g transform="translate(60, 210) scale(0.9)">
              <ellipse cx="20" cy="30" rx="14" ry="24" fill="#3E6B4A" />
              <ellipse cx="20" cy="20" rx="11" ry="18" fill="#4E825D" />
              <ellipse cx="20" cy="10" rx="8" ry="12" fill="#5F976F" />
              <rect x="18" y="44" width="4" height="12" fill="#8D7A68" rx="2" />
            </g>
            {/* Tree left 2 */}
            <g transform="translate(100, 235) scale(0.65)">
              <ellipse cx="20" cy="30" rx="14" ry="24" fill="#3E6B4A" />
              <ellipse cx="20" cy="20" rx="11" ry="18" fill="#4E825D" />
              <rect x="18" y="44" width="4" height="10" fill="#8D7A68" rx="2" />
            </g>
            {/* Tree right 1 */}
            <g transform="translate(410, 215) scale(0.85)">
              <ellipse cx="20" cy="30" rx="14" ry="24" fill="#3E6B4A" />
              <ellipse cx="20" cy="20" rx="11" ry="18" fill="#4E825D" />
              <rect x="18" y="44" width="4" height="12" fill="#8D7A68" rx="2" />
            </g>
            {/* Soft ground contour hill lines */}
            <path
              d="M0,280 C120,260 200,290 320,270 C400,260 480,280 500,280 L500,320 L0,320 Z"
              fill="#F2F6F0"
              opacity="0.8"
            />
          </svg>
        </div>
      )}

      {/* SVG Connecting Paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 500 320"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Branch: Root (250, 45) -> Fundamentals (130, 135) */}
        <path
          d="M 250 50 C 250 85, 130 90, 130 115"
          stroke="#D1E0CE"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Branch: Root (250, 45) -> Slope (250, 135) */}
        <path
          d="M 250 50 L 250 115"
          stroke="#4E8752"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Branch: Root (250, 45) -> Regression Line (370, 135) */}
        <path
          d="M 250 50 C 250 85, 370 90, 370 115"
          stroke="#D1E0CE"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Branch: Slope (250, 160) -> Error (200, 235) */}
        <path
          d="M 250 160 C 250 195, 200 200, 200 220"
          stroke="#D1E0CE"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Branch: Slope (250, 160) -> Practice (300, 235) */}
        <path
          d="M 250 160 C 250 195, 300 200, 300 220"
          stroke="#D1E0CE"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Node Hierarchy Elements */}
      <div className="relative w-full max-w-[500px] h-[320px]">
        {/* 1. Root Node: Linear Regression */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20">
          <div
            className={`flex items-center justify-center gap-1.5 rounded-full font-semibold text-white shadow-md bg-[#1B3828] border-2 border-[#2E5A3D] ${
              compact ? "px-3 py-1 text-[11px]" : "px-5 py-2 text-xs"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Linear Regression</span>
          </div>
        </div>

        {/* 2. Level 1 Nodes */}
        {/* Fundamentals (Left) */}
        <div className="absolute top-[115px] left-[130px] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`rounded-full flex items-center justify-center text-[#2E543A] font-medium bg-[#E8F1E5] border-2 border-[#CFE1CA] shadow-sm hover:scale-105 transition ${
              compact ? "w-14 h-14 text-[10px]" : "w-20 h-20 text-xs"
            }`}
          >
            Fundamentals
          </div>
        </div>

        {/* Slope (Center, HIGHLIGHTED with Halo Ring) */}
        <div className="absolute top-[135px] left-[250px] -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative flex items-center justify-center">
            {/* Glowing Golden-Yellow Aura */}
            <div
              className={`absolute rounded-full bg-gradient-to-r from-amber-300/40 via-yellow-200/50 to-emerald-300/40 blur-md animate-pulse ${
                compact ? "w-20 h-20" : "w-28 h-28"
              }`}
            />
            {/* Outer Ring */}
            <div
              className={`absolute rounded-full border-2 border-yellow-300/70 border-dashed animate-[spin_12s_linear_infinite] ${
                compact ? "w-[68px] h-[68px]" : "w-[94px] h-[94px]"
              }`}
            />
            {/* Main Node Circle */}
            <div
              className={`relative rounded-full flex flex-col items-center justify-center font-bold text-[#193B26] bg-gradient-to-b from-[#FFFDF0] to-[#E9F4E3] border-3 border-yellow-400 shadow-lg ${
                compact ? "w-14 h-14 text-xs" : "w-20 h-20 text-sm"
              }`}
            >
              <span className="leading-tight">Slope</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-0.5" />
            </div>
          </div>
        </div>

        {/* Regression Line (Right, Locked) */}
        <div className="absolute top-[115px] left-[370px] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`rounded-full flex flex-col items-center justify-center text-stone-400 bg-[#EEF2EC] border border-[#DCE4DA] shadow-sm ${
              compact ? "w-14 h-14 text-[9px]" : "w-20 h-20 text-[11px]"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-stone-400 mb-0.5" />
            <span>Regression</span>
            <span>Line</span>
          </div>
        </div>

        {/* 3. Level 2 Nodes (Under Slope) */}
        {/* Error (Left Child of Slope) */}
        <div className="absolute top-[240px] left-[200px] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`rounded-full flex flex-col items-center justify-center text-stone-400 bg-[#EEF2EC] border border-[#DCE4DA] shadow-sm ${
              compact ? "w-11 h-11 text-[9px]" : "w-14 h-14 text-[10px]"
            }`}
          >
            <Lock className="w-3 h-3 text-stone-400 mb-0.5" />
            <span>Error</span>
          </div>
        </div>

        {/* Practice (Right Child of Slope) */}
        <div className="absolute top-[240px] left-[300px] -translate-x-1/2 -translate-y-1/2 z-10">
          <div
            className={`rounded-full flex flex-col items-center justify-center text-stone-400 bg-[#EEF2EC] border border-[#DCE4DA] shadow-sm ${
              compact ? "w-11 h-11 text-[9px]" : "w-14 h-14 text-[10px]"
            }`}
          >
            <Lock className="w-3 h-3 text-stone-400 mb-0.5" />
            <span>Practice</span>
          </div>
        </div>
      </div>
    </div>
  );
}
