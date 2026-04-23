'use client';

import Link from 'next/link';

export default function ParentDashboard() {
  const cards = [
    {
      id: 'children',
      title: 'Children',
      summary: 'View and manage your children.',
      icon: '👨‍👩‍👧',
      href: '/parent/children',
      bullets: [
        'View child profiles',
        'Manage household',
      ],
    },
    {
      id: 'tasks',
      title: 'Tasks',
      summary: 'Create and manage chores.',
      icon: '✅',
      href: '/parent/tasks',
      bullets: [
        'Create new tasks',
        'Set repeat rules',
        'Assign to children',
      ],
    },
    {
      id: 'ledger',
      title: 'Stars & Ledger',
      summary: 'Track stars and rewards.',
      icon: '⭐',
      href: '/parent/ledger',
      bullets: [
        'View star totals',
        'Ledger history',
        'Manual adjustments',
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      summary: 'Review pending approvals.',
      icon: '🔔',
      href: '/parent/notifications',
      bullets: [
        'Task completions',
        'Approval queue',
        'Mark as read',
      ],
    },
    {
      id: 'reports',
      title: 'Reports',
      summary: 'View progress and analytics.',
      icon: '📊',
      href: '/parent/reports',
      bullets: [
        'Completion rates',
        'Star trends',
        '(v2: advanced reports)',
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      summary: 'Adjust notifications and preferences.',
      icon: '⚙️',
      href: '/parent/settings',
      bullets: [
        'Notification settings',
        'Theme & accessibility',
        'Account',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Parent Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your family's chores and rewards
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link key={card.id} href={card.href}>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {card.summary}
                  </p>
                  {card.bullets && card.bullets.length > 0 && (
                    <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      {card.bullets.map((bullet, idx) => (
                        <li key={idx}>• {bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
