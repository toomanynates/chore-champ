'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// TODO: Validate PIN and get child ID from Firestore

export default function ChildLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!pin) {
      setError('Please enter a PIN');
      return;
    }
    
    try {
      // TODO: Call API to validate PIN against Firestore
      // For now, just navigate to child dashboard
      router.push('/child');
    } catch (err) {
      setError('Invalid PIN. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Child Login
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your PIN to get started
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 6))}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white text-lg text-center tracking-widest"
                maxLength={6} //Type error: Type 'string' is not assignable to type 'number'.
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}