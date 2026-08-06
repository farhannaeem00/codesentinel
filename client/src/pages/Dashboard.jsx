import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Plus, GitBranch, Trash2,
  AlertTriangle, CheckCircle, AlertCircle,
  LogOut, Search, ChevronRight, BarChart2,
  Zap, Menu, X, Clock, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

// ── Security Score Badge ──────────────────────────────
const ScoreBadge = ({ score }) => {
  if (score === undefined || score === null) return null;
  if (score >= 70) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
      <span className="text-xs font-semibold text-red-400">High Risk · {score}</span>
    </div>
  );
  if (score >= 40) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <span className="text-xs font-semibold text-amber-400">Medium · {score}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      <span className="text-xs font-semibold text-emerald-400">Low Risk · {score}</span>
    </div>
  );
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now   = new Date();
  const diff  = Math.floor((now - date) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const SkeletonRow = () => (
  <div className="bg-[#0d0d18] border border-white/6 rounded-2xl p-5
                  flex items-center gap-4 animate-pulse">
    <div className="w-11 h-11 rounded-xl bg-white/4 shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-white/4 rounded-lg w-48 mb-2" />
      <div className="h-3 bg-white/3 rounded-lg w-32" />
    </div>
    <div className="h-7 bg-white/4 rounded-lg w-24 shrink-0" />
  </div>
);

export default function Dashboard() {
  const { user, logout }      = useAuth();
  const [scans, setScans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('newest');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate              = useNavigate();

  useEffect(() => { fetchScans(); }, []);

  useEffect(() => {
    const hasScanning = scans.some(s => s.status === 'scanning');
    if (!hasScanning) return;
    const interval = setInterval(fetchScans, 5000);
    return () => clearInterval(interval);
  }, [scans]);

  const fetchScans = async () => {
    try {
      const { data } = await api.get('/scans');
      setScans(data.data || data.scans || []);
    } catch {
      toast.error('Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this scan?')) return;
    try {
      await api.delete(`/scans/${id}`);
      setScans(prev => prev.filter(s => s._id !== id));
      toast.success('Scan deleted');
    } catch {
      toast.error('Failed to delete scan');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); toast.success('Signed out'); };

  const filtered = scans
    .filter(s => (s.repoUrl || s.repo_url || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest')    return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')    return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'risk-high') return (b.securityScore || b.riskScore || 0) - (a.securityScore || a.riskScore || 0);
      if (sortBy === 'risk-low')  return (a.securityScore || a.riskScore || 0) - (b.securityScore || b.riskScore || 0);
      return 0;
    });

  const total     = scans.length;
  const completed = scans.filter(s => s.status === 'done' || s.status === 'completed').length;
  const highRisk  = scans.filter(s => (s.securityScore || s.riskScore || 0) >= 70).length;
  const avgScore  = completed
    ? Math.round(scans.filter(s => s.status === 'done' || s.status === 'completed')
        .reduce((a, s) => a + (s.securityScore || s.riskScore || 0), 0) / completed)
    : 0;

  const statCards = [
    { label: 'Total Scans',  value: total,     icon: <GitBranch size={18} />, gradient: 'from-violet-500/15', border: 'border-violet-500/15', icon_bg: 'bg-violet-500/15 text-violet-400' },
    { label: 'Completed',    value: completed, icon: <CheckCircle size={18} />, gradient: 'from-emerald-500/15', border: 'border-emerald-500/15', icon_bg: 'bg-emerald-500/15 text-emerald-400' },
    { label: 'High Risk',    value: highRisk,  icon: <AlertTriangle size={18} />, gradient: 'from-red-500/15', border: 'border-red-500/15', icon_bg: 'bg-red-500/15 text-red-400' },
    { label: 'Avg Score',    value: completed ? `${avgScore}` : '—', icon: <BarChart2 size={18} />, gradient: 'from-purple-500/15', border: 'border-purple-500/15', icon_bg: 'bg-purple-500/15 text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                              opacity-70 blur-sm scale-110" />
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center">
                <Shield size={13} className="text-white" />
              </div>
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">
              Code<span className="text-violet-400">Sentinel</span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search repositories..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white
                           placeholder-slate-600 bg-white/4 border border-white/8
                           focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/scan"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm
                         font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600
                         hover:from-violet-500 hover:to-purple-500 transition-all duration-200
                         shadow-lg shadow-violet-500/20">
              <Plus size={15} /> New Scan
            </Link>
            <div className="flex items-center gap-2 pl-3 border-l border-white/8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-300 hidden md:block font-medium">
                {user?.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/8 transition-all ml-1">
                <LogOut size={15} />
              </button>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-1.5 rounded-lg text-slate-400 bg-white/4 border border-white/8">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden border-t border-white/6 px-5 py-3 flex flex-col gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search repositories..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white
                           placeholder-slate-600 bg-white/4 border border-white/8
                           focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <Link to="/scan"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm
                         font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600">
              <Plus size={15} /> New Scan
            </Link>
          </div>
        )}
      </nav>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},{' '}
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0]}
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {total === 0
                ? 'Scan your first repository to get started'
                : `${total} scan${total === 1 ? '' : 's'} · ${highRisk} high risk ${highRisk === 1 ? 'repo' : 'repos'}`
              }
            </p>
          </div>
          <Link to="/scan"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm
                       font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600
                       hover:from-violet-500 hover:to-purple-500 transition-all duration-200
                       shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 group">
            <Zap size={15} />
            New Scan
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i}
              className={`relative bg-gradient-to-br ${stat.gradient} to-transparent
                          border ${stat.border} rounded-2xl p-5
                          hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.icon_bg}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scan list header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Scan History
          </h2>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs text-slate-400 bg-white/4 border border-white/8
                       rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500/40
                       transition-colors cursor-pointer">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="risk-high">Highest risk</option>
            <option value="risk-low">Lowest risk</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>

        ) : scans.length === 0 ? (
          <div className="relative rounded-2xl border border-dashed border-white/10 bg-white/2 p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 to-purple-900/5 pointer-events-none" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20
                              flex items-center justify-center mx-auto mb-5">
                <GitBranch size={28} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No scans yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                Paste a GitHub repo URL and get an instant AI security audit in under 60 seconds.
              </p>
              <Link to="/scan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm
                           font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600
                           hover:from-violet-500 hover:to-purple-500 transition-all duration-200
                           shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 group">
                <Plus size={16} />
                Scan your first repo
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/6 bg-white/2 p-12 text-center">
            <Search size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-400 text-sm">
              No scans match <span className="text-white font-medium">"{search}"</span>
            </p>
            <button onClick={() => setSearch('')}
              className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Clear search
            </button>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(scan => {
              const repoUrl   = scan.repoUrl || scan.repo_url || '';
              const score     = scan.securityScore || scan.riskScore;
              const status    = scan.status;
              const isDone    = status === 'done' || status === 'completed';
              const isScanning = status === 'scanning' || status === 'pending';
              const repoName  = repoUrl.replace('https://github.com/', '');

              return (
                <div key={scan._id}
                  onClick={() => isDone && navigate(`/report/${scan._id}`)}
                  className={`group relative bg-[#0d0d18] border border-white/6
                             rounded-2xl p-4 sm:p-5 flex items-center gap-4
                             transition-all duration-200 overflow-hidden
                             ${isDone
                               ? 'hover:border-violet-500/30 hover:bg-[#0f0f1f] cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30'
                               : 'cursor-default'
                             }`}>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                                  transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.04), transparent 60%)' }} />

                  {/* Icon */}
                  <div className="relative w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20
                                  flex items-center justify-center shrink-0
                                  group-hover:scale-105 transition-transform duration-200">
                    <GitBranch size={18} className="text-violet-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm truncate">{repoName}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(scan.createdAt)}
                      </span>
                      {isDone && scan.filesScanned && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span>{scan.filesScanned} files</span>
                        </>
                      )}
                      {isDone && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-emerald-500">Scan complete</span>
                        </>
                      )}
                      {isScanning && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-indigo-400 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Scanning...
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isDone && score !== undefined
                      ? <ScoreBadge score={score} />
                      : isScanning
                      ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                          <span className="text-xs font-semibold text-violet-400">Scanning...</span>
                        </div>
                      )
                      : null
                    }

                    {isDone && (
                      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-600
                                      group-hover:text-violet-400 transition-colors duration-200">
                        View report
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}

                    <a href={repoUrl} target="_blank" rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-slate-400
                                 hover:bg-white/5 transition-all duration-200
                                 opacity-0 group-hover:opacity-100">
                      <ExternalLink size={14} />
                    </a>

                    <button onClick={(e) => handleDelete(scan._id, e)}
                      className="p-1.5 rounded-lg text-slate-700 hover:text-red-400
                                 hover:bg-red-400/8 transition-all duration-200
                                 opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-slate-700 mt-8">
            Showing {filtered.length} of {total} scans
          </p>
        )}
      </div>
    </div>
  );
}