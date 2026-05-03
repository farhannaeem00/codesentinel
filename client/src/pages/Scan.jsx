import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Shield, ArrowLeft,
  Search, CheckCircle, TriangleAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GitBranch } from 'lucide-react';

const AlertTriangle = TriangleAlert;


const EXAMPLE_REPOS = [
  'https://github.com/farhannaeem00/contractsense',
  'https://github.com/OWASP/NodeGoat',
  'https://github.com/facebook/react',
];

export default function Scan() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleScan = async () => {
    if (!repoUrl) return toast.error('Please enter a GitHub repository URL');
    if (!repoUrl.includes('github.com'))
      return toast.error('Please enter a valid GitHub URL');

    setLoading(true);
    try {
      const { data } = await api.post('/scans/', { repo_url: repoUrl });
      toast.success('Scan started!');
      navigate(`/report/${data.scan_id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-violet-400" size={22} />
            <span className="text-xl font-bold">CodeSentinel</span>
          </div>
          <Link to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Scan a Repository</h1>
          <p className="text-gray-400">
            Enter any public GitHub repository URL to start an AI security scan.
          </p>
        </div>

        {/* ── Input Card ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">

          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub Repository URL
          </label>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScan()}
                placeholder="https://github.com/owner/repo"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-700
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500
                           focus:border-transparent transition"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={loading || !repoUrl}
              className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl
                         hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed
                         transition font-medium text-sm shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              {loading ? 'Starting...' : 'Scan'}
            </button>
          </div>

          {/* Example repos */}
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-3">Try these example repositories:</p>
            <div className="flex flex-col gap-2">
            {EXAMPLE_REPOS.map(repo => (
              <button
                key={repo}
                onClick={() => setRepoUrl(repo)}
                className="text-left text-xs text-violet-400 hover:text-violet-300
                          bg-violet-500/5 hover:  -500/10
                          border border-violet-500/20
                          px-3 py-2 rounded-lg transition truncate"
              >
                {repo}
              </button>
            ))}
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              What happens next
            </p>
            <div className="flex flex-col gap-2">
              {[
                'Repository files are fetched via GitHub API',
                'AI analyzes every code file for vulnerabilities',
                'Security score calculated per file',
                'Full report ready in 1-2 minutes',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <TriangleAlert size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-300/80">
              Only public GitHub repositories are supported.
              Private repos require a GitHub token.
            </p>
        </div>

        </div>
      </div>
    </div>
  );
}