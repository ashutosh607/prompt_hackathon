import { useState } from "react";
import {
  Video,
  Calendar,
  Clock,
  User,
  Sparkles,
  X,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";

export default function TeacherSessionModal({ isOpen, onClose }) {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#FDFEFC] border border-[#E2EBE0] rounded-3xl shadow-2xl overflow-hidden p-6 text-[#1B3828] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EDE3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1B3828] text-white flex items-center justify-center text-xs">
              <Video className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1B3828]">
                  1-on-1 Teacher Session
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> StudyMatch Pro
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Face-to-face conceptual deep dive & project guidance
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setInCall(false);
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!inCall ? (
          /* Upcoming Session Preview Card */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F5F8F3] border border-[#DDE7DA] space-y-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Your Upcoming Session
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1B3828] text-white flex items-center justify-center font-bold text-sm">
                  PS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1B3828]">Prof. Sharma</h4>
                  <p className="text-xs text-stone-500">
                    Lead Faculty • Machine Learning & Statistics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E1ECE0] text-xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tomorrow, Sept 10</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4:00 PM – 4:45 PM</span>
                </div>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive screen sharing & custom dataset reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct clarification on difficult math proofs and derivations</span>
              </div>
            </div>

            {/* Status notice */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Roadmap Feature:</strong> Live WebRTC video calling will officially launch in the Pro rollout. Try the prototype preview below!
              </span>
            </div>

            <Button
              onClick={() => setInCall(true)}
              className="w-full bg-[#1B3828] hover:bg-[#132A1D] text-white rounded-full py-2.5 text-xs font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-300" />
              Join Video Session Preview →
            </Button>
          </div>
        ) : (
          /* Simulated Video Call Screen */
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl bg-stone-950 overflow-hidden relative shadow-lg flex flex-col justify-between p-4 text-white">
              <div className="flex justify-between items-center text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 font-semibold text-[10px]">
                  ● Live • 02:45
                </span>
                <span className="text-[11px] text-stone-300 font-medium">
                  Prof. Sharma & Aarav
                </span>
              </div>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-800/80 border-2 border-emerald-400 flex items-center justify-center text-white text-lg font-bold">
                  PS
                </div>
                <div>
                  <p className="font-bold text-sm">Prof. Sharma</p>
                  <p className="text-[10px] text-emerald-300">
                    &quot;Let&apos;s look at how removing that outlier point pivots your regression line...&quot;
                  </p>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition ${
                    micOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition ${
                    camOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setInCall(false)}
                  className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                  title="Leave Session"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 text-center">
              Video sessions are coming soon to StudyMatch Pro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
