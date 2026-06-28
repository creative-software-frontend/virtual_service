# TODO: Registration + Profile Completion (per instructions)

## Confirmed scope revision
- Keep registration simple: name, email, phone, password (+confirm). No profile fields in registration.
- Complete ProfilePage as separate module after login.

## Planned implementation steps
1. Update `src/features/dashboard/pages/ProfilePage.tsx`
   - Display profile fields from `GET /api/user/profile`.
   - Add edit form for avatar + gender + date_of_birth + profession + education + location + bio + interests + relationship_goal + marital_status.
   - Save via `PUT /api/user/profile`.
2. Implement avatar selection/preview/base64 conversion in `ProfilePage.tsx` using the same approach as existing base64 usage in the codebase.
3. Ensure input handling/serialization matches existing API types:
   - `interests` as string (or null)
   - `date_of_birth` as YYYY-MM-DD string (or null)
   - `avatar_url` as base64 data URL (or null)
4. Run `npm run build`
   - Fix TypeScript errors.
   - Remove unused imports.
5. Final verification
   - Confirm `GET/PUT /api/user/profile` work with edited payloads.
   - Ensure role/email changes are not allowed by backend (already enforced).

