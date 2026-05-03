import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm]             = useState({ name: '', email: '', password: '' });
  const [showPassword, setShow]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const { register }                = useAuth();
  const navigate                    = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error('Please fill in all fields');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="text-violet-400" size={28} />
            <span className="text-2xl font-bold text-white">CodeSentinel</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Create your free account</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Get Started</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm
                           focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition pr-12" />
                <button type="button" onClick={() => setShow(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold
                         hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}