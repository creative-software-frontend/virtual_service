# TODO

## Membership feature DB-driven repair (AdminSettingsPage)
- [ ] Step 1: Inspect DB: run `SELECT id, feature_key, display_name, scope, is_coming_soon FROM features ORDER BY id;`
- [ ] Step 2: Determine which expected USER feature keys are missing and which have wrong `scope` / `is_coming_soon`.
- [ ] Step 3: Update `backend/src/startup/initTables.js` to seed missing expected USER features using safe existence checks.
- [ ] Step 4: Update `backend/src/startup/initTables.js` to set `is_coming_soon` to match the required mapping.
- [ ] Step 5: Update `src/features/dashboard/pages/AdminSettingsPage.tsx` to remove the hardcoded `USER_FEATURE_OPTIONS` and render all `scope='user'` features.
- [ ] Step 6: Use DB `is_coming_soon` to drive the lock/soon UI (remove hardcoded coming-soon feature key set).
- [ ] Step 7: Verify: re-run SQL to confirm final `COUNT(*)` for `scope='user'` and that all expected keys exist.

