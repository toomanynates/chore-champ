'use client';

export default function ChildSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Adjust how things look and sound
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TODO: Implement child settings view
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <div>- Read-aloud toggle and settings</div>
              <div>- Big Button Mode option</div>
              <div>- Accessibility options</div>
              <div>- Sound effects toggle (v2)</div>
              <div>- Font size adjustment</div>
            </p>
          </div>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Accessibility Settings:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Read-aloud (Web Speech API)</li>
              <li>• Big Button Mode (larger touch targets)</li>
              <li>• High contrast option (v2)</li>
              <li>• Sound effects (v2)</li>
              <li>• Font size adjustment</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
