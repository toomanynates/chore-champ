'use client';

import { useState, useEffect } from 'react';
import { LedgerView } from '@/components/LedgerView';
import { ManualLedgerForm } from '@/components/ManualLedgerForm';
import { PendingApprovals } from '@/components/PendingApprovals';
import { LedgerEntry, TaskCompletion, Task } from '@/lib/types';

// TODO: Get from auth context
const SAMPLE_CHILDREN = [
  { id: 'child-1', name: 'Alice' },
  { id: 'child-2', name: 'Bob' },
];

export default function Ledger() {
  const [selectedChildId, setSelectedChildId] = useState(SAMPLE_CHILDREN[0].id);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [starTotal, setStarTotal] = useState(0);
  const [pendingCompletions, setPendingCompletions] = useState<TaskCompletion[]>([]);
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'pending'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch ledger
        const ledgerRes = await fetch(`/api/ledger/${selectedChildId}`);
        if (!ledgerRes.ok) throw new Error('Failed to fetch ledger');
        const ledgerData = await ledgerRes.json();
        setLedger(ledgerData);

        // Fetch star total
        const totalRes = await fetch(`/api/ledger/${selectedChildId}/total`);
        if (!totalRes.ok) throw new Error('Failed to fetch star total');
        const totalData = await totalRes.json();
        setStarTotal(totalData.starTotal);

        // Fetch pending completions
        const pendingRes = await fetch('/api/tasks/pending', {
          headers: {
            'x-parent-id': 'parent-123', // TODO: Replace with actual parent ID
          },
        });
        if (!pendingRes.ok) throw new Error('Failed to fetch pending completions');
        const pendingData = await pendingRes.json();
        setPendingCompletions(pendingData);

        // Fetch tasks for pending completions
        const taskMap: { [key: string]: Task } = {};
        for (const completion of pendingData) {
          if (!taskMap[completion.taskId]) {
            const taskRes = await fetch(`/api/tasks/fetch/${completion.taskId}`);
            if (taskRes.ok) {
              const taskData = await taskRes.json();
              taskMap[completion.taskId] = taskData;
            }
          }
        }
        setTasks(taskMap);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedChildId]);

  const handleAddManualEntry = async (delta: number, reason: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ledger/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: selectedChildId,
          delta,
          reason,
        }),
      });
      if (!response.ok) throw new Error('Failed to add entry');
      await fetchData();
    } catch (err) {
      setError('Failed to add ledger entry');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCompletion = async (
    completionId: string,
    childId: string,
    taskId: string,
    starValue: number
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionId,
          childId,
          taskId,
          starValue,
        }),
      });
      if (!response.ok) throw new Error('Failed to approve');
      await fetchData();
    } catch (err) {
      setError('Failed to approve task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCompletion = async (completionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completionId }),
      });
      if (!response.ok) throw new Error('Failed to reject');
      await fetchData();
    } catch (err) {
      setError('Failed to reject task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChild = SAMPLE_CHILDREN.find((c) => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Stars & Ledger
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track star rewards and transactions
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Child Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select a Child
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SAMPLE_CHILDREN.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedChildId === child.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 font-medium rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Ledger Overview
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 font-medium rounded-lg transition relative ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            Pending Approvals
            {pendingCompletions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingCompletions.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <LedgerView
              entries={ledger}
              totalStars={starTotal}
              childName={selectedChild?.name}
              isLoading={isLoading}
            />

            <ManualLedgerForm
              childId={selectedChildId}
              childName={selectedChild?.name}
              onSubmit={handleAddManualEntry}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'pending' && (
          <PendingApprovals
            completions={pendingCompletions}
            tasks={tasks}
            onApprove={handleApproveCompletion}
            onReject={handleRejectCompletion}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
