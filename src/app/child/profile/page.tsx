'use client';

export default function ChildProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Personalize your settings
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TODO: Implement child profile view
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <div>- Upload/change profile picture</div>
              <div>- Display child name</div>
              <div>- Theme toggle (light/dark)</div>
              <div>- View and edit personal information</div>
            </p>
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Profile Settings:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Avatar upload</li>
              <li>• Display name</li>
              <li>• Theme preference (light/dark)</li>
              <li>• Theme color (if applicable)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
