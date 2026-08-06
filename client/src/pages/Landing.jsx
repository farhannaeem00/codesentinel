import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Shield, Code, Zap, ArrowRight, CheckCircle,
  AlertTriangle, Lock, GitBranch, Globe, Mail,
  ChevronRight, Menu, X, Sparkles, ExternalLink,
  Eye, Bug, ShieldAlert, Terminal
} from 'lucide-react';

// ── Noise Texture ─────────────────────────────────────
const Noise = () => (
  <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.015]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
    }} />
);

// ── Counter ───────────────────────────────────────────
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const duration = 2000;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── Navbar ────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-0' : 'py-3'
      }`}>
        {/* Announcement */}
        <div className={`w-full bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-indigo-600/90
                         text-white text-xs font-medium text-center py-2 px-4
                         transition-all duration-500
                         ${scrolled ? 'opacity-0 -translate-y-full h-0 py-0 overflow-hidden' : 'opacity-100'}`}>
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={12} />
            Scan any GitHub repo for security vulnerabilities — free
            <ChevronRight size={12} />
          </span>
        </div>

        {/* Main nav */}
        <div className={`transition-all duration-500 ${
          scrolled
            ? 'mx-4 mt-3 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/50'
            : 'bg-transparent'
        }`}>
          <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                                opacity-80 group-hover:opacity-100 transition-opacity blur-sm scale-110" />
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                                flex items-center justify-center">
                  <Shield size={15} className="text-white" />
                </div>
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">
                Code<span className="text-violet-400">Sentinel</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {['Features', 'How it works', 'Pricing', 'Docs'].map(link => (
                <a key={link} href="#"
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white
                             hover:bg-white/5 rounded-lg transition-all duration-200">
                  {link}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
                Sign in
              </Link>
              <Link to="/register"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl
                           text-sm font-semibold text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600
                                group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300" />
                <span className="relative z-10">Get started free</span>
                <ArrowRight size={14} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center
                         rounded-lg bg-white/5 border border-white/8 text-slate-400">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden mx-4 mt-2 rounded-2xl bg-[#0f0f1a]/95 backdrop-blur-2xl
                         border border-white/8 overflow-hidden transition-all duration-300
                         ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 flex flex-col gap-1">
            {['Features', 'How it works', 'Pricing', 'Docs'].map(link => (
              <a key={link} href="#"
                className="px-4 py-2.5 text-sm text-slate-400 hover:text-white
                           hover:bg-white/5 rounded-xl transition-all duration-200">
                {link}
              </a>
            ))}
            <div className="border-t border-white/8 mt-2 pt-3 flex flex-col gap-2">
              <Link to="/login" className="px-4 py-2.5 text-sm text-slate-400 text-center">Sign in</Link>
              <Link to="/register"
                className="px-4 py-2.5 text-sm font-semibold text-white text-center
                           bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        .gradient-text-animated {
          background: linear-gradient(270deg, #a78bfa, #c084fc, #818cf8, #a78bfa);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.34,1.56,0.64,1) both; }
        .animate-slide-up-1 { animation: slide-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.15s both; }
        .animate-slide-up-2 { animation: slide-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s both; }
        .animate-slide-up-3 { animation: slide-up 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.45s both; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 8s ease-in-out 1s infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .card-hover {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(139,92,246,0.1);
        }
        .glow-violet { box-shadow: 0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.15); }
        .code-line { font-family: 'Courier New', monospace; }
      `}</style>
    </>
  );
};

