'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function ParentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/parent');
    } catch (err: unknown) { //28:19  error  Unexpected any. Specify a different type 
      setError(err.message || 'Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Parent Login
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to manage your family&apos;s chores
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Don&apos;t have an account?{' '}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                TODO: Link to signup
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}