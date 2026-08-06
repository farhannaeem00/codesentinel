import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, Sparkles, Terminal, Bug, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState('');
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0a0a0f] to-purple-950" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black, transparent)',
          }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                              opacity-70 blur-sm scale-110" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center">
                <Shield size={17} className="text-white" />
              </div>
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Code<span className="text-violet-400">Sentinel</span>
            </span>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-violet-500/10 border border-violet-500/20
                          text-violet-400 text-xs font-medium mb-6">
            <Sparkles size={12} /> AI Security Scanner
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Find vulnerabilities
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              before attackers.
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            AI-powered code security scanning for any GitHub repository.
            SQL injection, XSS, secrets, and 20+ more vulnerability types.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: <Bug size={15} />, text: '20+ vulnerability types detected' },
              { icon: <Lock size={15} />, text: 'No code stored on our servers' },
              { icon: <Sparkles size={15} />, text: 'AI explains every finding clearly' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20
                                flex items-center justify-center text-violet-400 shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom mock terminal */}
        <div className="relative z-10">
          <div className="bg-[#0d0d18] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/3 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-amber-500/70" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-xs text-slate-600 font-mono">scan results</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <div className="text-slate-600">$ codesentinel scan github.com/org/repo</div>
              <div className="text-emerald-400">✓ Scanning 47 files...</div>
              <div className="text-red-400">✗ CRITICAL: SQL injection at auth/login.js:42</div>
              <div className="text-red-400">✗ CRITICAL: Exposed API key at .env:15</div>
              <div className="text-amber-400">⚠ WARNING: XSS vector at api/users.js:88</div>
              <div className="text-slate-400">✓ 12 checks passed</div>
              <div className="text-violet-400">→ Security score: 34/100 (High Risk)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-96 h-96 rounded-full bg-violet-900/10 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Shield size={17} className="text-white" />
              </div>
              <span className="text-base font-bold text-white">Code<span className="text-violet-400">Sentinel</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to your CodeSentinel account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Email address
              </label>
              <div className={`relative transition-all duration-200 ${focused === 'email' ? 'drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Mail size={16} />
                </div>
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@company.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white
                             placeholder-slate-600 outline-none transition-all duration-200
                             bg-white/4 border ${focused === 'email' ? 'border-violet-500/60 bg-white/6' : 'border-white/8 hover:border-white/12'}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
              </div>
              <div className={`relative transition-all duration-200 ${focused === 'password' ? 'drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Lock size={16} />
                </div>
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white
                             placeholder-slate-600 outline-none transition-all duration-200
                             bg-white/4 border ${focused === 'password' ? 'border-violet-500/60 bg-white/6' : 'border-white/8 hover:border-white/12'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group relative w-full py-3.5 rounded-xl font-semibold text-sm text-white
                         overflow-hidden transition-all duration-300 disabled:opacity-60
                         hover:-translate-y-0.5 mt-2">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600
                              group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }} />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <>Sign in <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/6" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0f] px-3 text-xs text-slate-600">Don't have an account?</span>
            </div>
          </div>

          <Link to="/register"
            className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                       text-sm font-medium text-slate-300 bg-white/4 hover:bg-white/6
                       border border-white/8 hover:border-white/15 transition-all duration-200">
            Create a free account
            <ArrowRight size={15} className="text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
          </Link>

          <p className="text-center text-xs text-slate-600 mt-6 leading-relaxed">
            By signing in you agree to our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}