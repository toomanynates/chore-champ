'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskInput } from '@/components/TaskForm';
import { ParentNav } from '@/components/ParentNav';
import { Task } from '@/lib/types';
import { auth, db } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setParentId(user.uid);
      } else {
        setParentId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTasks = async () => {
    if (!parentId) return;

    try {
      setIsLoading(true);
      setError('');
      const q = query(
        collection(db, 'tasks'),
        where('parentId', '==', parentId)
      );
      const querySnapshot = await getDocs(q);
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchTasks();
    }
  }, [parentId]);

  const handleCreateTask = async (formData: TaskInput) => {
    if (!parentId) return;

    try {
      setIsLoading(true);
      setError('');
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        parentId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
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
      setError('');
      await updateDoc(doc(db, 'tasks', editingTask.id), {
        ...formData,
        updatedAt: Timestamp.now(),
      });
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
      setError('');
      await deleteDoc(doc(db, 'tasks', taskId));
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
      setError('');
      await updateDoc(doc(db, 'tasks', taskId), {
        active,
        updatedAt: Timestamp.now(),
      });
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <ParentNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
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
