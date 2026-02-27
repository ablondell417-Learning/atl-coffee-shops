import { useEffect, useRef, useState } from 'react';

type AuthView = 'login' | 'signup';

interface AuthModalProps {
  initialView: AuthView;
  onClose: () => void;
}

export function AuthModal({ initialView, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setView('login')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              view === 'login'
                ? 'text-amber-800 border-b-2 border-amber-700'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setView('signup')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              view === 'signup'
                ? 'text-amber-800 border-b-2 border-amber-700'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={onClose}
            className="px-4 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {view === 'login' ? <LoginForm onClose={onClose} onSwitchToSignup={() => setView('signup')} /> : <SignupForm onClose={onClose} onSwitchToLogin={() => setView('login')} />}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onClose, onSwitchToSignup }: { onClose: () => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login — replace with real auth later
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Welcome back</h2>
        <p className="text-sm text-stone-500 mt-1">Log in to access your saved shops and notes.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button type="button" className="text-xs text-amber-700 hover:underline">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        Log In
      </button>

      <p className="text-center text-xs text-stone-400">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-amber-700 font-medium hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
}

function SignupForm({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    // Mock signup — replace with real auth later
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Create an account</h2>
        <p className="text-sm text-stone-500 mt-1">Join to save your favorite Atlanta coffee shops.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Confirm password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 ${error ? 'border-red-400' : 'border-stone-200'}`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        Create Account
      </button>

      <p className="text-center text-xs text-stone-400">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-amber-700 font-medium hover:underline">
          Log in
        </button>
      </p>
    </form>
  );
}
