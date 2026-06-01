'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ParentNav } from '@/components/ParentNav';
import { AddChildForm } from '@/components/AddChildForm';
import { ChildList } from '@/components/ChildList';

interface Child {
  id: string;
  displayName: string;
  age?: number;
  email: string;
}

export default function Children() {
  const auth = getAuth();
  const db = getFirestore();

  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get authenticated user and fetch children
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setParentId(user.uid);

        try {
          // Fetch parent profile to get children UIDs
          const parentDocSnap = await getDoc(doc(db, 'users', user.uid));

          if (parentDocSnap.exists()) {
            const parentData = parentDocSnap.data();
            const childrenIds = parentData.children || [];

            if (childrenIds.length > 0) {
              // Fetch full child profiles
              const childProfiles = await Promise.all(
                childrenIds.map(async (childId: string) => {
                  const childDoc = await getDoc(doc(db, 'users', childId));
                  if (childDoc.exists()) {
                    const data = childDoc.data();
                    return {
                      id: childId,
                      displayName: data.displayName || 'Unnamed Child',
                      age: data.age,
                      email: data.email,
                    };
                  }
                  return null;
                })
              );

              setChildren(childProfiles.filter((child): child is Child => child !== null));
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load children';
          setError(message);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleRefresh = async () => {
    if (!parentId) return;

    try {
      const parentDocSnap = await getDoc(doc(db, 'users', parentId));

      if (parentDocSnap.exists()) {
        const parentData = parentDocSnap.data();
        const childrenIds = parentData.children || [];

        if (childrenIds.length > 0) {
          const childProfiles = await Promise.all(
            childrenIds.map(async (childId: string) => {
              const childDoc = await getDoc(doc(db, 'users', childId));
              if (childDoc.exists()) {
                const data = childDoc.data();
                return {
                  id: childId,
                  displayName: data.displayName || 'Unnamed Child',
                  age: data.age,
                  email: data.email,
                };
              }
              return null;
            })
          );

          setChildren(childProfiles.filter((child): child is Child => child !== null));
        } else {
          setChildren([]);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh children';
      setError(message);
    }
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
  };

  const handleCancelEdit = () => {
    setEditingChild(null);
  };

  const handleChildFormSuccess = async () => {
    await handleRefresh();
    setEditingChild(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!parentId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to manage children</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <ParentNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Children
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your children&apos;s profiles
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Children List */}
          <ChildList
            children={children}
            parentId={parentId}
            onDeleteSuccess={handleRefresh}
            onEdit={handleEditChild}
            isLoading={isLoading}
          />
        </div>

        <div className="my-12 border-t border-gray-300 dark:border-slate-700"></div>

        <div className="space-y-8">
          {/* Add Child Form */}
          <AddChildForm
            parentId={parentId}
            onSuccess={handleChildFormSuccess}
            editingChild={editingChild || undefined}
            onCancel={handleCancelEdit}
          />
        </div>
      </main>
    </div>
  );
}
