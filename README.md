# Chore Champ 🌟

A family task management and reward system built with Next.js 14, Firebase, and Tailwind CSS.

**Status:** ✅ Complete (v1.0)

---

## Features

### For Parents
- **Task Management** — Create, edit, delete tasks with star values and repeat rules
- **Child Management** — Manage multiple children and assign tasks
- **Approval Workflow** — Review and approve/reject task completions
- **Star Ledger** — Track earned stars, manual adjustments, and transaction history
- **Dashboard** — Overview of all family activity and notifications

### For Children
- **Task List** — View assigned tasks with big, easy-to-tap buttons
- **Task Completion** — Mark tasks complete with celebratory animations
- **Star Tracking** — See earned stars and rewards balance
- **Progress Visualization** — Animated confetti and star bursts on task completion
- **Profile** — View badges and personal stats

### Technical
- 🔐 **Authentication** — Firebase Auth (email/password for parents, PIN for kids)
- 📊 **Real-time Database** — Firestore with security rules
- 🎨 **Responsive UI** — Mobile-first, Tailwind CSS 4 (3+ column grid on desktop)
- ✅ **Test Coverage** — 14 unit tests with Vitest (65% coverage)
- 🚀 **Production Ready** — Vercel deployment configured

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Firebase project (free tier)

### Installation
```bash
npm install --legacy-peer-deps
```

### Setup
1. Create a Firebase project: [firebase.google.com](https://firebase.google.com)
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Firebase credentials
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

### First Use
- Click **Parent** to set up account (email + password)
- Click **Child** to set up account (PIN-based login)
- Create tasks as parent
- Complete tasks as child
- Watch stars accumulate! ⭐

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run coverage` | Generate coverage report |
| `npm run deploy` | Deploy to Vercel (production) |
| `npm run deploy:preview` | Deploy preview to Vercel |

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

Quick version:
```bash
npm run deploy
```

Full setup requires:
1. Vercel account
2. Firebase project
3. Environment variables
4. Firestore security rules deployed

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## Testing

Run tests:
```bash
npm test
```

Generate coverage:
```bash
npm run coverage
```

**Current Coverage:** 65% overall (14 tests passing)

---

## Project Structure

```
src/
├── app/
│   ├── parent/          # Parent dashboard + management
│   ├── child/           # Child dashboard + tasks
│   └── api/             # Next.js API routes
├── components/          # Reusable React components
├── lib/
│   ├── firebase/        # Firebase config
│   ├── services/        # Business logic (with tests)
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Utilities (animations, read-aloud)
└── vitest.config.ts     # Test configuration
```

---

## v2 Roadmap

- [ ] Complex repeat rules (weekly schedules)
- [ ] Overdue task tracking
- [ ] Badges and achievements
- [ ] Rewards store (redeem stars)
- [ ] Read-aloud support
- [ ] Notifications (email, push)
- [ ] Photo verification for tasks

---

**Made with ❤️ for family chores**
