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
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import PricingPage from "./components/Pricing/PricingPage";
import TeacherSessionModal from "./components/TeacherSessionModal";
import { socket } from "./lib/socket";
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
  GraduationCap,
  Zap,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  BlurText,
  FloatingElement,
  PageTransition,
  CardMotion,
} from "./components/MotionEffects";

const STAGE_ORDER = {
  landing: 0,
  onboarding: 1,
  quiz: 2,
  analysis: 3,
  dashboard: 4,
  pricing: 5,
  teacher: 6,
};

export default function App() {
  // Application Stage: 'landing' | 'onboarding' | 'quiz' | 'analysis' | 'dashboard' | 'teacher' | 'pricing'
  const [appStage, setAppStage] = useState("landing");
  const [transitionDirection, setTransitionDirection] = useState("right");
  const [pendingDoubtsCount, setPendingDoubtsCount] = useState(1);
  const [teacherSessionModalOpen, setTeacherSessionModalOpen] = useState(false);

  // Stage Navigation with Directional Detection (left / right with blur)
  const navigateStage = (newStage) => {
    const currentIdx = STAGE_ORDER[appStage] ?? 0;
    const newIdx = STAGE_ORDER[newStage] ?? 0;
    setTransitionDirection(newIdx >= currentIdx ? "right" : "left");
    setAppStage(newStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Real-time doubt escalation sync
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doubts/pending");
        const data = await res.json();
        if (data.success) {
          setPendingDoubtsCount(data.count || 0);
        }
      } catch {}
    };
    fetchPendingCount();

    const onEscalate = () => setPendingDoubtsCount((c) => c + 1);
    const onResolve = () => setPendingDoubtsCount((c) => Math.max(0, c - 1));

    socket.on("doubt:escalated", onEscalate);
    socket.on("teacher:response", onResolve);

    return () => {
      socket.off("doubt:escalated", onEscalate);
      socket.off("teacher:response", onResolve);
    };
  }, []);

  // 1. Onboarding Completed Handler
  const handleOnboardingComplete = (onboardingData) => {
    setProfile((prev) => ({
      ...prev,
      ...onboardingData,
    }));
    navigateStage("quiz");
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
    navigateStage("analysis");
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

  // 7. Subscription Plan Change Handler
  const handlePlanChange = (newPlan) => {
    setProfile((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        plan: newPlan,
        aiQuestionsRemaining: newPlan === "FREE" ? 12 : newPlan === "PLUS" ? 84 : Infinity,
        aiQuestionsTotal: newPlan === "FREE" ? 15 : newPlan === "PLUS" ? 100 : Infinity,
        teacherSupport: newPlan !== "FREE",
        videoSessions: newPlan === "PRO",
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFEFC] text-[#1B3828] font-sans selection:bg-[#EAF3E8] selection:text-[#1B3828]">
      {/* ========================================================================= */}
      {/* ANIMATED PAGE STAGE TRANSITIONS */}
      {/* ========================================================================= */}
      <AnimatePresence mode="wait">
        {/* 1. LANDING PAGE STAGE */}
        {appStage === "landing" && (
          <PageTransition key="landing" direction={transitionDirection} stageKey="landing">
            <div className="min-h-screen flex flex-col justify-between">
              {/* Landing Header */}
              <header className="px-4 sm:px-6 py-4 sm:py-5 max-w-5xl mx-auto w-full flex items-center justify-between border-b border-[#E3ECE1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center shadow-sm">
                    <Compass className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="font-bold text-base sm:text-lg text-[#1B3828] tracking-tight">
                    StudyMatch
                  </span>
                </div>

                <nav className="flex items-center gap-2.5 sm:gap-5">
                  <button
                    onClick={() => navigateStage("onboarding")}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer hidden md:inline-block"
                  >
                    How it works
                  </button>
                  <button
                    onClick={() => navigateStage("dashboard")}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer hidden sm:inline-block"
                  >
                    Dashboard Demo
                  </button>
                  <button
                    onClick={() => navigateStage("pricing")}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-950 transition cursor-pointer px-2 py-1 rounded-lg hover:bg-stone-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Plans</span>
                  </button>
                  <button
                    onClick={() => navigateStage("teacher")}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF3E8] border border-[#D0E3CD] text-[#1B3828] hover:bg-[#DEEDE0] transition cursor-pointer shadow-2xs shrink-0"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Teacher Portal</span>
                    {pendingDoubtsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {pendingDoubtsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
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
              <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex-1 w-full flex flex-col justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    {/* Word Blur Animated Heading */}
                    <BlurText
                      text="Your learning adventure starts here."
                      as="h1"
                      className="text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#162F22] tracking-tight leading-[1.12] break-words"
                      delay={0.08}
                      stagger={0.05}
                    />

                    {/* Word Blur Animated Subtitle */}
                    <BlurText
                      text="Find what you need to learn next — not just another list of resources."
                      as="p"
                      className="text-base sm:text-lg text-stone-500 max-w-md font-normal leading-relaxed break-words"
                      delay={0.25}
                      stagger={0.025}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="pt-2 flex flex-wrap items-center gap-3"
                    >
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          onClick={() => navigateStage("onboarding")}
                          className="bg-[#1B3828] hover:bg-[#122A1E] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group"
                        >
                          Start your quest
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => navigateStage("dashboard")}
                          variant="outline"
                          className="border-[#CBDDC7] text-[#1B3828] hover:bg-[#EAF3E8] px-5 py-3.5 rounded-full font-semibold text-xs transition cursor-pointer"
                        >
                          Jump to Dashboard →
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* 3D Compass Graphic with Floating Things */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end relative py-4">
                    {/* Ambient Glow Orb */}
                    <motion.div
                      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      className="absolute w-64 h-64 rounded-full bg-emerald-200/50 blur-3xl -z-10 pointer-events-none"
                    />

                    <div className="relative">
                      {/* Floating Badge 1: Top Left */}
                      <FloatingElement
                        duration={4.2}
                        yOffset={8}
                        rotate={1.2}
                        className="absolute -top-3 -left-3 sm:-left-6 z-20 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#D5E6D2] shadow-lg text-[11px] font-bold text-[#1B3828] flex items-center gap-1.5 backdrop-blur-md"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="whitespace-nowrap">98% ML Match Rate</span>
                      </FloatingElement>

                      {/* Floating Badge 2: Bottom Right */}
                      <FloatingElement
                        duration={4.8}
                        yOffset={9}
                        rotate={-1.5}
                        delay={0.5}
                        className="absolute -bottom-3 -right-3 sm:-right-6 z-20 px-3.5 py-1.5 rounded-full bg-[#1B3828] text-white shadow-xl text-[11px] font-bold flex items-center gap-1.5 border border-white/20"
                      >
                        <Zap className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span className="whitespace-nowrap">Faculty Escalation</span>
                      </FloatingElement>

                      {/* Main Floating 3D Compass Graphic */}
                      <FloatingElement
                        duration={5.2}
                        yOffset={12}
                        rotate={1}
                        className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-[#E8EFE5]/50 flex items-center justify-center group"
                      >
                        <img
                          src="/studymatch-compass.jpg"
                          alt="StudyMatch Compass"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1B3828]/15 via-transparent to-transparent pointer-events-none" />
                      </FloatingElement>
                    </div>
                  </div>
                </div>

                {/* Bottom 3 Value Pillars with Motion */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.45 }}
                  className="mt-14 sm:mt-20 pt-8 border-t border-[#E3ECE1] grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                >
                  <CardMotion hoverY={-2} scaleOnHover={1.01} className="space-y-1 p-3 rounded-2xl hover:bg-[#F3F8F2]/60 transition">
                    <span className="text-xs font-mono font-bold text-stone-400">01</span>
                    <h4 className="text-sm font-bold text-[#1B3828]">Discover</h4>
                    <p className="text-xs text-stone-500 leading-relaxed break-words">
                      Find what you already know and where you're stuck.
                    </p>
                  </CardMotion>

                  <CardMotion hoverY={-2} scaleOnHover={1.01} className="space-y-1 p-3 rounded-2xl hover:bg-[#F3F8F2]/60 transition">
                    <span className="text-xs font-mono font-bold text-stone-400">02</span>
                    <h4 className="text-sm font-bold text-[#1B3828]">Match</h4>
                    <p className="text-xs text-stone-500 leading-relaxed break-words">
                      Get personalized resources for your needs.
                    </p>
                  </CardMotion>

                  <CardMotion hoverY={-2} scaleOnHover={1.01} className="space-y-1 p-3 rounded-2xl hover:bg-[#F3F8F2]/60 transition">
                    <span className="text-xs font-mono font-bold text-stone-400">03</span>
                    <h4 className="text-sm font-bold text-[#1B3828]">Learn</h4>
                    <p className="text-xs text-stone-500 leading-relaxed break-words">
                      Follow a focused learning path.
                    </p>
                  </CardMotion>
                </motion.div>
              </main>
            </div>
          </PageTransition>
        )}

        {/* 2. ONBOARDING STAGE */}
        {appStage === "onboarding" && (
          <PageTransition key="onboarding" direction={transitionDirection} stageKey="onboarding">
            <OnboardingFlow
              onComplete={handleOnboardingComplete}
              onBackToLanding={() => navigateStage("landing")}
            />
          </PageTransition>
        )}

        {/* 3. ADAPTIVE DIAGNOSTIC QUIZ STAGE */}
        {appStage === "quiz" && (
          <PageTransition key="quiz" direction={transitionDirection} stageKey="quiz">
            <AdaptiveQuiz
              profile={profile}
              onComplete={handleQuizComplete}
              onCancel={() => navigateStage("onboarding")}
            />
          </PageTransition>
        )}

        {/* 4. QUIZ ANALYSIS & LEARNING GAPS STAGE */}
        {appStage === "analysis" && (
          <PageTransition key="analysis" direction={transitionDirection} stageKey="analysis">
            <QuizAnalysis
              profile={profile}
              quizResults={{
                overallScore: profile.overallScore,
                skillScores: profile.skillScores,
                learningGaps: profile.learningGaps,
              }}
              onContinueToDashboard={() => {
                navigateStage("dashboard");
                setDashboardTab("overview");
              }}
            />
          </PageTransition>
        )}

        {/* 5. MAIN STUDENT DASHBOARD */}
        {appStage === "dashboard" && (
          <PageTransition key="dashboard" direction={transitionDirection} stageKey="dashboard">
            <div className="min-h-screen flex bg-[#F9FAF7]">
              {/* Dashboard Sidebar */}
              <Sidebar
                activeTab={dashboardTab}
                onTabChange={setDashboardTab}
                profile={profile}
                onOpenAuth={() => setAuthModalOpen(true)}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() => setMobileSidebarOpen(false)}
                onOpenTeacherPortal={() => navigateStage("teacher")}
                pendingDoubtsCount={pendingDoubtsCount}
                onOpenPricing={() => navigateStage("pricing")}
              />

              {/* Main Dashboard Panel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navigation Bar in Dashboard */}
                <header className="h-16 px-4 sm:px-8 border-b border-[#E2EAE0] bg-white/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setMobileSidebarOpen(true)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 lg:hidden rounded-lg cursor-pointer"
                    >
                      <Menu className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => navigateStage("landing")}
                      className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Landing Page</span>
                      <span className="sm:hidden">Home</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => navigateStage("pricing")}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAFBF9] border border-[#D5E1D2] text-[#1B3828] hover:bg-[#EEF4ED] transition cursor-pointer shadow-2xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">Plans</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {profile?.subscription?.plan || "FREE"}
                      </span>
                    </button>

                    <button
                      onClick={() => navigateStage("teacher")}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF3E8] border border-[#D0E3CD] text-[#1B3828] hover:bg-[#DEEDE0] transition cursor-pointer shadow-2xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden md:inline">Teacher Portal</span>
                      {pendingDoubtsCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {pendingDoubtsCount}
                        </span>
                      )}
                    </button>

                    <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3E8] border border-[#D2E4CE] text-[#245435] text-xs font-semibold max-w-[200px] truncate">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{profile.domain}: {profile.topic}</span>
                    </div>

                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="w-8 h-8 rounded-full bg-[#EAF3E8] text-[#1B3828] font-bold text-xs flex items-center justify-center border border-[#D0E2CC] cursor-pointer shadow-2xs shrink-0"
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </button>
                  </div>
                </header>

                {/* Dashboard Tab Content with Animated Blur Transition */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto overflow-y-auto min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dashboardTab}
                      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full min-w-0"
                    >
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
                          onRetakeDiagnostic={() => navigateStage("quiz")}
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
                    </motion.div>
                  </AnimatePresence>
                </main>
              </div>
            </div>
          </PageTransition>
        )}

        {/* 6. TEACHER DASHBOARD PORTAL */}
        {appStage === "teacher" && (
          <PageTransition key="teacher" direction={transitionDirection} stageKey="teacher">
            <TeacherDashboard onBackToStudent={() => navigateStage("dashboard")} />
          </PageTransition>
        )}

        {/* 7. SUBSCRIPTION PRICING PAGE */}
        {appStage === "pricing" && (
          <PageTransition key="pricing" direction={transitionDirection} stageKey="pricing">
            <PricingPage
              currentPlan={profile?.subscription?.plan || "FREE"}
              onSelectPlan={(plan) => handlePlanChange(plan)}
              onBack={() => navigateStage("dashboard")}
            />
          </PageTransition>
        )}
      </AnimatePresence>

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

      {/* 3. Resource Learning Player Modal (Split View: Resource + StudyMatch AI Tutor) */}
      <ResourceViewerModal
        isOpen={viewerModalOpen}
        topic={profile.topic || "Linear Regression"}
        learnerProfile={profile}
        onClose={() => {
          setViewerModalOpen(false);
          handleResourceFinished();
        }}
        onDoubtEscalated={() => {
          setPendingDoubtsCount((c) => c + 1);
        }}
        onOpenPricing={() => {
          setViewerModalOpen(false);
          setAppStage("pricing");
        }}
        onOpenTeacherSession={() => {
          setTeacherSessionModalOpen(true);
        }}
      />

      {/* 4. Adaptive Feedback Loop Modal */}
      <FeedbackModal
        resource={activeFeedbackResource}
        isOpen={Boolean(activeFeedbackResource)}
        onClose={() => setActiveFeedbackResource(null)}
        onSubmitFeedback={handleSubmitFeedback}
      />

      {/* 5. Future Video Call UI Modal (Pro Tier Preview) */}
      <TeacherSessionModal
        isOpen={teacherSessionModalOpen}
        onClose={() => setTeacherSessionModalOpen(false)}
      />
    </div>
  );
}