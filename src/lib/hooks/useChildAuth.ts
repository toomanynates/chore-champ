'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { ChildProfile } from '@/lib/types';

export function useChildAuth() {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;

      if (!user) {
        setChild(null);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await signOut(auth);
          if (!active) return;
          setChild(null);
          setError('User profile not found. Please log in again.');
          return;
        }

        const data = userDoc.data();
        if (data.role !== 'child') {
          await signOut(auth);
          if (!active) return;
          setChild(null);
          setError('Please use a child account to access this page.');
          return;
        }

        if (!active) return;
        setChild({
          id: user.uid,
          parentId: data.parentId,
          email: data.email ?? null,
          displayName: data.displayName || 'Child',
          age: data.age,
          role: 'child',
          createdAt: data.createdAt || new Date().toISOString(),
        });
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setChild(null);
        setError('Unable to verify child authentication.');
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { child, loading, error };
}
