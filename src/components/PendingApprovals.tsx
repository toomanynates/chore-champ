'use client';

import { TaskCompletion, Task } from '@/lib/types';

interface PendingApprovalsProps {
  completions: TaskCompletion[];
  tasks: { [key: string]: Task }; // Map of taskId to Task
  onApprove: (completionId: string, childId: string, taskId: string, starValue: number) => Promise<void>;
  onReject: (completionId: string) => Promise<void>;
  isLoading?: boolean;
}

export function PendingApprovals({
  completions,
  tasks,
  onApprove,
  onReject,
  isLoading = false,
}: PendingApprovalsProps) {
  if (completions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No pending approvals. All caught up! ✅
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pending Approvals ({completions.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {completions.map((completion) => {
          const task = tasks[completion.taskId];
          if (!task) return null;

          return (
            <div
              key={completion.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{task.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Child ID: {completion.childId}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Completed: {new Date(completion.completedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right mr-6">
                <div className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ {task.starValue}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onApprove(completion.id, completion.childId, completion.taskId, task.starValue)
                  }
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(completion.id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
