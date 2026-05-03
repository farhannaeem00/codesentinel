import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Shield, ArrowLeft, TriangleAlert, AlertCircle,
  CheckCircle,Code, FileCode
} from 'lucide-react';
import { GitBranch } from 'lucide-react';

const AlertTriangle = TriangleAlert;

// ── Risk Config ───────────────────────────────────────
const riskConfig = {
  critical: {
    border: 'border-red-500/30',
    bg:     'bg-red-500/5',
    badge:  'bg-red-500/10 text-red-400',
    icon:   <TriangleAlert className="text-red-400 shrink-0" size={16} />,
  },
  high: {
    border: 'border-orange-500/30',
    bg:     'bg-orange-500/5',
    badge:  'bg-orange-500/10 text-orange-400',
    icon:   <TriangleAlert className="text-orange-400 shrink-0" size={16} />,
  },
  medium: {
    border: 'border-yellow-500/30',
    bg:     'bg-yellow-500/5',
    badge:  'bg-yellow-500/10 text-yellow-400',
    icon:   <AlertCircle className="text-yellow-400 shrink-0" size={16} />,
  },
  low: {
    border: 'border-blue-500/30',
    bg:     'bg-blue-500/5',
    badge:  'bg-blue-500/10 text-blue-400',
    icon:   <AlertCircle className="text-blue-400 shrink-0" size={16} />,
  },
};

// ── Score Color ───────────────────────────────────────
const scoreColor = (score) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-blue-400';
  if (score >= 50) return 'text-yellow-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-red-400';
};

const scoreLabel = (score) => {
  if (score >= 90) return 'Secure';
  if (score >= 70) return 'Low Risk';
  if (score >= 50) return 'Medium Risk';
  if (score >= 30) return 'High Risk';
  return 'Critical Risk';
};

