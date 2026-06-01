'use client';

import { useState } from 'react';
import { doc, updateDoc, arrayRemove, getFirestore } from 'firebase/firestore';

interface Child {
  id: string;
  displayName: string;
  age?: number;
  email: string;
}

interface ChildListProps {
  children: Child[];
  parentId: string;
  onDeleteSuccess: () => void;
  onEdit: (child: Child) => void;
  isLoading?: boolean;
}

export function ChildList({
  children,
  parentId,
  onDeleteSuccess,
  onEdit,
  isLoading = false,
}: ChildListProps) {
  const db = getFirestore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (childId: string, childName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${childName}" as a child?`)) {
      return;
    }

    setDeletingId(childId);
    setError(null);

    try {
      // Remove child from parent's children array
      await updateDoc(doc(db, 'users', parentId), {
        children: arrayRemove(childId),
      });

      onDeleteSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove child';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (children.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No children yet. Add one above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Your Children
      </h2>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {child.displayName}
                </h3>
                {child.age && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Age: {child.age}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {child.email}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onEdit(child)}
                disabled={deletingId === child.id || isLoading}
                className="btn btn-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(child.id, child.displayName)}
                disabled={deletingId === child.id || isLoading}
                className="btn btn-sm btn-destructive hover:bg-red-200 dark:hover:bg-red-800"
              >
                {deletingId === child.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
