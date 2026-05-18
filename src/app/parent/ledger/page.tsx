'use client';

import { useState, useEffect } from 'react';
import { LedgerView } from '@/components/LedgerView';
import { ManualLedgerForm } from '@/components/ManualLedgerForm';
import { PendingApprovals } from '@/components/PendingApprovals';
import { ParentNav } from '@/components/ParentNav';
import { LedgerEntry, TaskCompletion, Task, ParentProfile } from '@/lib/types';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function Ledger() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [starTotal, setStarTotal] = useState(0);
  const [pendingCompletions, setPendingCompletions] = useState<TaskCompletion[]>([]);
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'pending'>('overview');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setParentId(user.uid);
      } else {
        setParentId(null);
        setChildren([]);
        setSelectedChildId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch children from parent profile
  useEffect(() => {
    const fetchChildren = async () => {
      if (!parentId) return;

      try {
        const parentRef = doc(db, 'users', parentId);
        const parentSnap = await getDoc(parentRef);

        if (parentSnap.exists()) {
          const parentData = parentSnap.data() as ParentProfile;
          // TODO: Fetch actual child profiles with names
          // For now, use child UIDs as names
          const childList = parentData.children.map((childId) => ({
            id: childId,
            name: childId, // TODO: fetch from child profile
          }));
          setChildren(childList);

          // Set first child as selected, or null if no children
          if (childList.length > 0) {
            setSelectedChildId(childList[0].id);
          } else {
            setSelectedChildId(null);
          }
        }
      } catch (err) {
        console.error('Error fetching children:', err);
      }
    };

    fetchChildren();
  }, [parentId]);

  const fetchData = async () => {
    if (!parentId) return;
    try {
      setIsLoading(true);
      setError('');

      const ledgerRes = await fetch(`/api/ledger/${selectedChildId}`);
      if (!ledgerRes.ok) throw new Error('Failed to fetch ledger');
      const ledgerData = await ledgerRes.json();
      setLedger(ledgerData);

      const totalRes = await fetch(`/api/ledger/${selectedChildId}/total`);
      if (!totalRes.ok) throw new Error('Failed to fetch star total');
      const totalData = await totalRes.json();
      setStarTotal(totalData.starTotal);

      const pendingRes = await fetch('/api/tasks/pending', {
        headers: { 'x-parent-id': parentId },
      });
      if (!pendingRes.ok) throw new Error('Failed to fetch pending completions');
      const pendingData = await pendingRes.json();
      setPendingCompletions(pendingData);

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

  useEffect(() => {
    if (parentId) {
      fetchData();
    }
  }, [selectedChildId, parentId]);

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

  const selectedChild = children.find((c) => c.id === selectedChildId);

  if (!parentId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <ParentNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <ParentNav />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Children Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add children to your account to start tracking their chores and stars.
            </p>
            <Link
              href="/parent/children"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Add a Child
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <ParentNav />

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
            {children.map((child) => (
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