// ── Scanning State ────────────────────────────────────
const ScanningState = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center max-w-md w-full mx-4">
      <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent
                      rounded-full animate-spin mx-auto mb-6" />
      <h2 className="text-xl font-bold text-white mb-2">Scanning Repository</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        AI is analyzing every file for security vulnerabilities.
        This takes 1-2 minutes.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {[
          'Fetching repository files...',
          'Running security analysis...',
          'Calculating risk scores...',
          'Building report...',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            {step}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Error State ───────────────────────────────────────
const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="bg-gray-900 rounded-2xl border border-red-500 border-opacity-30
                    p-12 text-center max-w-md w-full mx-4">
      <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
      <h2 className="text-xl font-bold text-white mb-2">Scan Failed</h2>
      <p className="text-gray-400 text-sm mb-6">{message || 'Something went wrong.'}</p>
      <Link to="/scan"
        className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-2.5
                   rounded-xl hover:bg-violet-700 transition font-medium text-sm">
        Try Again
      </Link>
    </div>
  </div>
);

// ── Main Report Page ──────────────────────────────────
export default function Report() {
  const { id }                    = useParams();
  const [scan, setScan]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { fetchScan(); }, [id]);

  useEffect(() => {
    if (!scan || scan.status !== 'scanning') return;
    const interval = setInterval(fetchScan, 4000);
    return () => clearInterval(interval);
  }, [scan]);

  const fetchScan = async () => {
    try {
      const { data } = await api.get(`/scans/${id}`);
      setScan(data.data);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!scan || scan.status === 'scanning') return <ScanningState />;
  if (scan.status === 'error') return <ErrorState message={scan.error_message} />;

  const tabs = ['overview', 'files', 'issues'];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-violet-400" size={22} />
            <span className="text-xl font-bold">CodeSentinel</span>
          </div>
          <Link to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-500 bg-opacity-10 rounded-xl
                            flex items-center justify-center">
              <GitBranch className="text-violet-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{scan.repo_name}</h1>
              <a href={scan.repo_url} target="_blank" rel="noreferrer"
                className="text-violet-400 text-sm hover:underline">
                {scan.repo_url}
              </a>
            </div>
          </div>
        </div>

        {/* ── Score Card ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className={`text-6xl font-black ${scoreColor(scan.overall_score)}`}>
                {scan.overall_score}
              </p>
              <p className="text-xs text-gray-500 mt-1">out of 100</p>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-bold ${scoreColor(scan.overall_score)}`}>
                {scoreLabel(scan.overall_score)}
              </span>
              <p className="text-gray-400 text-sm leading-relaxed mt-1">
                {scan.summary}
              </p>
            </div>
          </div>

          {/* Issue Counts */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-800 flex-wrap">
              <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <TriangleAlert size={12} /> {scan.critical_count} Critical
              </span>
              <span className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <TriangleAlert size={12} /> {scan.high_count} High
              </span>
              <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <AlertCircle size={12} /> {scan.medium_count} Medium
              </span>
              <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold">
                <AlertCircle size={12} /> {scan.low_count} Low
              </span>
              <span className="flex items-center gap-1.5 bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                <FileCode size={12} /> {scan.total_files} Files
              </span>
          </div>

        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl
                        p-1 mb-6 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize
                ${activeTab === tab
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}>
              {tab === 'overview' ? 'Overview' :
               tab === 'files'    ? `Files (${scan.total_files})` :
               `Issues (${scan.total_issues})`}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">

            {/* Top Vulnerable Files */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={18} />
                Most Vulnerable Files
              </h2>
              {scan.top_vulnerable?.length === 0 ? (
                <p className="text-gray-500 text-sm">No vulnerable files found.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {scan.top_vulnerable?.map((file, i) => (
                    <div key={i} className="flex items-center justify-between
                                            bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Code className="text-gray-500 shrink-0" size={16} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{file.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-bold ${scoreColor(file.security_score)}`}>
                          {file.security_score}/100
                        </span>
                        {file.critical_count > 0 && (
                          <span className="text-xs bg-red-500 bg-opacity-10
                                           text-red-400 px-2 py-0.5 rounded-full">
                            {file.critical_count} critical
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            {scan.languages && Object.keys(scan.languages).length > 0 && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="text-violet-400" size={18} />
                  Languages Scanned
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(scan.languages).map(([lang, count]) => (
                    <span key={lang}
                      className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-sm">
                      {lang} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── Files Tab ── */}
        {activeTab === 'files' && (
          <div className="flex flex-col gap-3">
            {scan.files?.map((file, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileCode className="text-gray-500 shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 truncate">{file.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500">{file.language}</span>
                    <span className={`text-sm font-bold ${scoreColor(file.security_score)}`}>
                      {file.security_score}/100
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-3">{file.summary}</p>

                {file.issues?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {file.issues.map((issue, j) => {
                      const cfg = riskConfig[issue.severity] || riskConfig.low;
                      return (
                        <div key={j} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3`}>
                          <div className="flex items-center gap-2 mb-1">
                            {cfg.icon}
                            <span className="text-sm font-semibold text-white">
                              {issue.title}
                            </span>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>
                              {issue.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {issue.line_reference}
                          </p>
                          <p className="text-sm text-gray-300 mb-2">
                            {issue.description}
                          </p>
                          <div className="bg-gray-800 bg-opacity-50 rounded-lg p-2">
                            <p className="text-xs text-green-400 font-medium mb-1">
                              ✓ Fix:
                            </p>
                            <p className="text-xs text-gray-300">{issue.fix}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Issues Tab ── */}
        {activeTab === 'issues' && (
          <div>
            {scan.critical_issues?.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl border border-gray-800
                              p-10 text-center">
                <CheckCircle size={40} className="mx-auto mb-3 text-green-500 opacity-50" />
                <p className="text-gray-400">
                  No critical or high severity issues found.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {scan.critical_issues?.map((issue, i) => {
                  const cfg = riskConfig[issue.severity] || riskConfig.low;
                  return (
                    <div key={i}
                      className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
                      <div className="flex items-center gap-2 mb-3">
                        {cfg.icon}
                        <span className="font-semibold text-white">{issue.title}</span>
                        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.badge}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        📁 {issue.file} {issue.line_reference && `· ${issue.line_reference}`}
                      </p>
                      <p className="text-sm text-gray-300 mb-3">
                        {issue.description}
                      </p>
                      <div className="bg-gray-800 bg-opacity-50 rounded-xl p-3">
                        <p className="text-xs text-green-400 font-medium mb-1">✓ Fix:</p>
                        <p className="text-sm text-gray-300">{issue.fix}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}