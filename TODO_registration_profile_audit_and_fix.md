# TODO — Registration & Profile Completion (Backend + Frontend)

## Step 1 — Inspect (DONE via audit)
- [x] Inspect auth flow (AuthPage, ProviderRegisterPage, authController)
- [x] Inspect users table schema (migration + initTables)
- [x] Inspect current profile route + ProfilePage
- [x] Inspect api.ts userApi methods

## Step 2 — Database changes
- [ ] Extend `users` table with nullable profile fields using existing migration/init strategy
  - phone (already exists)
  - gender
  - date_of_birth
  - profession
  - education
  - location
  - bio
  - interests
  - relationship_goal
  - marital_status
  - avatar_url

## Step 3 — Backend profile endpoints
- [ ] Update GET `/api/user/profile` to return full profile shape
- [ ] Add PUT `/api/user/profile` with validation and field filtering

## Step 4 — Frontend
- [ ] Update `ProfilePage.tsx` to load full profile and render editable form
- [ ] Add avatar picker + preview (base64) and save via `PUT /api/user/profile`

## Step 5 — Wire API client
- [ ] Update `src/utils/api.ts` with `userApi.updateProfile` (and correct profile types)

## Step 6 — Verify
- [ ] Run `npm run build` (frontend) and fix TS errors
- [ ] Ensure no duplicate APIs and backward compatibility

