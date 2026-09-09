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
import { motion } from "framer-motion";
import { BlurText, FloatingElement } from "../MotionEffects";

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
      <header className="h-16 px-4 sm:px-10 border-b border-[#E2EAE0] bg-white/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-900 transition cursor-pointer mr-1 sm:mr-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-base text-[#1B3828] leading-tight block">
              StudyMatch Plans
            </span>
            <span className="text-[10px] text-stone-400 block font-mono leading-none">
              AI → Teacher → Live
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex-1 w-full space-y-10 sm:space-y-12 min-w-0">
        {/* Title & Core Concept Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3E8] border border-[#CFE3CC] text-[#224A2E]">
            Flexible Learning Support
          </span>

          <BlurText
            text="Progressive support that grows with your doubts."
            as="h1"
            className="text-2xl sm:text-4xl font-bold text-[#162F22] tracking-tight break-words"
            delay={0.1}
            stagger={0.04}
          />

          <p className="text-xs sm:text-base text-stone-500 leading-relaxed max-w-lg mx-auto break-words">
            Get instant AI explanations when you need them. Connect to your teacher when AI isn&apos;t enough.
          </p>
        </div>

        {/* 3 Pricing Cards with Framer Motion Stagger and Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan === plan.id;
            const isPlus = plan.id === "PLUS";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: isPlus ? -8 : -5 }}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-shadow duration-300 relative min-w-0 ${
                  isPlus
                    ? "bg-white border-2 border-[#204A30] shadow-xl shadow-[#1B3828]/10 md:-translate-y-2"
                    : "bg-white/95 border border-[#E3EDE0] shadow-sm hover:shadow-md"
                }`}
              >
                {/* Most Popular Badge for PLUS */}
                {isPlus && (
                  <FloatingElement
                    duration={4}
                    yOffset={4}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10"
                  >
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#1B3828] text-white shadow-sm whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      {plan.badge}
                    </span>
                  </FloatingElement>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#1B3828] truncate">{plan.name}</h3>
                      {!isPlus && (
                        <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 break-words">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 pb-1 border-b border-[#E8EFE5]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#162F22]">
                        {plan.price}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">/{plan.period}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-semibold italic mt-1 break-words">
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
                        <li key={idx} className="flex items-start gap-2 min-w-0">
                          {feat.included ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 mt-0.5">
                              <XIcon className="w-2.5 h-2.5" />
                            </div>
                          )}
                          <span className={`break-words min-w-0 flex-1 ${feat.included ? "text-stone-700" : "text-stone-400"}`}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-6 mt-4 border-t border-[#E8EFE5]">
                  <motion.div whileTap={{ scale: 0.98 }}>
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
                  </motion.div>
                </div>
              </motion.div>
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
