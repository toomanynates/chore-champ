'use client';

import { useState } from 'react';

interface ManualLedgerFormProps {
  childId: string;
  childName?: string;
  onSubmit: (delta: number, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function ManualLedgerForm({
  childId,
  childName = 'Child',
  onSubmit,
  isLoading = false,
}: ManualLedgerFormProps) {
  const [delta, setDelta] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'add' | 'remove'>('add');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!delta || !reason.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const numDelta = typeof delta === 'number' ? delta : parseInt(delta as string);
    const finalDelta = type === 'remove' ? -numDelta : numDelta;

    try {
      await onSubmit(finalDelta, reason);
      setDelta('');
      setReason('');
    } catch (err) {
      setError('Failed to add entry');
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Manual Adjustment for {childName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'add' | 'remove')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="add">Add Stars ✅</option>
              <option value="remove">Remove Stars ❌</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <input
              type="number"
              required
              min="1"
              max="1000"
              value={delta}
              onChange={(e) => setDelta(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Number of stars"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              &nbsp;
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason *
          </label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Extra help with laundry, Broke vase"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
