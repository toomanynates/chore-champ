'use client';

import { Task } from '@/lib/types';
import { useState } from 'react';
import { Confetti } from '@/components/Confetti';
import { StarBurst } from '@/components/StarBurst';

const pickAnimationType = (): 'confetti' | 'starburst' =>
  Math.random() > 0.4 ? 'confetti' : 'starburst';

interface ChildTaskListProps {
  tasks: Task[];
  onMarkComplete: (taskId: string) => Promise<void>;
  isLoading?: boolean;
  bigButtonMode?: boolean;
}

export function ChildTaskList({
  tasks,
  onMarkComplete,
  isLoading = false,
  bigButtonMode = false,
}: ChildTaskListProps) {
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'confetti' | 'starburst'>('confetti');
  const [burstPosition, setBurstPosition] = useState({ x: 0, y: 0 });

  const handleMarkComplete = async (taskId: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setCompletingId(taskId);
      
      // Get button position for star burst animation
      const handleBurst = (e: React.MouseEvent<HTMLElement>) =>
      {
        if (!e) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setBurstPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      };

      // Randomly choose animation (60% confetti, 40% star burst)
      setAnimationType(pickAnimationType());
      setShowAnimation(true);

      await onMarkComplete(taskId);
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No tasks for today! 🎉
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Check back later for more chores to complete.
        </p>
      </div>
    );
  }

  if (bigButtonMode) {
    // Big Button Mode - Large tiles for easier interaction
    return (
      <>
        {showAnimation && animationType === 'confetti' && (
          <Confetti
            active={showAnimation}
            onComplete={() => setShowAnimation(false)}
          />
        )}
        {showAnimation && animationType === 'starburst' && (
          <StarBurst
            active={showAnimation}
            x={burstPosition.x}
            y={burstPosition.y}
            onComplete={() => setShowAnimation(false)}
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={(e) => handleMarkComplete(task.id, e)}
              disabled={isLoading || completingId === task.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition p-6 text-center disabled:opacity-50"
            >
              <div className={`text-5xl mb-2 ${
                completingId === task.id ? 'animate-celebration' : ''
              }`}>
                {task.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                {task.name}
              </h3>
              <div className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span className={animationType === 'confetti' ? 'animate-star-twinkle' : ''}>
                  ⭐
                </span>
                {task.starValue}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {completingId === task.id ? 'Marking...' : 'Tap to complete'}
              </div>
              <div className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">
                {completingId === task.id ? '⏳' : '✅'}
              </div>
            </button>
          ))}
        </div>
      </>
    );
  }

  // Standard Mode - List view
  return (
    <>
      {showAnimation && animationType === 'confetti' && (
        <Confetti
          active={showAnimation}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      {showAnimation && animationType === 'starburst' && (
        <StarBurst
          active={showAnimation}
          x={burstPosition.x}
          y={burstPosition.y}
          onComplete={() => setShowAnimation(false)}
        />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Stars
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-3xl ${
                        completingId === task.id ? 'animate-celebration' : ''
                      }`}>
                        {task.icon}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {task.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium ${
                      completingId === task.id ? 'animate-star-twinkle' : ''
                    }`}>
                      ⭐ {task.starValue}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => handleMarkComplete(task.id, e)}
                      disabled={isLoading || completingId === task.id}
                      className={`px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition ${
                        completingId === task.id ? 'animate-shake-bounce' : ''
                      }`}
                    >
                      {completingId === task.id ? '⏳ Marking...' : '✅ Done'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
