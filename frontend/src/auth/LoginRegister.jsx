import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';

function parseErrorText(err) {
  if (!err) return '';
  const e = err.response?.data?.error ?? err.response?.data ?? err.message ?? err;
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && e !== null) {
    return e.message || e.error || (e.code ? `Error (${e.code}): ${e.message || JSON.stringify(e)}` : JSON.stringify(e));
  }
  return 'Authentication failed. Please check credentials.';
}

export default function LoginRegister() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(parseErrorText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF7] border border-[#C5A059]/30 shadow-xl p-8 rounded-none">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6B1D2F]/10 text-[#6B1D2F] rounded-full mb-3 border border-[#C5A059]/30">
            <Sparkles className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#3B0D18] tracking-tight">
            Personal Yearly Planner
          </h1>
          <p className="text-xs text-[#6B1D2F] font-semibold tracking-wider uppercase mt-1">
            {isRegister ? 'Create Your Account' : 'Sign In To Your Workspace'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-none font-semibold">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase text-[#6B1D2F]/80 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C5A059] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  className="modal-input pl-9"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-[#6B1D2F]/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C5A059] absolute left-3 top-3" />
              <input
                type="email"
                required
                className="modal-input pl-9"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#6B1D2F]/80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C5A059] absolute left-3 top-3" />
              <input
                type="password"
                required
                className="modal-input pl-9"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-2.5 mt-2 text-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <span className="flex items-center gap-2">
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#C5A059]/20 text-center text-xs text-[#6B1D2F]/70">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className="text-[#6B1D2F] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className="text-[#6B1D2F] font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
