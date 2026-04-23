'use client';

export default function Children() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Children
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your children's profiles
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            TODO: Implement children management view
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            - List child profiles
            - Add new child
            - Edit child details
          </p>
        </div>
      </main>
    </div>
  );
}
