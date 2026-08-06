import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield, GitBranch, AlertTriangle, CheckCircle,
  AlertCircle, ArrowLeft, ChevronRight, Zap,
  BarChart2, FileText, Lock, ExternalLink,
  ChevronDown, ChevronUp, RefreshCw, Copy
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

// ── Security Score Ring ───────────────────────────────
const ScoreRing = ({ score }) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = () => {
        current += 2;
        setAnimated(Math.min(current, score));
        if (current < score) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 400);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius       = 54;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (animated / 100) * circumference;
  const color        = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e';
  const label        = score >= 70 ? 'High Risk' : score >= 40 ? 'Medium Risk' : 'Low Risk';
  const glowColor    = score >= 70 ? 'rgba(239,68,68,0.3)' : score >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <div className="absolute inset-0 rounded-full blur-xl opacity-40"
          style={{ background: glowColor }} />
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none"
            stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
          <circle cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white leading-none">{animated}</span>
          <span className="text-xs text-slate-500 mt-0.5">/100</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-semibold"
        style={{ background: `${color}15`, borderColor: `${color}30`, color }}>
        {score >= 70 ? <AlertTriangle size={11} /> : score >= 40 ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
        {label}
      </div>
    </div>
  );
};

// ── Vulnerability Card ────────────────────────────────
const VulnCard = ({ vuln, index }) => {
  const [expanded, setExpanded] = useState(false);

  const sev = (vuln.severity || '').toLowerCase();
  const config = {
    critical: {
      border: 'border-red-500/25', glow: 'rgba(239,68,68,0.05)',
      badge: 'bg-red-500/12 text-red-400 border-red-500/20',
      icon: <AlertTriangle size={13} className="text-red-400" />,
      bottom: 'via-red-500/40',
    },
    high: {
      border: 'border-red-500/20', glow: 'rgba(239,68,68,0.04)',
      badge: 'bg-red-500/10 text-red-400 border-red-500/15',
      icon: <AlertTriangle size={13} className="text-red-400" />,
      bottom: 'via-red-500/30',
    },
    medium: {
      border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.04)',
      badge: 'bg-amber-500/12 text-amber-400 border-amber-500/20',
      icon: <AlertCircle size={13} className="text-amber-400" />,
      bottom: 'via-amber-500/40',
    },
    low: {
      border: 'border-blue-500/15', glow: 'rgba(59,130,246,0.03)',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/15',
      icon: <AlertCircle size={13} className="text-blue-400" />,
      bottom: 'via-blue-500/30',
    },
    info: {
      border: 'border-slate-500/15', glow: 'rgba(100,116,139,0.03)',
      badge: 'bg-slate-500/10 text-slate-400 border-slate-500/15',
      icon: <CheckCircle size={13} className="text-slate-400" />,
      bottom: 'via-slate-500/20',
    },
  };

  const cfg = config[sev] || config.info;

  const copyLocation = (e) => {
    e.stopPropagation();
    const loc = vuln.file || vuln.location || '';
    if (loc) { navigator.clipboard.writeText(loc); toast.success('Location copied!'); }
  };

  return (
    <div onClick={() => setExpanded(!expanded)}
      className={`group relative border ${cfg.border} rounded-2xl overflow-hidden
                  transition-all duration-200 cursor-pointer`}
      style={{ background: cfg.glow }}>

      <div className="p-4 flex items-start gap-4">
        <div className="shrink-0 w-7 h-7 rounded-lg bg-white/3 border border-white/6
                        flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
                              px-2.5 py-1 rounded-lg border capitalize ${cfg.badge}`}>
              {cfg.icon}
              {vuln.severity || 'Info'}
            </span>
            {vuln.type && (
              <span className="text-xs text-slate-500 font-medium bg-white/4
                               border border-white/8 px-2 py-0.5 rounded-lg">
                {vuln.type}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-1.5 line-clamp-2">
            {vuln.description || vuln.message || vuln.issue}
          </p>

          {(vuln.file || vuln.location) && (
            <button onClick={copyLocation}
              className="flex items-center gap-1.5 text-xs text-slate-500
                         hover:text-slate-300 transition-colors font-mono group/copy">
              <FileText size={11} />
              {vuln.file || vuln.location}
              <Copy size={10} className="opacity-0 group-hover/copy:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        <div className="shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors mt-0.5">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-white/5 pt-3 ml-11 space-y-3">
            {vuln.explanation && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  AI Explanation
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">{vuln.explanation}</p>
              </div>
            )}
            {vuln.recommendation && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Recommendation
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">{vuln.recommendation}</p>
              </div>
            )}
            {vuln.codeSnippet && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  Code
                </p>
                <pre className="text-xs text-slate-300 bg-white/3 border border-white/6
                                rounded-xl p-3 overflow-x-auto font-mono leading-relaxed">
                  {vuln.codeSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 h-px
                       bg-gradient-to-r from-transparent ${cfg.bottom} to-transparent
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
};

export default function ScanResult() {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vulnerabilities');

  useEffect(() => {
    if (!id) return;
    fetchScan();
  }, [id]);

  useEffect(() => {
    if (data?.status === 'scanning' || data?.status === 'pending') {
      const interval = setInterval(fetchScan, 4000);
      return () => clearInterval(interval);
    }
  }, [data?.status]);

  const fetchScan = async () => {
    try {
      const { data: res } = await api.get(`/scans/${id}`);
      setData(res.data || res.scan || res);
    } catch {
      toast.error('Failed to load scan');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500
                        rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading scan results...</p>
      </div>
    </div>
  );

  const isScanning = data?.status === 'scanning' || data?.status === 'pending';

  if (isScanning) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20
                          flex items-center justify-center">
            <Shield size={30} className="text-violet-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Scanning your repository</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Our AI is reading every file in the repo, detecting vulnerabilities
          and security issues. This takes about 60 seconds.
        </p>
        <div className="bg-[#0d0d18] border border-white/8 rounded-2xl p-5 mb-6 text-left">
          <div className="flex flex-col gap-3">
            {[
              { label: 'Fetching repository files', done: true },
              { label: 'Reading source code', done: true },
              { label: 'Detecting vulnerabilities', done: false },
              { label: 'Generating security report', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 border-2 border-violet-500/30 border-t-violet-400
                                  rounded-full animate-spin shrink-0" />
                )}
                <span className={`text-sm ${step.done ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={fetchScan}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-white
                     transition-colors mx-auto">
          <RefreshCw size={14} /> Check status
        </button>
      </div>
    </div>
  );

  const vulns     = data?.vulnerabilities || data?.issues || [];
  const critical  = vulns.filter(v => (v.severity || '').toLowerCase() === 'critical');
  const high      = vulns.filter(v => (v.severity || '').toLowerCase() === 'high');
  const medium    = vulns.filter(v => (v.severity || '').toLowerCase() === 'medium');
  const low       = vulns.filter(v => ['low', 'info'].includes((v.severity || '').toLowerCase()));
  const score     = data?.securityScore || data?.riskScore || 0;
  const repoUrl   = data?.repoUrl || data?.repo_url || '';
  const repoName  = repoUrl.replace('https://github.com/', '');

  const tabs = [
    { id: 'vulnerabilities', label: 'Vulnerabilities', count: vulns.length },
    { id: 'summary',         label: 'Summary',         count: null },
  ];

  const statCards = [
    { label: 'Total Issues', value: vulns.length, icon: <BarChart2 size={16} />, color: 'from-violet-500/12 border-violet-500/15', text: 'text-violet-400' },
    { label: 'Critical',     value: critical.length, icon: <AlertTriangle size={16} />, color: 'from-red-500/12 border-red-500/15', text: 'text-red-400' },
    { label: 'High',         value: high.length, icon: <AlertTriangle size={16} />, color: 'from-orange-500/12 border-orange-500/15', text: 'text-orange-400' },
    { label: 'Medium',       value: medium.length, icon: <AlertCircle size={16} />, color: 'from-amber-500/12 border-amber-500/15', text: 'text-amber-400' },
    { label: 'Low / Info',   value: low.length, icon: <AlertCircle size={16} />, color: 'from-blue-500/12 border-blue-500/15', text: 'text-blue-400' },
    { label: 'Files Scanned', value: data?.filesScanned || '—', icon: <FileText size={16} />, color: 'from-emerald-500/12 border-emerald-500/15', text: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-violet-600/8 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-600/8 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

          <div className="flex items-center gap-2 min-w-0">
            <Link to="/dashboard"
              className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm shrink-0">
              <ArrowLeft size={16} />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            <ChevronRight size={14} className="text-slate-700 shrink-0" />
            <span className="text-sm text-slate-300 truncate font-mono">{repoName}</span>
          </div>

          <a href={repoUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                       text-white bg-gradient-to-r from-violet-600 to-purple-600
                       hover:from-violet-500 hover:to-purple-500 transition-all duration-200
                       shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 shrink-0">
            <GitBranch size={15} />
            <span className="hidden sm:block">View on GitHub</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </nav>

      <div className="relative max-w-6xl mx-auto px-5 py-8">

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Score card */}
          <div className="bg-[#0d0d18] border border-white/8 rounded-2xl p-6
                          flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20
                            flex items-center justify-center mb-4">
              <GitBranch size={22} className="text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-0.5 truncate max-w-full px-2 font-mono">
              {repoName}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {new Date(data?.createdAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
            <ScoreRing score={score} />
          </div>

          {/* Stats grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {statCards.map((stat, i) => (
              <div key={i}
                className={`bg-gradient-to-br ${stat.color.split(' ')[0]} to-transparent
                            border ${stat.color.split(' ')[1]}
                            rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-200 cursor-default`}>
                <div className={`mb-2.5 ${stat.text}`}>{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary block */}
        {data?.summary && (
          <div className="relative bg-gradient-to-br from-violet-500/8 to-purple-500/4
                          border border-violet-500/15 rounded-2xl p-6 mb-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/20
                              flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={16} className="text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">
                  AI Security Assessment
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{data.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/3 border border-white/6
                        rounded-2xl p-1.5 mb-6 w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${activeTab === tab.id
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                            : 'text-slate-400 hover:text-white'
                          }`}>
              {tab.label}
              {tab.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold
                  ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/6 text-slate-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Vulnerabilities */}
        {activeTab === 'vulnerabilities' && (
          <div className="space-y-3">
            {vulns.length === 0 ? (
              <div className="bg-[#0d0d18] border border-white/6 rounded-2xl p-12 text-center">
                <CheckCircle size={32} className="mx-auto text-emerald-500 mb-3" />
                <h3 className="text-base font-semibold text-white mb-2">No vulnerabilities found</h3>
                <p className="text-slate-500 text-sm">This repository passed all security checks.</p>
              </div>
            ) : (
              vulns.map((vuln, i) => (
                <VulnCard key={i} vuln={vuln} index={i} />
              ))
            )}
          </div>
        )}

        {/* Tab: Summary */}
        {activeTab === 'summary' && (
          <div className="bg-[#0d0d18] border border-white/8 rounded-2xl p-6">
            {data?.detailedSummary || data?.summary ? (
              <>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Full Security Report
                </p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {data.detailedSummary || data.summary}
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <Lock size={28} className="mx-auto text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm">Summary not available.</p>
              </div>
            )}

            {data?.recommendations?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                  Recommendations
                </p>
                <div className="space-y-2.5">
                  {data.recommendations.map((rec, i) => (
                    <div key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/10">
                      <ChevronRight size={14} className="text-violet-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}