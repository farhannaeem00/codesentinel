import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, User, CheckCircle, Sparkles, Bug } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number',     pass: /\d/.test(password) },
    { label: 'Contains a letter',     pass: /[a-zA-Z]/.test(password) },
  ];
  const score  = checks.filter(c => c.pass).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-white/8'
            }`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-1">
              <CheckCircle size={10} className={check.pass ? 'text-emerald-400' : 'text-slate-600'} />
              <span className={`text-[10px] ${check.pass ? 'text-slate-400' : 'text-slate-600'}`}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-[10px] font-semibold ${
            score === 1 ? 'text-red-400' : score === 2 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
};

export default function Register() {
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState('');
  const [agreed, setAgreed]     = useState(false);
  const { register }            = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!agreed) return toast.error('Please agree to the terms');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to CodeSentinel.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = (field) =>
    `w-full py-3.5 rounded-xl text-sm text-white placeholder-slate-600 outline-none
     transition-all duration-200 bg-white/4 border ${
      focused === field ? 'border-violet-500/60 bg-white/6' : 'border-white/8 hover:border-white/12'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#0a0a0f] to-violet-950" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black, transparent)',
          }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 opacity-70 blur-sm scale-110" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
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
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Secure code.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Confident team.
            </span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Join thousands of developers who scan their repos
            before shipping to production.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50,000+', label: 'Repos scanned' },
              { value: '< 60s',   label: 'Scan time' },
              { value: '20+',     label: 'Vuln types' },
              { value: 'Free',    label: 'Public repos' },
            ].map((stat, i) => (
              <div key={i}
                className="bg-white/4 border border-white/6 rounded-2xl p-4
                           hover:bg-white/6 hover:border-white/10 transition-all duration-200">
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom avatars */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['AK', 'SR', 'MT', 'PJ'].map((initials, i) => (
                <div key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0a0f]
                             bg-gradient-to-br from-violet-500 to-purple-600
                             flex items-center justify-center text-white text-[9px] font-bold">
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Joined this week</div>
              <div className="text-xs text-slate-500">200+ new developers today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-violet-500/8 border border-violet-500/15
                            text-violet-400 text-xs font-medium mb-4">
              <Sparkles size={11} /> Free for public repositories
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create your account</h1>
            <p className="text-slate-400 text-sm">No credit card required. Start scanning in 30 seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Full name</label>
              <div className={`relative transition-all duration-200 ${focused === 'name' ? 'drop-shadow-[0_0_12px_rgba(139,92,246,0.25)]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><User size={16} /></div>
                <input type="text" name="name" value={form.name}
                  onChange={handleChange} onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  placeholder="John Doe"
                  className={`pl-11 pr-4 ${inputBase('name')}`} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email address</label>
              <div className={`relative transition-all duration-200 ${focused === 'email' ? 'drop-shadow-[0_0_12px_rgba(139,92,246,0.25)]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Mail size={16} /></div>
                <input type="email" name="email" value={form.email}
                  onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  placeholder="you@company.com"
                  className={`pl-11 pr-4 ${inputBase('email')}`} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className={`relative transition-all duration-200 ${focused === 'password' ? 'drop-shadow-[0_0_12px_rgba(139,92,246,0.25)]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"><Lock size={16} /></div>
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  placeholder="Create a strong password"
                  className={`pl-11 pr-12 ${inputBase('password')}`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <button type="button" onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded-md border shrink-0 mt-0.5 flex items-center justify-center
                           transition-all duration-200 ${agreed ? 'bg-violet-600 border-violet-600' : 'bg-white/4 border-white/15 hover:border-white/25'}`}>
                {agreed && <CheckCircle size={12} className="text-white" />}
              </button>
              <p className="text-xs text-slate-400 leading-relaxed">
                I agree to CodeSentinel's{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</a>
              </p>
            </div>

            {/* Submit */}
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
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account...</>
                ) : (
                  <>Create free account <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/6" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0f] px-3 text-xs text-slate-600">Already have an account?</span>
            </div>
          </div>

          <Link to="/login"
            className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                       text-sm font-medium text-slate-300 bg-white/4 hover:bg-white/6
                       border border-white/8 hover:border-white/15 transition-all duration-200">
            Sign in instead
            <ArrowRight size={15} className="text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}