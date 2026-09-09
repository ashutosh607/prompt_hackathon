import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { X, User, Mail, Lock, LogOut, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [academicLevel, setAcademicLevel] = useState("Undergraduate");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              academic_level: academicLevel,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          setSuccessMsg("Account created and signed in!");
          if (onAuthSuccess) onAuthSuccess(data.user);
          setTimeout(onClose, 1000);
        } else {
          setSuccessMsg("Check your inbox to verify your email address!");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Welcome back!");
        if (onAuthSuccess) onAuthSuccess(data.user);
        setTimeout(onClose, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    if (onAuthSuccess) onAuthSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FDFEFC] border border-[#E5ECE3] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-[#1B3828]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          /* Profile Details View */
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF2E8] border-2 border-[#D4E4D0] flex items-center justify-center text-[#234A34]">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1B3828]">
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner"}
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-mono">{user.email}</p>
            </div>

            <div className="bg-[#F4F8F3] rounded-2xl p-4 text-left border border-[#E2EFE0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Status</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Authenticated
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Academic Level</span>
                <span className="font-medium text-stone-700">
                  {user.user_metadata?.academic_level || "College / Self-Study"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Learning Quests</span>
                <span className="font-semibold text-stone-700">1 Active</span>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              disabled={loading}
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-full py-2.5 cursor-pointer font-medium text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          /* Sign In / Sign Up View */
          <div className="space-y-5">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3E9] text-[#2C573C] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                StudyMatch Account
              </div>
              <h3 className="text-2xl font-bold text-[#1B3828]">
                {isSignUp ? "Begin Your Journey" : "Welcome Back"}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {isSignUp
                  ? "Save your personalized learning maps and track understanding."
                  : "Sign in to access your curated quest paths."}
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="flex p-1 bg-[#F1F5EF] rounded-full border border-[#E1EAE0]">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg("");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition ${
                  !isSignUp
                    ? "bg-white text-[#1B3828] shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg("");
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition ${
                  isSignUp
                    ? "bg-white text-[#1B3828] shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3.5">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-[#DCE5DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C573C] text-stone-900 placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">
                      Academic Level
                    </label>
                    <select
                      value={academicLevel}
                      onChange={(e) => setAcademicLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DCE5DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C573C] text-stone-900"
                    >
                      <option value="High School">High School</option>
                      <option value="Undergraduate">College / Undergraduate</option>
                      <option value="Graduate">Graduate / Researcher</option>
                      <option value="Self-Directed">Self-Directed Learner</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-[#DCE5DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C573C] text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-[#DCE5DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C573C] text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3828] hover:bg-[#132A1D] text-white py-3 rounded-full text-sm font-semibold transition cursor-pointer shadow-md mt-2"
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? "Create StudyMatch Account →"
                  : "Sign In →"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
