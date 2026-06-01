'use client';

import { useEffect, useState } from 'react';
import { initializeApp, deleteApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateEmail,
} from 'firebase/auth';
import { doc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { firebaseConfig } from '@/lib/firebase/config';

interface EditChildData {
  id: string;
  displayName: string;
  age?: number;
  email?: string | null;
}

interface AddChildFormProps {
  parentId: string;
  onSuccess: () => void;
  editingChild?: EditChildData;
  onCancel?: () => void;
}

export function AddChildForm({ parentId, onSuccess, editingChild, onCancel }: AddChildFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    age: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (editingChild) {
      setFormData({
        email: editingChild.email ?? '',
        password: '',
        displayName: editingChild.displayName,
        age: editingChild.age ? String(editingChild.age) : '',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        displayName: '',
        age: '',
      });
    }
  }, [editingChild]);

  const isEditing = Boolean(editingChild);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!formData.displayName) {
        throw new Error('Child name is required');
      }

      if (isEditing) {
        const normalizedEmail = formData.email.trim().toLowerCase();
        const updates: { displayName: string; age?: number; email?: string | null } = {
          displayName: formData.displayName,
          email: normalizedEmail || null,
        };

        if (formData.age !== '') {
          updates.age = parseInt(formData.age);
        }

        if (formData.password) {
          throw new Error(
            'Password updates require backend auth support and are not available in this version.'
          );
        }

        await updateDoc(doc(db, 'users', editingChild!.id), updates);
        setSuccess(`Child "${formData.displayName}" updated successfully!`);
        onSuccess();
      } else {
        if (!formData.password || formData.password.length < 4) {
          throw new Error('Password must be at least 4 characters');
        }

        const normalizedEmail = formData.email.trim().toLowerCase();
        const childApp = initializeApp(firebaseConfig, `child-app-${Date.now()}`);
        const childAuth = getAuth(childApp);

        try {
          const userCredential = await createUserWithEmailAndPassword(
            childAuth,
            normalizedEmail || `child-temp-${Date.now()}-${Math.floor(Math.random() * 100000)}@kids.chorechamp.local`,
            formData.password
          );
          const childId = userCredential.user.uid;
          const hiddenEmail = `child-${childId}@kids.chorechamp.local`;
          const authEmail = normalizedEmail || userCredential.user.email || hiddenEmail;

          // Persist the auth email used for signing in. For children without a provided
          // email we store the temporary auth email returned by createUserWithEmailAndPassword.
          await setDoc(doc(db, 'users', childId), {
            id: childId,
            parentId,
            email: normalizedEmail || null,
            authEmail: authEmail,
            displayName: formData.displayName,
            age: formData.age ? parseInt(formData.age) : undefined,
            role: 'child',
            createdAt: Timestamp.now().toDate().toISOString(),
          });

          await updateDoc(doc(db, 'users', parentId), {
            children: arrayUnion(childId),
          });
        } finally {
          await signOut(getAuth(childApp));
          await deleteApp(childApp);
        }

        const addedName = formData.displayName;
        setFormData({
          email: '',
          password: '',
          displayName: '',
          age: '',
        });
        setSuccess(`Child "${addedName}" added successfully!`);
        onSuccess();
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save child profile';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit Child' : 'Add a New Child'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Child Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Child's Name *
          </label>
          <input
            type="text"
            required
            value={formData.displayName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
            }
            placeholder="e.g., Emma"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Age
          </label>
          <input
            type="number"
            min="1"
            max="18"
            value={formData.age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, age: e.target.value }))
            }
            placeholder="e.g., 8"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email {isEditing ? '(managed by auth, cannot be changed here)' : '(optional)'}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="e.g., emma@example.com"
            disabled={isEditing}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          {isEditing && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Child login email is managed by Firebase auth and cannot be updated from this form.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isEditing ? 'Password (not editable here)' : 'Password *'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={isEditing ? 'Password cannot be changed here' : 'Enter a password'}
            disabled={isEditing}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          {isEditing && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Password updates are not supported in this version. Leave this field blank and save to keep the current password.
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full mt-6"
      >
        {isLoading
          ? isEditing
            ? 'Saving...'
            : 'Adding Child...'
          : isEditing
          ? 'Save Child'
          : 'Add Child'}
      </button>

      {isEditing && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary w-full mt-3"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
