import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AuthModal from "./components/AuthModal";
import OnboardingFlow from "./components/OnboardingFlow";
import AdaptiveQuiz from "./components/AdaptiveQuiz";
import QuizAnalysis from "./components/QuizAnalysis";
import Sidebar from "./components/Dashboard/Sidebar";
import OverviewTab from "./components/Dashboard/OverviewTab";
import MyLearningTab from "./components/Dashboard/MyLearningTab";
import RecommendedTab from "./components/Dashboard/RecommendedTab";
import AssessmentsTab from "./components/Dashboard/AssessmentsTab";
import ProgressTab from "./components/Dashboard/ProgressTab";
import SavedTab from "./components/Dashboard/SavedTab";
import WhyThisModal from "./components/Dashboard/WhyThisModal";
import FeedbackModal from "./components/Dashboard/FeedbackModal";
import ResourceViewerModal from "./components/ResourceViewerModal";
import {
  DEFAULT_LEARNER_PROFILE,
  RECOMMENDED_RESOURCES,
} from "./data/curriculumData";
import { computeRecommendationScore } from "./lib/personalizationEngine";
import {
  Compass,
  ArrowRight,
  User,
  Menu,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { Button } from "./components/ui/button";

export default function App() {
  // Application Stage: 'landing' | 'onboarding' | 'quiz' | 'analysis' | 'dashboard'
  const [appStage, setAppStage] = useState("landing");

  // Dashboard Active Tab
  const [dashboardTab, setDashboardTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Learner Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("studymatch_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_LEARNER_PROFILE;
  });

  // Resources State (with computed dynamic match scores)
  const [resources, setResources] = useState(RECOMMENDED_RESOURCES);
  const [savedResourceIds, setSavedResourceIds] = useState(["res-2"]);
  const [feedbackHistory, setFeedbackHistory] = useState({});

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedWhyThisResource, setSelectedWhyThisResource] = useState(null);
  const [activeFeedbackResource, setActiveFeedbackResource] = useState(null);
  const [viewerResource, setViewerResource] = useState(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);

  // User Auth State
  const [user, setUser] = useState(null);

  // Initial Supabase Session Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setProfile((prev) => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || prev.name,
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setProfile((prev) => ({
          ...prev,
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || prev.name,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save profile updates to localStorage
  useEffect(() => {
    localStorage.setItem("studymatch_profile", JSON.stringify(profile));
  }, [profile]);

  // Recalculate recommendation scores when profile or feedback updates
  useEffect(() => {
    const updated = RECOMMENDED_RESOURCES.map((res) => {
      const score = computeRecommendationScore(res, profile, feedbackHistory);
      return { ...res, matchPercentage: score };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    setResources(updated);
  }, [profile, feedbackHistory]);

  // 1. Onboarding Completed Handler
  const handleOnboardingComplete = (onboardingData) => {
    setProfile((prev) => ({
      ...prev,
      ...onboardingData,
    }));
    setAppStage("quiz");
  };

  // 2. Adaptive Quiz Completed Handler
  const handleQuizComplete = (quizResults) => {
    setProfile((prev) => ({
      ...prev,
      diagnosticCompleted: true,
      overallScore: quizResults.overallScore,
      skillScores: quizResults.skillScores,
      learningGaps: quizResults.learningGaps,
      stats: {
        ...prev.stats,
        overallSkill: quizResults.overallScore,
      },
    }));
    setAppStage("analysis");
  };

  // 3. Toggle Bookmark
  const handleToggleSaveResource = (resourceId) => {
    setSavedResourceIds((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // 4. Start Resource -> Opens Learning Viewer Modal
  const handleStartResource = (resource) => {
    setViewerResource(resource);
    setViewerModalOpen(true);
  };

  // 5. Complete Resource -> Triggers Feedback Loop Modal
  const handleResourceFinished = () => {
    if (viewerResource) {
      setActiveFeedbackResource(viewerResource);
    }
  };

  // 6. Submit Feedback Loop Handler
  const handleSubmitFeedback = (resourceId, feedbackData) => {
    setFeedbackHistory((prev) => ({
      ...prev,
      [resourceId]: feedbackData,
    }));

    // Reward skill growth in profile stats
    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        overallSkill: Math.min(100, prev.stats.overallSkill + 1),
        learningHours: "13.0 hrs",
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] font-sans antialiased flex flex-col selection:bg-emerald-200">
      {/* ========================================================================= */}
      {/* 1. LANDING PAGE (Preserved exactly as requested) */}
      {/* ========================================================================= */}
      {appStage === "landing" && (
        <div className="min-h-screen flex flex-col justify-between">
          {/* Top Header */}
          <header className="w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2 select-none cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#EBF3E8] border border-[#D5E6D2] flex items-center justify-center text-[#2A5739]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-[#1B3828] tracking-tight">
                StudyMatch
              </span>
            </div>

            <nav className="flex items-center gap-6">
              <button
                onClick={() => setAppStage("onboarding")}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer hidden sm:inline-block"
              >
                How it works
              </button>
              <button
                onClick={() => setAppStage("dashboard")}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer hidden sm:inline-block"
              >
                Dashboard Demo
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                  user
                    ? "bg-[#EAF3E8] border border-[#2B563A] text-[#1B3828] font-bold text-xs"
                    : "bg-white border border-[#DDE5DC] text-stone-600 hover:bg-stone-50 shadow-sm"
                }`}
                title={user ? `Signed in as ${user.email}` : "Sign In / Sign Up"}
              >
                {user ? user.email?.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </button>
            </nav>
          </header>

          {/* Hero Section */}
          <main className="max-w-5xl mx-auto px-6 py-8 sm:py-16 flex-1 w-full flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#162F22] tracking-tight leading-[1.12]">
                  Your learning <br />
                  adventure starts here.
                </h1>
                <p className="text-base sm:text-lg text-stone-500 max-w-md font-normal leading-relaxed">
                  Find what you need to learn next — <br className="hidden sm:inline" />
                  not just another list of resources.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => setAppStage("onboarding")}
                    className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group"
                  >
                    Start your quest
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>

                  <Button
                    onClick={() => setAppStage("dashboard")}
                    variant="outline"
                    className="border-[#CBDDC7] text-[#1B3828] hover:bg-[#EAF3E8] px-5 py-3.5 rounded-full font-semibold text-xs transition cursor-pointer"
                  >
                    Jump to Dashboard →
                  </Button>
                </div>
              </div>

              {/* 3D Compass Graphic */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-xl border-4 border-white/80 bg-[#E8EFE5]/40 flex items-center justify-center group hover:scale-[1.02] transition duration-300">
                  <img
                    src="/studymatch-compass.jpg"
                    alt="StudyMatch Compass"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3828]/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bottom 3 Value Pillars */}
            <div className="mt-16 sm:mt-24 pt-8 border-t border-[#E3ECE1] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-stone-400">01</span>
                <h4 className="text-sm font-bold text-[#1B3828]">Discover</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Find what you already know and where you're stuck.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-stone-400">02</span>
                <h4 className="text-sm font-bold text-[#1B3828]">Match</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Get personalized resources for your needs.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-stone-400">03</span>
                <h4 className="text-sm font-bold text-[#1B3828]">Learn</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Follow a focused learning path.
                </p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ONBOARDING STAGE (5 Steps) */}
      {/* ========================================================================= */}
      {appStage === "onboarding" && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onBackToLanding={() => setAppStage("landing")}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. ADAPTIVE DIAGNOSTIC QUIZ STAGE */}
      {/* ========================================================================= */}
      {appStage === "quiz" && (
        <AdaptiveQuiz
          profile={profile}
          onComplete={handleQuizComplete}
          onCancel={() => setAppStage("onboarding")}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. QUIZ ANALYSIS & LEARNING GAPS STAGE */}
      {/* ========================================================================= */}
      {appStage === "analysis" && (
        <QuizAnalysis
          profile={profile}
          quizResults={{
            overallScore: profile.overallScore,
            skillScores: profile.skillScores,
            learningGaps: profile.learningGaps,
          }}
          onContinueToDashboard={() => {
            setAppStage("dashboard");
            setDashboardTab("overview");
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. MAIN STUDENT DASHBOARD */}
      {/* ========================================================================= */}
      {appStage === "dashboard" && (
        <div className="min-h-screen flex bg-[#F9FAF7]">
          {/* Dashboard Sidebar */}
          <Sidebar
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
            profile={profile}
            onOpenAuth={() => setAuthModalOpen(true)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Main Dashboard Panel */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Navigation Bar in Dashboard */}
            <header className="h-16 px-6 sm:px-8 border-b border-[#E2EAE0] bg-white/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 lg:hidden rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setAppStage("landing")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Landing Page</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E8] border border-[#D2E4CE] text-[#245435] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {profile.domain}: {profile.topic}
                </div>

                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-[#EAF3E8] text-[#1B3828] font-bold text-xs flex items-center justify-center border border-[#D0E2CC] cursor-pointer shadow-2xs"
                >
                  {profile.name.charAt(0).toUpperCase()}
                </button>
              </div>
            </header>

            {/* Dashboard Tab Content */}
            <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto overflow-y-auto">
              {dashboardTab === "overview" && (
                <OverviewTab
                  profile={profile}
                  resources={resources}
                  savedResourceIds={savedResourceIds}
                  onToggleSaveResource={handleToggleSaveResource}
                  onStartResource={handleStartResource}
                  onOpenWhyThis={(res) => setSelectedWhyThisResource(res)}
                />
              )}

              {dashboardTab === "mylearning" && (
                <MyLearningTab
                  profile={profile}
                  resources={resources}
                  onStartResource={handleStartResource}
                />
              )}

              {dashboardTab === "recommended" && (
                <RecommendedTab
                  resources={resources}
                  savedResourceIds={savedResourceIds}
                  onToggleSaveResource={handleToggleSaveResource}
                  onStartResource={handleStartResource}
                  onOpenWhyThis={(res) => setSelectedWhyThisResource(res)}
                />
              )}

              {dashboardTab === "assessments" && (
                <AssessmentsTab
                  onRetakeDiagnostic={() => setAppStage("quiz")}
                />
              )}

              {dashboardTab === "progress" && (
                <ProgressTab profile={profile} />
              )}

              {dashboardTab === "saved" && (
                <SavedTab
                  resources={resources}
                  savedResourceIds={savedResourceIds}
                  onToggleSaveResource={handleToggleSaveResource}
                  onStartResource={handleStartResource}
                  onOpenWhyThis={(res) => setSelectedWhyThisResource(res)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      {/* 1. Supabase Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        onAuthSuccess={(u) => {
          setUser(u);
          if (u) {
            setProfile((prev) => ({
              ...prev,
              name: u.user_metadata?.full_name || u.email?.split("@")[0] || prev.name,
            }));
          }
        }}
      />

      {/* 2. "Why This Resource?" Explanatory Modal */}
      <WhyThisModal
        resource={selectedWhyThisResource}
        isOpen={Boolean(selectedWhyThisResource)}
        onClose={() => setSelectedWhyThisResource(null)}
      />

      {/* 3. Resource Learning Player Modal */}
      <ResourceViewerModal
        isOpen={viewerModalOpen}
        onClose={() => {
          setViewerModalOpen(false);
          handleResourceFinished();
        }}
      />

      {/* 4. Adaptive Feedback Loop Modal */}
      <FeedbackModal
        resource={activeFeedbackResource}
        isOpen={Boolean(activeFeedbackResource)}
        onClose={() => setActiveFeedbackResource(null)}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </div>
  );
}