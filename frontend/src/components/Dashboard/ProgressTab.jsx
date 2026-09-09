import { TrendingUp, Clock, Award, BookOpen, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ProgressTab({ profile }) {
  const weeklyData = [
    { week: "Week 1", score: 45 },
    { week: "Week 2", score: 54 },
    { week: "Week 3", score: 63 },
    { week: "Week 4", score: 72 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h2 className="text-2xl font-bold text-[#162F22]">Learning Progress & Analytics</h2>
        <p className="text-xs text-stone-500 mt-1">
          Track your skill growth trajectory, time invested, and mastery by competency.
        </p>
      </div>

      {/* 1. Skill Growth Line Chart (Section 14) */}
      <div className="bg-white rounded-3xl border border-[#E3ECE0] p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1B3828]">Skill Growth Trajectory</h3>
            <span className="text-xs text-stone-500">+27% total improvement across 4 weeks</span>
          </div>
          <span className="text-sm font-black font-mono text-[#1B3828] bg-[#EAF3E8] px-3 py-1 rounded-full">
            Currently 72%
          </span>
        </div>

        {/* Responsive Line Chart Visualization */}
        <div className="h-44 w-full flex items-end justify-between pt-6 px-4 border-b border-[#E3ECE0] relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-x-0 top-6 border-b border-dashed border-stone-100 text-[10px] text-stone-300 pr-2 text-right">
            75%
          </div>
          <div className="absolute inset-x-0 top-20 border-b border-dashed border-stone-100 text-[10px] text-stone-300 pr-2 text-right">
            50%
          </div>
          <div className="absolute inset-x-0 top-32 border-b border-dashed border-stone-100 text-[10px] text-stone-300 pr-2 text-right">
            25%
          </div>

          {weeklyData.map((item, i) => (
            <div key={item.week} className="flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-mono font-bold text-[#1B3828]">
                {item.score}%
              </span>
              <div
                className="w-10 sm:w-14 bg-gradient-to-t from-[#1B3828] to-[#4E8752] rounded-t-xl transition-all duration-500 shadow-sm"
                style={{ height: `${(item.score / 80) * 110}px` }}
              />
              <span className="text-[11px] text-stone-500 font-medium">{item.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Knowledge Growth
          </span>
          <span className="text-2xl font-black text-[#1B3828] font-mono block">+27%</span>
          <p className="text-[10px] text-emerald-700">Steady upward slope</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Quiz Performance
          </span>
          <span className="text-2xl font-black text-[#1B3828] font-mono block">82%</span>
          <p className="text-[10px] text-stone-400">Average first-attempt</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Learning Time
          </span>
          <span className="text-2xl font-black text-[#1B3828] font-mono block">12.5 hrs</span>
          <p className="text-[10px] text-stone-400">Across 18 sessions</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Topics Completed
          </span>
          <span className="text-2xl font-black text-[#1B3828] font-mono block">8 / 20</span>
          <p className="text-[10px] text-stone-400">40% of ML track</p>
        </div>
      </div>

      {/* 3. Strongest vs Weakest Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#1B3828] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Strongest Skills
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            <li className="flex justify-between border-b border-[#F0F5EE] pb-1.5">
              <span>Fundamentals & Regression Equations</span>
              <span className="font-mono font-bold text-emerald-800">85%</span>
            </li>
            <li className="flex justify-between border-b border-[#F0F5EE] pb-1.5">
              <span>Concepts & Intuitive Graphs</span>
              <span className="font-mono font-bold text-emerald-800">75%</span>
            </li>
            <li className="flex justify-between">
              <span>Problem Solving Logic</span>
              <span className="font-mono font-bold text-emerald-800">62%</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#E3ECE0] shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-[#1B3828] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Weakest Skills (Current Focus)
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            <li className="flex justify-between border-b border-[#F0F5EE] pb-1.5">
              <span>Practical Scikit-Learn Implementation</span>
              <span className="font-mono font-bold text-amber-700">45%</span>
            </li>
            <li className="flex justify-between border-b border-[#F0F5EE] pb-1.5">
              <span>Regularization & Advanced Concepts</span>
              <span className="font-mono font-bold text-stone-500">30%</span>
            </li>
            <li className="flex justify-between">
              <span>Residual Metric Trade-offs</span>
              <span className="font-mono font-bold text-amber-700">52%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
