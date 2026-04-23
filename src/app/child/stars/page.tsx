'use client';

import { useState, useEffect } from 'react';
import { LedgerView } from '@/components/LedgerView';
import { LedgerEntry } from '@/lib/types';

// TODO: Get from auth context
const SAMPLE_CHILD_ID = 'child-1';
const SAMPLE_CHILD_NAME = 'Alice';

export default function ChildStars() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [starTotal, setStarTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch ledger
      const ledgerRes = await fetch(`/api/ledger/${SAMPLE_CHILD_ID}`);
      if (!ledgerRes.ok) throw new Error('Failed to fetch ledger');
      const ledgerData = await ledgerRes.json();
      setLedger(ledgerData);

      // Fetch star total
      const totalRes = await fetch(`/api/ledger/${SAMPLE_CHILD_ID}/total`);
      if (!totalRes.ok) throw new Error('Failed to fetch star total');
      const totalData = await totalRes.json();
      setStarTotal(totalData.starTotal);
    } catch (err) {
      setError('Failed to load stars');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
