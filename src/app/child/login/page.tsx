'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { ChildProfile } from '@/lib/types';

type EmailOption = 'have-email' | 'no-email';

type ParentProfile = {
  id: string;
  displayName: string;
};

export default function ChildLogin() {
  const router = useRouter();
  const [stage, setStage] = useState<'parent' | 'child' | 'credentials'>('parent');
  const [parentEmail, setParentEmail] = useState('');
  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [emailOption, setEmailOption] = useState<EmailOption>('no-email');
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedChild = children.find((child) => child.id === selectedChildId);

  const findParent = async () => {
    setError('');
    if (!parentEmail.trim()) {
      setError("Please enter your parent's email");
      return;
    }

    try {
      setLoading(true);
      const normalizedEmail = parentEmail.trim().toLowerCase();
      const parentQuery = query(
        collection(db, 'users'),
        where('role', '==', 'parent'),
        where('email', '==', normalizedEmail)
      );
      const snapshot = await getDocs(parentQuery);

      if (snapshot.empty) {
        setError('No parent was found with that email.');
        return;
      }

      const parentDoc = snapshot.docs[0];
      const parentData = parentDoc.data();
      const childrenIds = Array.isArray(parentData.children) ? parentData.children : [];

      const childProfiles = await Promise.all(
        childrenIds.map(async (childId: string) => {
          const childDoc = await getDoc(doc(db, 'users', childId));
          if (!childDoc.exists()) return null;
          const childData = childDoc.data();
          if (childData.role !== 'child') return null;
          return {
              id: childId,
              parentId: parentDoc.id,
              email: childData.email ?? null,
              authEmail: childData.authEmail ?? (childData.email ?? null),
              displayName: childData.displayName || 'Child',
              age: childData.age,
              role: 'child' as const,
              createdAt: childData.createdAt || '',
            } as ChildProfile;
        })
      );

      const validChildren = childProfiles.filter(
        (child): child is ChildProfile => child !== null
      );

      if (validChildren.length === 0) {
        setError('This parent has no child profiles yet.');
        return;
      }

      setParentProfile({
        id: parentDoc.id,
        displayName: parentData.displayName || 'Parent',
      });
      setChildren(validChildren);
      setStage('child');
    } catch (err) {
      console.error(err);
      setError('Unable to find that parent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chooseChild = (childId: string) => {
    const child = children.find((item) => item.id === childId);
    setSelectedChildId(childId);
    setEmailOption(child?.email ? 'have-email' : 'no-email');
    setLoginEmail('');
    setPassword('');
    setError('');
    setStage('credentials');
  };

  const handleLogin = async () => {
    setError('');

    if (!selectedChild) {
      setError('Please choose a child profile.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (emailOption === 'have-email' && !loginEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (emailOption === 'no-email' && selectedChild.email) {
      setError('This child has an email on file. Please use the email login option.');
      return;
    }

    try {
      setLoading(true);
      const authEmail =
        emailOption === 'have-email'
          ? loginEmail.trim().toLowerCase()
          : selectedChild.authEmail ?? `child-${selectedChild.id}@kids.chorechamp.local`;

      await signInWithEmailAndPassword(auth, authEmail, password);
      router.push('/child');
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <main className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Child Login
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Identify your parent, choose your profile, and sign in.
            </p>
          </div>

          {stage === 'parent' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parent Email
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={findParent}
                className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
              >
                {loading ? 'Finding parent…' : 'Next'}
              </button>
            </div>
          )}

          {stage === 'child' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Parent found: <strong>{parentProfile?.displayName}</strong>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Choose your child profile
                </p>
                <div className="grid gap-3">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => chooseChild(child.id)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-purple-500 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {child.displayName}
                        </span>
                        {child.email ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Email login available
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            No email on file
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStage('parent');
                  setParentProfile(null);
                  setChildren([]);
                  setParentEmail('');
                  setError('');
                }}
                className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
              >
                Back to Parent Selection
              </button>
            </div>
          )}

          {stage === 'credentials' && selectedChild && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Signing in as <strong>{selectedChild.displayName}</strong>
                </p>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="emailOption"
                        value="no-email"
                        checked={emailOption === 'no-email'}
                        onChange={() => setEmailOption('no-email')}
                        disabled={!!selectedChild.email}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-slate-600"
                      />
                      I don't have an email address
                    </label>
                    <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="radio"
                        name="emailOption"
                        value="have-email"
                        checked={emailOption === 'have-email'}
                        onChange={() => setEmailOption('have-email')}
                        disabled={!selectedChild.email}
                        className="w-4 h-4 text-purple-600 border-gray-300 dark:border-slate-600"
                      />
                      I have an email address
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email {emailOption === 'have-email' ? '*' : '(optional)'}
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={emailOption !== 'have-email'}
                      placeholder="child@example.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {selectedChild.email && emailOption === 'no-email' && (
                <div className="bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg text-sm">
                  This child has an email on file. Please select "I have an email address" and sign in with the child&apos;s email.
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStage('child')}
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                >
                  Back to Child Selection
                </button>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}