// ── Hero ──────────────────────────────────────────────
const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center
                        overflow-hidden bg-[#0a0a0f] pt-32">

      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full
                        bg-violet-600/20 blur-[130px] animate-float" />
        <div className="absolute -top-20 right-1/4 w-[400px] h-[400px] rounded-full
                        bg-purple-600/15 blur-[120px] animate-float-delay" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                        bg-indigo-800/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full
                        bg-violet-500/8 blur-[80px] pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))` }} />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
        }} />

      {/* Rotating rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[800px] rounded-full border border-violet-500/5
                      animate-spin-slow pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="animate-slide-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                        bg-white/4 border border-white/10 text-sm font-medium mb-8
                        backdrop-blur-sm cursor-default">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">New</span>
          <div className="w-px h-3.5 bg-white/15" />
          <span className="text-slate-300">AI-powered code security scanning</span>
          <ChevronRight size={14} className="text-slate-500" />
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up-1 text-[clamp(40px,7vw,80px)] font-bold
                       tracking-tight leading-[1.05] mb-6 text-white">
          Find vulnerabilities
          <br />
          <span className="gradient-text-animated">before attackers do.</span>
        </h1>

        <p className="animate-slide-up-2 text-lg sm:text-xl text-slate-400
                      max-w-2xl mx-auto leading-relaxed mb-10">
          Paste any GitHub repo URL and get an instant AI security audit —
          SQL injection, XSS, hardcoded secrets, and 20+ vulnerability types
          detected in seconds.
        </p>

        {/* CTAs */}
        <div className="animate-slide-up-3 flex items-center justify-center gap-4 flex-wrap mb-6">
          <Link to="/register"
            className="group relative flex items-center gap-2.5 px-8 py-4 rounded-2xl
                       text-base font-semibold text-white overflow-hidden
                       glow-violet transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600
                            group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300" />
            <span className="relative z-10">Scan your repo — it's free</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl
                       text-base font-medium text-slate-300
                       bg-white/4 hover:bg-white/8 border border-white/8
                       hover:border-white/15 transition-all duration-300 backdrop-blur-sm">
            Sign in
            <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-16">
          {[
            { icon: <Lock size={12} />, text: 'No code stored' },
            { icon: <Zap size={12} />, text: '< 60 seconds' },
            { icon: <CheckCircle size={12} />, text: 'No credit card' },
            { icon: <GitBranch size={12} />, text: 'Any GitHub repo' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-slate-600">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Mock terminal card */}
        <div className="animate-float relative max-w-2xl mx-auto">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/15 via-purple-500/15
                          to-indigo-500/15 rounded-3xl blur-2xl" />
          <div className="relative bg-[#0d0d18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-white/2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1 rounded-md
                                bg-white/4 border border-white/6 text-xs text-slate-500">
                  <div className="w-3 h-3 rounded-sm bg-violet-500/60 flex items-center justify-center">
                    <Shield size={8} className="text-white" />
                  </div>
                  codesentinel.app/scan
                </div>
              </div>
            </div>

            {/* Input row */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3 bg-white/3 border border-white/8
                              rounded-xl px-4 py-3">
                <GitBranch size={16} className="text-slate-500 shrink-0" />
                <span className="text-sm text-slate-300 font-mono">
                  github.com/company/backend-api
                </span>
                <div className="ml-auto flex items-center gap-2 bg-violet-600 text-white
                                text-xs font-semibold px-3 py-1.5 rounded-lg">
                  <Zap size={12} />
                  Scanning...
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-semibold text-red-400">3 Critical</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400 ml-2" />
                  <span className="text-xs font-semibold text-amber-400">5 Warnings</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 ml-2" />
                  <span className="text-xs font-semibold text-emerald-400">12 Passed</span>
                </div>
                <span className="text-xs text-slate-600">47 files scanned</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { sev: 'CRITICAL', color: 'bg-red-500/10 border-red-500/20 text-red-400', file: 'auth/login.js:42', msg: 'SQL injection via unsanitized user input in query string' },
                  { sev: 'CRITICAL', color: 'bg-red-500/10 border-red-500/20 text-red-400', file: '.env:15', msg: 'Hardcoded AWS secret key exposed in repository' },
                  { sev: 'WARNING',  color: 'bg-amber-500/8 border-amber-500/20 text-amber-400', file: 'api/users.js:88', msg: 'Missing input validation — XSS attack vector possible' },
                  { sev: 'INFO',     color: 'bg-blue-500/8 border-blue-500/15 text-blue-400', file: 'middleware/auth.js:12', msg: 'JWT secret falls back to weak default value' },
                ].map((item, i) => (
                  <div key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border
                                ${item.color} transition-transform hover:scale-[1.01] cursor-default`}>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                                      mt-0.5 border ${item.color}`}>
                      {item.sev}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500 mb-0.5">{item.file}</div>
                      <div className="text-xs text-slate-300 leading-relaxed">{item.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-12 top-1/3 animate-float-delay hidden lg:block">
            <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl px-4 py-3
                            shadow-xl shadow-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/20
                                flex items-center justify-center">
                  <AlertTriangle size={14} className="text-red-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">SQL Injection</div>
                  <div className="text-[10px] text-slate-500">Critical severity</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-10 bottom-1/3 animate-float hidden lg:block">
            <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl px-4 py-3
                            shadow-xl shadow-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20
                                flex items-center justify-center">
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Scan complete</div>
                  <div className="text-[10px] text-slate-500">52 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Stats ─────────────────────────────────────────────
const Stats = () => (
  <section className="relative py-20 overflow-hidden">
    <div className="absolute inset-y-0 left-0 right-0 border-y border-white/5" />
    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/4 via-purple-600/4 to-indigo-600/4" />
    <div className="relative max-w-5xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { end: 50000, suffix: '+', label: 'Repos scanned', color: 'text-violet-400' },
          { end: 20, suffix: '+', label: 'Vuln types detected', color: 'text-purple-400' },
          { end: 60, suffix: 's', label: 'Avg scan time', color: 'text-indigo-400' },
          { end: 98, suffix: '%', label: 'Detection accuracy', color: 'text-cyan-400' },
        ].map((stat, i) => (
          <div key={i} className="text-center group cursor-default">
            <div className={`text-4xl font-bold mb-1.5 ${stat.color}
                            group-hover:scale-110 transition-transform duration-300 inline-block`}>
              <Counter end={stat.end} suffix={stat.suffix} />
            </div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Features ──────────────────────────────────────────
const Features = () => {
  const features = [
    {
      icon: <Bug size={22} />, gradient: 'from-red-500 to-rose-600',
      glow: 'rgba(239,68,68,0.2)', title: 'SQL Injection Detection',
      desc: 'Finds unsanitized queries, ORM misuse, and parameterization failures before they become breaches.',
    },
    {
      icon: <Eye size={22} />, gradient: 'from-amber-500 to-orange-600',
      glow: 'rgba(245,158,11,0.2)', title: 'XSS Vulnerability Scanner',
      desc: 'Detects reflected, stored, and DOM-based cross-site scripting attack vectors across your codebase.',
    },
    {
      icon: <Lock size={22} />, gradient: 'from-violet-500 to-purple-600',
      glow: 'rgba(139,92,246,0.2)', title: 'Secrets Detection',
      desc: 'Finds hardcoded API keys, passwords, tokens, and credentials exposed in your repository.',
    },
    {
      icon: <ShieldAlert size={22} />, gradient: 'from-blue-500 to-indigo-600',
      glow: 'rgba(59,130,246,0.2)', title: 'Auth & Session Flaws',
      desc: 'Identifies weak JWT configurations, broken authentication flows, and session management issues.',
    },
    {
      icon: <Code size={22} />, gradient: 'from-emerald-500 to-teal-600',
      glow: 'rgba(16,185,129,0.2)', title: 'Dependency Analysis',
      desc: 'Scans package.json and requirements.txt for known vulnerable dependencies.',
    },
    {
      icon: <Terminal size={22} />, gradient: 'from-pink-500 to-rose-600',
      glow: 'rgba(236,72,153,0.2)', title: 'AI-Powered Analysis',
      desc: 'Groq LLaMA3 reads your code like a senior security engineer and explains every finding clearly.',
    },
  ];

  return (
    <section className="bg-[#0a0a0f] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-violet-500/8 border border-violet-500/15
                          text-violet-400 text-xs font-semibold uppercase tracking-widest mb-5">
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
            Everything a{' '}
            <span className="gradient-text-animated">security audit</span>
            {' '}covers
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            From SQL injection to hardcoded secrets — CodeSentinel covers
            20+ vulnerability types with AI-powered explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="card-hover group relative bg-[#0d0d18] border border-white/6
                         rounded-2xl p-6 cursor-default overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                              transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${f.glow}, transparent 70%)` }} />
              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient}
                               flex items-center justify-center text-white mb-5 shadow-lg
                               group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
                <div className="absolute inset-0 rounded-xl bg-white/10" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2.5">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${f.gradient}
                               opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── How It Works ──────────────────────────────────────
