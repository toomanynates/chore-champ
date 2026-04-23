'use client';

import { LedgerEntry } from '@/lib/types';

interface LedgerViewProps {
  entries: LedgerEntry[];
  totalStars: number;
  childName?: string;
  isLoading?: boolean;
}

export function LedgerView({
  entries,
  totalStars,
  childName = 'Child',
  isLoading = false,
}: LedgerViewProps) {
  const recentEntries = entries.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Star Total Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-8">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
            Total Stars
          </p>
          <p className="text-6xl font-bold text-yellow-600 dark:text-yellow-300">
            {totalStars}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {childName} has earned {totalStars} star{totalStars !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Ledger Entries */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
        </div>

        {recentEntries.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {entry.reason}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div
                  className={`text-lg font-bold text-center px-4 py-2 rounded-lg ${
                    entry.delta >= 0
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                  }`}
                >
                  {entry.delta > 0 ? '+' : ''}
                  {entry.delta}
                  <span className="text-sm ml-1">⭐</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.length > 10 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing 10 of {entries.length} transactions
          </div>
        )}
      </div>
    </div>
  );
}
