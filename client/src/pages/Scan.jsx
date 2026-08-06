import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, GitBranch, Zap, ArrowRight,
  Lock, CheckCircle, AlertTriangle,
  ChevronRight, X, ExternalLink
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EXAMPLE_REPOS = [
  'https://github.com/expressjs/express',
  'https://github.com/django/django',
  'https://github.com/rails/rails',
];

export default function Scan() {
  const [repoUrl, setRepoUrl]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const isValidGithubUrl = (url) => {
    return /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/.test(url.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!isValidGithubUrl(repoUrl)) {
      setError('Please enter a valid GitHub URL (e.g. https://github.com/owner/repo)');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/scans', {
        repoUrl: repoUrl.trim()
      });

      const scanId = data.scanId || data._id || data.data?._id;
      toast.success('Scan started!');
      navigate(`/scan/${scanId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start scan';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full
                        bg-violet-600/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full
                        bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500
                              to-purple-600 opacity-70 blur-sm scale-110" />
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500
                              to-purple-600 flex items-center justify-center">
                <Shield size={13} className="text-white" />
              </div>
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">
              Code<span className="text-violet-400">Sentinel</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/dashboard" className="hover:text-slate-300 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">New Scan</span>
          </div>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-violet-500/8 border border-violet-500/15
                          text-violet-400 text-xs font-medium mb-4">
            <Zap size={11} /> AI security scan in under 60 seconds
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Scan a repository
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Paste any public GitHub repository URL. Our AI will scan
            every file for security vulnerabilities instantly.
          </p>
        </div>

        {/* Input form */}
        <div className="mb-5">
          <form onSubmit={handleSubmit}>
            <div className={`relative rounded-2xl transition-all duration-200 ${
              focused ? 'drop-shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''
            }`}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <GitBranch size={18} />
              </div>

              <input
                type="url"
                value={repoUrl}
                onChange={e => { setRepoUrl(e.target.value); setError(''); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://github.com/owner/repository"
                className={`w-full pl-12 pr-16 py-4 rounded-2xl text-sm text-white
                           placeholder-slate-600 outline-none transition-all duration-200
                           bg-[#0d0d18] border ${
                  error
                    ? 'border-red-500/50 bg-red-500/5'
                    : focused
                    ? 'border-violet-500/60 bg-white/6'
                    : 'border-white/8 hover:border-white/15'
                }`}
              />

              {repoUrl && (
                <button type="button" onClick={() => { setRepoUrl(''); setError(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600
                             hover:text-slate-300 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 mt-2.5 px-1">
                <AlertTriangle size={12} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading || !repoUrl.trim()}
              className="group relative w-full mt-4 py-4 rounded-2xl font-bold text-base
                         text-white overflow-hidden transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:-translate-y-0.5 shadow-xl shadow-violet-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600
                              group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                }} />
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white
                                    rounded-full animate-spin" />
                    Starting scan...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Start Security Scan
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Example repos */}
        <div className="mb-8">
          <p className="text-xs text-slate-600 text-center mb-3">
            Try with an example repository
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLE_REPOS.map((repo, i) => (
              <button key={i} onClick={() => { setRepoUrl(repo); setError(''); }}
                className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl
                           bg-white/2 border border-white/6 hover:border-white/12
                           hover:bg-white/4 transition-all duration-200 text-left">
                <GitBranch size={14} className="text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors font-mono truncate">
                  {repo.replace('https://github.com/', '')}
                </span>
                <ExternalLink size={12} className="text-slate-700 ml-auto shrink-0
                                                    group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              icon: <Zap size={15} className="text-violet-400" />,
              title: 'Fast scan',
              desc: 'Results in under 60 seconds',
              bg: 'bg-violet-500/6 border-violet-500/12',
            },
            {
              icon: <Lock size={15} className="text-emerald-400" />,
              title: 'No code stored',
              desc: 'We never store your source code',
              bg: 'bg-emerald-500/6 border-emerald-500/12',
            },
            {
              icon: <CheckCircle size={15} className="text-blue-400" />,
              title: '20+ vuln types',
              desc: 'SQL, XSS, secrets, and more',
              bg: 'bg-blue-500/6 border-blue-500/12',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} border rounded-2xl p-4 flex items-start gap-3`}>
              <div className="shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">{item.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Supported languages */}
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-3">Supported languages</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['JavaScript', 'TypeScript', 'Python', 'PHP', 'Ruby', 'Java', 'Go'].map(lang => (
              <span key={lang} className="text-xs text-slate-600 font-medium
                                          hover:text-slate-400 transition-colors cursor-default">
                {lang}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}