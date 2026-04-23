'use client';

import Link from 'next/link';

export default function ChildDashboard() {
  const cards = [
    {
      id: 'tasks',
      title: 'My Tasks',
      summary: 'See what you need to do today.',
      icon: '✅',
      href: '/child/tasks',
      bullets: [
        'Mark tasks done',
        'Read-aloud support',
        '(v2: overdue tasks)',
      ],
    },
    {
      id: 'stars',
      title: 'Stars & Badges',
      summary: 'See your stars and achievements.',
      icon: '⭐',
      href: '/child/stars',
      bullets: [
        'Star total',
        'Recent rewards',
        'Earned badges',
      ],
    },
    {
      id: 'profile',
      title: 'My Profile',
      summary: 'Change your picture or theme.',
      icon: '👤',
      href: '/child/profile',
      bullets: [
        'Profile picture',
        'Theme toggle',
        'Personal settings',
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      summary: 'Adjust how things look and sound.',
      icon: '⚙️',
      href: '/child/settings',
      bullets: [
        'Read-aloud settings',
        'Big button mode',
        'Accessibility options',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Child Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Complete tasks and earn stars!
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link key={card.id} href={card.href}>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="text-5xl mb-3">{card.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {card.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {card.summary}
                  </p>
                  {card.bullets && card.bullets.length > 0 && (
                    <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
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
