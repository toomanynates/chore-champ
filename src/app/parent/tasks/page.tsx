'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskInput } from '@/components/TaskForm';
import { Task } from '@/lib/types';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // TODO: Get parentId from auth context
      const response = await fetch('/api/tasks', {
        headers: {
          'x-parent-id': 'parent-123', // TODO: Replace with actual parent ID
        },
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (formData: TaskInput) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-parent-id': 'parent-123', // TODO: Replace with actual parent ID
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      await fetchTasks();
      setShowForm(false);
      setEditingTask(undefined);
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (formData: TaskInput) => {
    if (!editingTask) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks();
      setShowForm(false);
      setEditingTask(undefined);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (taskId: string, active: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      await fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Create and manage chores
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              + New Task
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
              initialTask={editingTask}
              isLoading={isLoading}
            />
          </div>
        )}

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleActive={handleToggleActive}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
