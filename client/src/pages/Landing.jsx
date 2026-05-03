import { Link } from 'react-router-dom';
import {
  Shield, Code, TriangleAlert, CheckCircle,
  ArrowRight, GitBranch, Zap, Lock
} from 'lucide-react';

const AlertTriangle = TriangleAlert;

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-500 transition">
    <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl font-black text-violet-400">{value}</p>
    <p className="text-gray-400 text-sm mt-1">{label}</p>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-violet-400" size={24} />
            <span className="text-xl font-bold">CodeSentinel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm text-gray-400 hover:text-white transition font-medium">
              Sign In
            </Link>
            <Link to="/register"
              className="text-sm bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-400 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-violet-500/20">
          <Zap size={14} />
          AI-Powered Code Security Scanner
        </div>

        <h1 className="text-6xl font-black leading-tight mb-6">
          Find Security Vulnerabilities
          <span className="text-violet-400"> Before Hackers Do</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect any GitHub repository and get an instant AI-powered security
          audit — SQL injection, XSS, exposed secrets, and more detected in seconds.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register"
            className="flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-xl hover:bg-violet-700 transition font-semibold text-lg shadow-lg shadow-violet-900">
            <GitBranch size={20} /> Scan Your Repo Free Scan Your Repo Free
            <ArrowRight size={20} />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2 bg-gray-800 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition font-semibold text-lg border border-gray-700">
            Sign In
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {['No credit card required', 'Free to use', 'Public repos supported'].map(item => (
            <div key={item} className="flex items-center gap-2 text-gray-500 text-sm">
              <CheckCircle size={14} className="text-green-500" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="20+"  label="Files Scanned Per Repo" />
            <StatCard value="10+"  label="Vulnerability Types" />
            <StatCard value="60s"  label="Average Scan Time" />
            <StatCard value="100%" label="Free to Use" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Secure Your Code
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            CodeSentinel uses advanced AI to find vulnerabilities that
            traditional scanners miss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<AlertTriangle className="text-red-400" size={24} />}
            title="Vulnerability Detection"
            description="Finds SQL injection, XSS, CSRF, and 10+ other vulnerability types automatically."
          />
          <FeatureCard
            icon={<Lock className="text-violet-400" size={24} />}
            title="Secret Scanner"
            description="Detects hardcoded API keys, passwords, and tokens before they leak."
          />
          <FeatureCard
            icon={<Code className="text-blue-400" size={24} />}
            title="Multi-Language"
            description="Supports JavaScript, Python, PHP, Java, TypeScript and more."
          />
          <FeatureCard
            icon={<Shield className="text-green-400" size={24} />}
            title="Security Score"
            description="Get a 0-100 security score with detailed breakdown per file."
          />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-900 border-y border-gray-800 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Scan any public GitHub repo in 3 simple steps.</p>
          </div>
          <div className="flex flex-col gap-8">
            {[
              { n: '1', t: 'Paste Your GitHub Repo URL', d: 'Enter any public GitHub repository URL into CodeSentinel.' },
              { n: '2', t: 'AI Scans Every File', d: 'Our AI reads every code file and checks for 10+ vulnerability types.' },
              { n: '3', t: 'Get Your Security Report', d: 'View a detailed report with scores, issues, and exact fix suggestions.' },
            ].map(step => (
              <div key={step.n} className="flex gap-4">
                <div className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {step.n}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{step.t}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-black mb-4">
          Start Securing Your Code Today
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Free forever for public repositories. No credit card needed.
        </p>
        <Link to="/register"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-10 py-4 rounded-xl hover:bg-violet-700 transition font-semibold text-lg shadow-lg shadow-violet-900">
          Get Started Free <ArrowRight size={20} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="text-violet-400" size={18} />
          <span className="font-semibold text-gray-300">CodeSentinel</span>
        </div>
        <p>© {new Date().getFullYear()} CodeSentinel. Built to secure your code.</p>
      </footer>

    </div>
  );
}