# PROJECT: FAMILY TASK & REWARD APP (PARENT / CHILD)

---

# SYSTEM ARCHITECTURE

## Stack
- Frontend: Next.js 14 (App Router)
- Backend: Next.js API Routes (Node.js)
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Hosting: Vercel

## Architecture Principles
- Use server components by default
- Use client components only when necessary (interactivity)
- All write operations go through API routes
- Keep business logic in `/lib/services`
- Keep Firebase access only in backend/server layer
- Avoid duplicate logic across UI components

---

# PROJECT STRUCTURE

/app
  /parent
    /login
    /signup
    /page.tsx
  /child
    /login
    /page.tsx
  /api

/components
/lib
  /firebase
  /services
  /utils

/models
/styles

---

# DATA MODELS

## ParentProfile
- id: string (Firebase uid)
- email: string
- displayName: string
- role: "parent"
- children: string[] (array of child UIDs)
- createdAt: string (ISO timestamp)

## User
- id: string
- role: "parent" | "child"
- parentId: string | null
- name: string
- avatar: string
- pin: string | null

## Task
- id: string
- name: string
- description: string
- icon: string
- starValue: number
- repeatRule: object
- assignedChildrenIds: string[]
- active: boolean

## TaskCompletion
- id: string
- taskId: string
- childId: string
- status: "pending" | "approved" | "rejected"
- completedAt: timestamp

## LedgerEntry
- id: string
- childId: string
- delta: number
- reason: string
- createdAt: timestamp

## Notification
- id: string
- parentId: string
- type: string
- read: boolean
- createdAt: timestamp

---

# GLOBAL UI PATTERN

- Home screen = responsive grid of navigation cards
- Each card includes:
  - Icon
  - Title
  - Summary sentence
  - Optional bullet list (1–3 bullets)

## Layout Behavior
- Mobile: vertical scroll
- Desktop: multi-column grid

---

# CHILD UI

## Child Home Dashboard (Grid of Cards)

1. My Tasks  
   “See what you need to do today.”  
   - mark tasks done  
   - read-aloud  
   - overdue (v2)

2. Stars & Badges  
   “See your stars and achievements.”  
   - star total  
   - recent rewards  
   - badges  

3. My Profile  
   “Change your picture or theme.”  
   - profile picture  
   - mode toggle  

4. Settings  
   “Adjust how things look and sound.”  
   - read-aloud  
   - accessibility  

---

## Child Task List — Standard Mode

Sections:
- Today
- Overdue (v2)

Task Row:
- Checkbox / Done button
- Icon
- Title
- Star value
- Repeat indicator

---

## Child Task List — Big Button Mode

- Large tiles (icon + title + star value)
- Tap → Task Detail

On “Mark as Done”:
- Trigger animation (confetti / star burst)
- Create TaskCompletion (pending)
- Create LedgerEntry (pending)
- Trigger notification placeholder

---

## Child Stars & Badges

- Total stars (computed from ledger)
- Ledger list (read-only)

Badges:
- Daily streaks
- Weekly completion
- All-time milestones

- Rewards store → placeholder (v2)

---

# PARENT UI

## Parent Home Dashboard (Grid of Cards)

1. Children  
2. Tasks  
3. Stars & Ledger  
4. Notifications  
5. Reports  
6. Settings  

Each card includes summary + bullet points per original spec.

---

# PARENT VIEW OF A CHILD

## Child Detail Screen (Grid of Cards)

1. Child Tasks  
2. Stars & Consequences  
3. Badges  
4. Child Settings  

---

# TASK MANAGEMENT

## Task List
- Name
- Assigned children
- Star value
- Repeat rule
- Active / paused

## Task Editor
Fields:
- Name
- Description
- Icon
- Star value
- Repeat rule:
  - number
  - unit (day/week/month/year)
  - end condition (none / date / occurrences)
  - daysOfWeek (optional)
- Assign to children

---

# STARS & LEDGER SYSTEM

## Rules
- Every reward or consequence = LedgerEntry
- Total stars = sum of all entries
- Parents can manually add consequences
- Negative values subtract stars

---

# TASK COMPLETION FLOW

1. Child marks task complete
2. Create TaskCompletion (status = pending)
3. Create Notification (unread)
4. Parent approves/rejects
5. On approval:
   - Create LedgerEntry (+stars)
6. On rejection:
   - No ledger change

---

# NOTIFICATIONS (V1 SCAFFOLD)

Parent settings:
- none (default)
- email (placeholder)
- push (placeholder)
- in-app (basic)

Trigger:
- Task completion → notification created

---

# ANIMATIONS

## V1
- CSS/JS confetti or star burst

## V2 (TODO)
- Character animations
- Sound effects
- Level-up screens

---

# ACCESSIBILITY

- Read-aloud (Web Speech API)
- Big Button Mode
- High contrast (v2)

---

# TESTING (V1)

Unit tests for:
- Repeat rule logic
- Ledger calculations
- Task completion flow

---

# DEPLOYMENT

- Configure for Vercel
- Environment variables:
  - Firebase config
  - Auth keys

---

# VERSIONING

## V1 (FULLY IMPLEMENT)
- Parent login
- Child login (PIN)
- Dashboards
- Task system
- Repeat rules
- Task completion + approval
- Ledger system
- Animations
- Read-aloud
- Big Button Mode
- Notification scaffold
- Basic tests
- Deployment ready

## V2 (SCAFFOLD ONLY WITH TODO COMMENTS)
- Overdue tasks
- Rewards store
- Advanced animations
- Sound effects
- Level system
- Push/email notifications
- Reports
- Multi-parent households
- Offline mode

---

# AGENT EXECUTION RULES

- Do NOT install unnecessary dependencies
- Prefer simple, clean solutions
- Complete all V1 features before V2 scaffolding
- Add TODO comments for all V2 features
- Keep code modular and readable
- Avoid duplication
- Ensure app runs locally before moving on

---

# DELIVERABLE

Generate:
- Complete Next.js project
- Firebase integration
- All pages, routes, and components
- API endpoints for all operations
- Fully working V1 features
- V2 scaffolding with TODOs
- Clean, scalable structure suitable for future React Native monorepo