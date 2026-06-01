'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LedgerView } from '@/components/LedgerView';
import { LedgerEntry } from '@/lib/types';

// Get child id from authenticated user
const SAMPLE_CHILD_NAME = 'You';

export default function ChildStars() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [starTotal, setStarTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const init = () => {
      const auth = getAuth();
      unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setError('Not signed in');
          setIsLoading(false);
          return;
        }

        const childId = user.uid;
        try {
          setIsLoading(true);
          setError('');

          const ledgerRes = await fetch(`/api/ledger/${childId}`);
          if (!ledgerRes.ok) throw new Error('Failed to fetch ledger');
          const ledgerData = await ledgerRes.json();
          setLedger(ledgerData);

          const totalRes = await fetch(`/api/ledger/${childId}/total`);
          if (!totalRes.ok) throw new Error('Failed to fetch star total');
          const totalData = await totalRes.json();
          setStarTotal(totalData.starTotal);
        } catch (err) {
          setError('Failed to load stars');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      });
    };

    init();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Stars & Badges
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View your achievements and rewards
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <LedgerView
              entries={ledger}
              totalStars={starTotal}
              childName={SAMPLE_CHILD_NAME}
            />

            {/* Badges Section (v1: Placeholder, v2: Implement) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Badges
              </h2>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  TODO (v2): Implement badges system
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 space-y-2">
                  <div>• Daily completion streaks</div>
                  <div>• Weekly achievement badges</div>
                  <div>• All-time milestone badges</div>
                </p>
              </div>
            </div>

            {/* Rewards Store (v2) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Rewards Store
              </h2>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  TODO (v2): Implement rewards store
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