const HowItWorks = () => (
  <section className="bg-[#0a0a0f] py-28 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[400px] bg-violet-900/8 blur-[100px] rounded-full" />
    </div>
    <div className="relative max-w-5xl mx-auto px-6">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                        bg-purple-500/8 border border-purple-500/15
                        text-purple-400 text-xs font-semibold uppercase tracking-widest mb-5">
          How it works
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Scan in{' '}
          <span className="gradient-text-animated">three simple steps</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="absolute top-12 left-[calc(33%+24px)] right-[calc(33%+24px)] h-px
                        bg-gradient-to-r from-violet-500/40 via-purple-500/40 to-violet-500/40
                        hidden md:block" />

        {[
          {
            icon: <GitBranch size={24} />, gradient: 'from-violet-600 to-violet-700',
            glow: 'shadow-violet-500/40', title: 'Paste repo URL',
            desc: 'Enter any public GitHub repository URL. No installation, no tokens required.',
          },
          {
            icon: <Zap size={24} />, gradient: 'from-purple-600 to-indigo-700',
            glow: 'shadow-purple-500/40', title: 'AI scans every file',
            desc: 'Our AI reads every file in the repo, detecting 20+ vulnerability patterns in seconds.',
          },
          {
            icon: <Shield size={24} />, gradient: 'from-indigo-600 to-violet-700',
            glow: 'shadow-indigo-500/40', title: 'Get your security report',
            desc: 'Receive a detailed report with severity levels, file locations, and fix recommendations.',
          },
        ].map((item, i) => (
          <div key={i} className="relative group text-center">
            <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl
                             bg-gradient-to-br ${item.gradient}
                             flex items-center justify-center text-white
                             shadow-xl ${item.glow}
                             group-hover:scale-110 transition-transform duration-300`}>
              <div className="absolute inset-0 rounded-2xl bg-white/10" />
              <span className="relative z-10">{item.icon}</span>
              <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full
                              bg-[#0a0a0f] border border-white/15
                              flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────
const CTA = () => (
  <section className="bg-[#0a0a0f] py-28">
    <div className="max-w-4xl mx-auto px-6">
      <div className="relative rounded-3xl overflow-hidden border border-white/8">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(168,85,247,0.15), rgba(99,102,241,0.15))' }} />
        <div className="absolute inset-0 bg-[#0a0a0f]/60" />
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-violet-600/25 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-600/25 blur-[80px]" />
        <div className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }} />

        <div className="relative px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-white/6 border border-white/10 text-slate-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Free for public repositories
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5">
            Is your code
            <br />
            <span className="gradient-text-animated">really secure?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
            Most vulnerabilities are found by attackers before developers.
            Be the first to know.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="group relative flex items-center gap-2.5 px-9 py-4 rounded-2xl
                         text-base font-bold text-white overflow-hidden
                         shadow-2xl shadow-violet-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600
                              group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300" />
              <span className="relative z-10">Scan your repo now — free</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            {['No credit card', 'Public repos free', 'Instant results'].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle size={12} className="text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[#0a0a0f] border-t border-white/5">
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                              opacity-60 blur-sm scale-110" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center">
                <Shield size={17} className="text-white" />
              </div>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Code<span className="text-violet-400">Sentinel</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
            AI-powered security scanning for developers who care about
            shipping safe code.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: <GitBranch size={16} />, href: 'https://github.com/farhannaeem00' },
              { icon: <Globe size={16} />, href: '#' },
              { icon: <Mail size={16} />, href: '#' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/4 border border-white/8
                           flex items-center justify-center text-slate-400
                           hover:text-white hover:bg-white/8 hover:border-white/15 transition-all duration-200">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
          { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
          { title: 'Legal',   links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
        ].map((col, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{col.title}</div>
            <div className="flex flex-col gap-3">
              {col.links.map(link => (
                <a key={link} href="#"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200
                             flex items-center gap-1.5 group w-fit">
                  {link}
                  <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row
                      items-center justify-between gap-3">
        <div className="text-xs text-slate-600">© {new Date().getFullYear()} CodeSentinel. All rights reserved.</div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          Built with <span className="text-red-400 animate-pulse">♥</span> by{' '}
          <a href="https://github.com/farhannaeem00" target="_blank" rel="noreferrer"
            className="text-slate-400 hover:text-white transition-colors">Farhan Naeem</a>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        bg-emerald-500/8 border border-emerald-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-emerald-400 font-medium">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function Landing() {
  useEffect(() => {
    document.title = 'CodeSentinel | AI Code Security Scanner';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] antialiased">
      <Noise />
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}