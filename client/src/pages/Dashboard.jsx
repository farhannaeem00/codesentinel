import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';
import api from '../utils/api';
import {
  Shield, Plus, Trash2, TriangleAlert,
  CheckCircle, AlertCircle, Clock, LogOut,
  Code
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GitBranch } from 'lucide-react';

import usePageTitle from '../hooks/usePageTitle';
 

const AlertTriangle = TriangleAlert;

const ScoreBadge = ({ score, riskLevel }) => {
  if (score === null || score === undefined) return null;
  const colors = {
    secure:   'text-green-400 bg-green-400/10',
    low:      'text-blue-400 bg-blue-400/10',
    medium:   'text-yellow-400 bg-yellow-400/10',
    high:     'text-orange-400 bg-orange-400/10',
    critical: 'text-red-400 bg-red-400/10',
  };
  const color = colors[riskLevel] || colors.medium;
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color}`}>
      {score}/100
    </span>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'scanning') return (
    <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
      <Clock size={12} className="animate-spin" /> Scanning...
    </span>
  );
  if (status === 'error') return (
    <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
      <AlertTriangle size={12} /> Error
    </span>
  );
  return null;
};

export default function Dashboard() {
  const { user, logout }      = useAuth();
  const [scans, setScans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();
   usePageTitle('Dashboard');

  useEffect(() => { fetchScans(); }, []);

  useEffect(() => {
    const hasScanning = scans.some(s => s.status === 'scanning');
    if (!hasScanning) return;
    const interval = setInterval(fetchScans, 5000);
    return () => clearInterval(interval);
  }, [scans]);

  const fetchScans = async () => {
    try {
      const { data } = await api.get('/scans/');
      setScans(data.data);
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
      setScans(prev => prev.filter(s => s.id !== id));
      toast.success('Scan deleted');
    } catch {
      toast.error('Failed to delete scan');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const total    = scans.length;
  const done     = scans.filter(s => s.status === 'done').length;
  const critical = scans.filter(s => s.critical_count > 0).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-violet-400" size={22} />
            <span className="text-xl font-bold">CodeSentinel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              Hello, <span className="font-semibold text-white">{user?.name}</span>
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Security Scans</h1>
            <p className="text-gray-400 text-sm mt-1">
              Scan any GitHub repository for security vulnerabilities
            </p>
          </div>
          <Link to="/scan"
            className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl
                       hover:bg-violet-700 transition font-medium text-sm">
            <Plus size={18} /> New Scan
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
            <p className="text-3xl font-black text-violet-400">{total}</p>
            <p className="text-gray-400 text-sm mt-1">Total Scans</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
            <p className="text-3xl font-black text-green-400">{done}</p>
            <p className="text-gray-400 text-sm mt-1">Completed</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
            <p className="text-3xl font-black text-red-400">{critical}</p>
            <p className="text-gray-400 text-sm mt-1">Critical Issues</p>
          </div>
        </div>

        {/* ── Scans List ── */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : scans.length === 0 ? ( (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-16 text-center">
            <Code size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="font-semibold text-gray-300 mb-2">No scans yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Scan your first GitHub repository to get started
            </p>
            <Link to="/scan"
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-2.5
                         rounded-xl hover:bg-violet-700 transition font-medium text-sm">
              <Plus size={16} /> New Scan
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scans.map(scan => (
              <div key={scan.id}
                onClick={() => scan.status === 'done' && navigate(`/report/${scan.id}`)}
                className={`bg-gray-900 rounded-2xl border border-gray-800 p-5
                  flex items-center justify-between gap-4
                  ${scan.status === 'done'
                    ? 'hover:border-violet-500 cursor-pointer'
                    : 'cursor-default'
                  } transition`}
              >
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-violet-500 bg-opacity-10 rounded-xl
                                  flex items-center justify-center shrink-0">
                    <GitBranch className="text-violet-400" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">
                      {scan.repo_name || scan.repo_url}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {scan.repo_url}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  {scan.status === 'done'
                    ? <ScoreBadge score={scan.overall_score} riskLevel={scan.risk_level} />
                    : <StatusBadge status={scan.status} />
                  }
                  {scan.status === 'done' && (
                    <span className="text-xs text-violet-400 font-medium hidden sm:block">
                      View Report →
                    </span>
                  )}
                  <button onClick={(e) => handleDelete(scan.id, e)}
                    className="text-gray-600 hover:text-red-400 transition p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}