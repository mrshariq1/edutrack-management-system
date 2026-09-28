import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEduTrack } from '../context/EduTrackContext';
import { ASSETS } from '../assets';
import { SafeAvatar } from '../components/common/SafeAvatar';
import {
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, settings } = useEduTrack();

  const [email, setEmail] = useState('admin@edutrack.demo');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@edutrack.demo');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0F2747] text-slate-100">
      {/* LEFT COLUMN: Large Professional Education Visual & Branding */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-[#0F2747]">
        {/* Background Photo with measured scrim */}
        {!heroImageError ? (
          <img
            src={ASSETS.loginCampusHero}
            alt="Academy Architecture"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setHeroImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2747] via-[#1769E0]/40 to-[#0A1D36]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2747] via-[#0F2747]/80 to-[#0F2747]/40" />

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1769E0] text-white font-bold shadow-lg shadow-blue-900/50">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              EduTrack
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30">
                Enterprise MIS
              </span>
            </span>
            <span className="text-xs text-slate-200">
              Modern Education Management System
            </span>
          </div>
        </div>

        {/* Center/Bottom Highlight Card */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Commercial MIS · Production Edition</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight font-sans">
              Precision governance for modern schools & academies.
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed">
              Standardized registrar workflows, student roll call, tuition ledger reconciliation, and exam scheduling in a single unified SaaS platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-lg font-bold font-mono text-white block">100% Client-Side</span>
              <span className="text-xs text-slate-300">LocalStorage persistence</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-lg font-bold font-mono text-[#12B76A] block">Vercel Ready</span>
              <span className="text-xs text-slate-300">Fast zero-config deployment</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <SafeAvatar
              src={ASSETS.adminAvatar}
              alt="Arthur Sterling"
              size="md"
              priority
              className="ring-2 ring-white/20"
            />
            <div>
              <span className="text-xs font-bold text-white block">Dr. Arthur Sterling, Ph.D.</span>
              <span className="text-[11px] text-slate-300 block">Principal Registrar · Academic Directorate</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-300 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} EduTrack Platform. All rights reserved.</span>
          <span className="flex items-center gap-1 font-mono text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" /> Institutional Access
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Login Card */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white dark:bg-[#0B1321] text-[#172033] dark:text-slate-100 z-10">
        {/* Mobile brand header */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1769E0] text-white font-bold shadow-md shadow-blue-600/30">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              EduTrack MIS
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Education Management System
            </p>
          </div>
        </div>

        {/* Center: Sign In Form */}
        <div className="my-auto py-4">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2747] dark:text-white">
              Institutional Sign In
            </h1>
            <p className="text-xs text-[#667085] dark:text-slate-400 mt-1.5 leading-relaxed">
              Authenticate your administrative session to access campus registries and student rosters.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#EAF3FF] dark:bg-blue-950/40 border border-[#1769E0]/20 dark:border-blue-900/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#1769E0] text-white shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-[#0F2747] dark:text-blue-200 block">
                  Commercial Demo Profile
                </span>
                <span className="text-[11px] text-[#1769E0] dark:text-blue-300 font-mono block">
                  admin@edutrack.demo / admin123
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-3 py-1.5 rounded-lg bg-[#1769E0] hover:bg-[#0F2747] text-white text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edutrack.demo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E9F0] dark:border-slate-800 bg-[#F6F8FC] dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]/30 focus:border-[#1769E0] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[11px] text-[#1769E0] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E4E9F0] dark:border-slate-800 bg-[#F6F8FC] dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]/30 focus:border-[#1769E0] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E4E9F0] text-[#1769E0] focus:ring-[#1769E0]"
                />
                <span className="text-slate-600 dark:text-slate-400">Remember session credentials</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#1769E0] hover:bg-[#0F2747] text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-101 active:scale-99 mt-3 cursor-pointer"
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#E4E9F0] dark:border-slate-800 flex items-center justify-between text-[11px] text-[#667085] dark:text-slate-400">
          <span>{settings.institutionName || 'Oakridge Academy'}</span>
          <span className="flex items-center gap-1 font-mono text-[#12B76A] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Secure Session
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Administrative Password Assistance
            </h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              For client evaluation and live demo testing, the pre-provisioned administrator account password is:
            </p>

            <div className="p-3.5 rounded-xl bg-[#EAF3FF] dark:bg-slate-800 font-mono text-center font-bold text-[#0F2747] dark:text-white text-sm border border-[#1769E0]/20">
              admin123
            </div>

            <p className="text-[11px] text-slate-400">
              In commercial enterprise deployment, single sign-on (SSO) and SAML-2 authentication are integrated.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="px-4 py-2 bg-[#1769E0] text-white font-semibold rounded-xl hover:bg-[#0F2747] transition-colors cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

