'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ChildTaskList } from '@/components/ChildTaskList';
import { SuccessNotification } from '@/components/SuccessNotification';
import { Task } from '@/lib/types';
import { getTasksForChild } from '@/lib/services/taskService';
import { createTaskCompletion } from '@/lib/services/taskCompletionService';

// Get child id from authenticated user

interface CompletedTask {
  taskId: string;
  taskName: string;
  starValue: number;
}

export default function ChildTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bigButtonMode, setBigButtonMode] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState<CompletedTask | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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

          const data = await getTasksForChild(childId);
          setTasks(data);
        } catch (err) {
          setError('Failed to load tasks');
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

  const handleMarkComplete = async (taskId: string) => {
    try {
      setIsLoading(true);

      // Find the task to get its details
      const completedTask = tasks.find((t) => t.id === taskId);
      if (!completedTask) throw new Error('Task not found');

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      await createTaskCompletion(taskId, currentUser.uid);

      // Store completed task info for notification
      setLastCompletedTask({
        taskId,
        taskName: completedTask.name,
        starValue: completedTask.starValue,
      });
      setShowSuccessNotification(true);

      // Remove from list with a slight delay for better UX
      setTimeout(() => {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }, 500);
    } catch (err) {
      setError('Failed to mark task complete');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Complete your chores and earn stars
            </p>
          </div>
          <button
            onClick={() => setBigButtonMode(!bigButtonMode)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              bigButtonMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white'
            }`}
          >
            {bigButtonMode ? '📊 List' : '🔘 Big Buttons'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading && tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading your tasks...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Today
              </h2>
              <ChildTaskList
                tasks={tasks}
                onMarkComplete={handleMarkComplete}
                isLoading={isLoading}
                bigButtonMode={bigButtonMode}
              />
            </div>

            {/* v2: Overdue section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                (v2) Overdue Tasks
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                TODO: Implement overdue task tracking
              </p>
            </div>
          </div>
        )}

        {/* Success Notification with Animations */}
        {lastCompletedTask && (
          <SuccessNotification
            show={showSuccessNotification}
            taskName={lastCompletedTask.taskName}
            starValue={lastCompletedTask.starValue}
            message="Task submitted for approval!"
            autoDismissMs={4000}
            onDismiss={() => setLastCompletedTask(null)}
          />
        )}
      </main>
    </div>
  );
}
