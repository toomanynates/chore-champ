'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <main className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Chore Champ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage chores, earn rewards, and build good habits together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Parent Card */}
          <Link href="/parent/login">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Parent
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Manage tasks, assign chores, and track progress.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Create and assign tasks</li>
                <li>• Approve completions</li>
                <li>• Track star rewards</li>
              </ul>
            </div>
          </Link>

          {/* Child Card */}
          <Link href="/child/login">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">👧</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Child
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete chores and earn stars and badges.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• View your tasks</li>
                <li>• Mark tasks complete</li>
                <li>• Collect stars and badges</li>
              </ul>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
