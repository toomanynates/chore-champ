# Deployment Guide for Chore Champ

## Pre-Deployment Checklist

### 1. Code Quality
- [x] All tests passing: `npm run test`
- [x] No TypeScript errors: `npm run build`
- [x] Linting passes: `npm run lint`
- [ ] Coverage report generated: `npm run coverage`

### 2. Firebase Setup
- [ ] Firebase project created at [https://firebase.google.com](https://firebase.google.com)
- [ ] Firestore Database initialized (production mode)
- [ ] Authentication enabled (Email/Password provider)
- [ ] Firestore security rules deployed (see `firestore.rules`)
- [ ] Firebase config values copied from Project Settings

### 3. Environment Variables
- [ ] `.env.local` created with all Firebase credentials
- [ ] All `NEXT_PUBLIC_FIREBASE_*` variables set correctly
- [ ] `.env.local` added to `.gitignore` (already configured)

### 4. Local Testing
- [ ] Run `npm run build` successfully
- [ ] Run `npm run dev` and test in browser
- [ ] Test parent login flow
- [ ] Test child login flow
- [ ] Test task creation and completion flow
- [ ] Test ledger and star tracking

---

## Vercel Deployment Steps

### Step 1: Link to Vercel
```bash
npm install -g vercel
vercel login
vercel link
```

### Step 2: Add Environment Variables
In Vercel dashboard (`vercel.com`):
1. Go to Project Settings → Environment Variables
2. Add these variables (from your Firebase project):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 3: Configure Firestore
1. Go to Firebase Console → Firestore Database
2. Go to "Rules" tab
3. Replace with contents of `firestore.rules`
4. Click "Publish"

### Step 4: Deploy
```bash
vercel deploy --prod
```

Or push to a GitHub branch and Vercel will auto-deploy on merge.

---

## Post-Deployment Verification

### 1. Check Deployment
- [ ] Visit the Vercel URL
- [ ] Page loads without errors (check browser console)
- [ ] Responsive design works on mobile

### 2. Test Authentication
- [ ] Parent login works with email/password
- [ ] Child login works with PIN
- [ ] Redirect to dashboard after login
- [ ] Logout works

### 3. Test Core Features
- [ ] Create a task as parent
- [ ] Assign task to child
- [ ] Mark task complete as child
- [ ] Check star in ledger after parent approval
- [ ] View stars on child dashboard

### 4. Monitor Errors
- Check Vercel deployment logs: `vercel logs`
- Monitor Firebase: Console → Logs in Firebase
- Browser DevTools for client-side errors

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
vercel env pull .env.local
npm install --legacy-peer-deps
npm run build
```

### Environment Variables Not Working
- Verify in Vercel dashboard that all `NEXT_PUBLIC_*` vars are set
- Redeploy after adding env vars: `vercel deploy --prod`
- Check `.env.local.example` for correct variable names

### Firebase Authentication Issues
- Verify Firebase project ID matches env var
- Check Firestore Rules are published (not in test mode)
- Ensure Firebase authentication is enabled in project

### Firestore Security Errors (403)
- Check `firestore.rules` is deployed
- Verify user is authenticated before Firestore reads
- Monitor Firebase Logs tab for specific rule violations

---

## Performance Optimization (v2)

- [ ] Enable Next.js Image Optimization
- [ ] Add Firebase Analytics
- [ ] Configure CDN caching headers
- [ ] Implement Redis caching for ledger queries
- [ ] Add Sentry for error monitoring

---

## Domain & Custom URL

To use a custom domain:
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records per Vercel's instructions
4. Update Firebase Authorized Domains if needed

---

## Rollback Plan

If deployment breaks:
```bash
# View previous deployments
vercel list

# Rollback to previous version
vercel rollback
```

Or revert git commit and redeploy.

---

## Next Steps After Deployment

1. Create user accounts (parent + children)
2. Set up first family hierarchy
3. Create sample tasks
4. Test complete workflow
5. Gather feedback from users
6. Plan v2 features (see TASKS.md)
