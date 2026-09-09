import {
  Compass,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  Award,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  X,
} from "lucide-react";

export default function Sidebar({
  activeTab,
  onTabChange,
  profile,
  onOpenAuth,
  mobileOpen,
  onCloseMobile,
  onOpenTeacherPortal,
  pendingDoubtsCount = 0,
}) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "mylearning", label: "My Learning", icon: BookOpen },
    { id: "recommended", label: "Recommended", icon: Sparkles },
    { id: "assessments", label: "Quiz & Assessments", icon: Award },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "saved", label: "Saved Resources", icon: Bookmark },
  ];

  const studentName = profile?.name || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-64 bg-[#F5F8F4] border-r border-[#E2EAE0] flex flex-col justify-between p-5 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Top Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#1B3828] tracking-tight">
                StudyMatch
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1 text-stone-400 hover:text-stone-700 lg:hidden rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#1B3828] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950 hover:bg-[#EAF2E8]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Teacher Portal Switcher */}
          {onOpenTeacherPortal && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenTeacherPortal();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-[#EAF3E8] border border-[#D0E3CD] text-[#1B3828] hover:bg-[#DEEDE0] transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1B3828] text-white flex items-center justify-center text-[10px]">
                    🎓
                  </div>
                  <span>Teacher Portal</span>
                </div>
                {pendingDoubtsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {pendingDoubtsCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Student Profile Card */}
        <div className="pt-4 border-t border-[#E2EAE0] flex items-center justify-between">
          <div
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#E5EFE3] border border-[#CBDDC7] flex items-center justify-center text-[#1B3828] font-bold text-xs">
              {studentInitial}
            </div>
            <div>
              <span className="text-xs font-bold text-[#1B3828] block group-hover:text-emerald-800 transition">
                {studentName}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">
                {profile?.domain || "Machine Learning"}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg transition"
            title="Settings & Account"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
