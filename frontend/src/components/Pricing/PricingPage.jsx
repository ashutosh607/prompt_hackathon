import { useState } from "react";
import {
  Check,
  X as XIcon,
  Sparkles,
  ArrowRight,
  Compass,
  GraduationCap,
  Video,
  ChevronLeft,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { PLANS_DATA } from "../../data/curriculumData";

export default function PricingPage({ currentPlan = "FREE", onSelectPlan, onBack }) {
  const [activePlan, setActivePlan] = useState(currentPlan);

  const plans = [
    PLANS_DATA.FREE,
    PLANS_DATA.PLUS,
    PLANS_DATA.PRO,
  ];

  const handlePlanClick = (planId) => {
    setActivePlan(planId);
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1B3828] flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 sm:px-10 border-b border-[#E2EAE0] bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center">
            <Compass className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-[#1B3828]">
              StudyMatch Plans
            </span>
            <span className="text-[10px] text-stone-400 block font-mono">
              AI → Teacher → Live Teacher
            </span>
          </div>
        </div>

        {/* Live Active Plan Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline">Active Plan:</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3E8] border border-[#CFE3CC] text-[#1E482E]">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {currentPlan}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16 flex-1 w-full space-y-12">
        {/* Title & Core Concept Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3E8] border border-[#CFE3CC] text-[#224A2E]">
            Flexible Learning Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#162F22] tracking-tight">
            Progressive support that grows with your doubts.
          </h1>
          <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
            Get instant AI explanations when you need them. Connect to your teacher when AI isn&apos;t enough.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isPlus = plan.id === "PLUS";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                  isPlus
                    ? "bg-white border-2 border-[#204A30] shadow-xl shadow-[#1B3828]/5 sm:-translate-y-2"
                    : "bg-white/90 border border-[#E3EDE0] shadow-sm hover:shadow-md"
                }`}
              >
                {/* Most Popular Badge for PLUS */}
                {isPlus && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#1B3828] text-white shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#1B3828]">{plan.name}</h3>
                      {!isPlus && (
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-1 border-b border-[#E8EFE5]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#162F22]">
                        {plan.price}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">/{plan.period}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-semibold italic mt-1">
                      &quot;{plan.usp}&quot;
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      What&apos;s Included:
                    </span>
                    <ul className="space-y-2 text-xs">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          {feat.included ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 mt-0.5">
                              <XIcon className="w-2.5 h-2.5" />
                            </div>
                          )}
                          <span className={feat.included ? "text-stone-700" : "text-stone-400"}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-4 border-t border-[#E8EFE5]">
                  <Button
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full rounded-full py-2.5 text-xs font-semibold cursor-pointer transition shadow-xs ${
                      isCurrent
                        ? "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-300"
                        : isPlus
                        ? "bg-[#1B3828] hover:bg-[#12291C] text-white shadow-md"
                        : "bg-[#EAF3E8] hover:bg-[#DDEEE0] text-[#1E4A2E] border border-[#CFE4CD]"
                    }`}
                  >
                    {isCurrent
                      ? "✓ Current Plan"
                      : plan.id === "PRO"
                      ? "Switch to Pro (Preview)"
                      : plan.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progression Explanation Banner */}
        <div className="p-6 rounded-3xl bg-[#F4F9F2] border border-[#DAE8D6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 font-mono">TIER 1</span>
            <h4 className="text-xs font-bold text-[#1B3828]">1. Learn with AI</h4>
            <p className="text-[11px] text-stone-500">
              Clear standard conceptual doubts and receive ML-guided study advice.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 font-mono">TIER 2</span>
            <h4 className="text-xs font-bold text-[#1B3828]">2. Teacher Escalation</h4>
            <p className="text-[11px] text-stone-500">
              When AI reaches its limit, doubts auto-route to human faculty without guesswork.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 font-mono">TIER 3</span>
            <h4 className="text-xs font-bold text-[#1B3828]">3. Live 1-on-1 Sessions</h4>
            <p className="text-[11px] text-stone-500">
              Scheduled face-to-face video reviews for deep mastery and project feedback.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
