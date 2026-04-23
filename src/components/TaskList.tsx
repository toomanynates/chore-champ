'use client';

import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleActive: (taskId: string, active: boolean) => void;
  isLoading?: boolean;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading = false,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No tasks yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Repeat
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Assigned
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                Actions
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
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{task.icon}</span>
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
                  <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {task.starValue}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  Every {task.repeatRule.number} {task.repeatRule.unit}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {task.assignedChildrenIds.length} child
                  {task.assignedChildrenIds.length !== 1 ? 'ren' : ''}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onToggleActive(task.id, !task.active)}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded-lg transition ${
                      task.active
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {task.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onEdit(task)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
