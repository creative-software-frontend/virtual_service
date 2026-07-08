# TODO - Membership / Subscription System

- [x] Step 1: Add membership fields to `users` table (only if missing) in `backend/src/startup/initTables.js`.
- [x] Step 2: Ensure `transactions.type` supports `membership_purchase` in `backend/src/startup/initTables.js` (backward-compatible enum change).


- [x] Step 3: Implement membership permission engine:


  - [ ] `hasFeature(userId, featureName)`
  - [ ] `requireFeature(featureName)` and/or `requireFeatures([...])`
  - [ ] Coming-soon feature response `{ enabled, available:false, message:"Coming Soon" }`
  - [ ] Auto-expiration fallback clears/denies features
  - Location: new middleware/helper under `backend/src/middleware/` (or `backend/src/services/`).
- [x] Step 4: Implement atomic wallet-only purchase endpoint:

  - [ ] `POST /api/user/membership/buy` (or consistent naming)
  - [ ] Uses DB transaction: deduct `users.balance`, set membership dates, insert `transactions` row
  - [ ] Returns updated membership info
  - Location: service + controller + route.
- [ ] Step 5: Protect premium endpoints:
  - [x] `GET /api/user/search` requires `partner_search`
  - [ ] `POST/GET chat` REST endpoints if any; otherwise block via middleware applied to Chat access route(s)
  - [x] `POST /api/user/events/:id/join` requires `tour_access`
  - [ ] Verified badge endpoint/UI data if exists (or gate where shown)

- [ ] Step 6: Implement membership status endpoint for frontend:
  - [ ] `GET /api/user/membership/status`
- [ ] Step 7: Update frontend API client `src/utils/api.ts` with membership endpoints.
- [ ] Step 8: Update `MembershipPage.tsx`:
  - [ ] fetch membership status + wallet balance + package list
  - [ ] render current membership + expiration + wallet balance + upgrade options
  - [ ] button states: Active Plan / Buy Now / Insufficient Balance
  - [ ] free plan should not charge
- [ ] Step 9: Update partner search & chat UI to respect locked/coming soon states based on membership status.
- [ ] Step 10: Run backend startup + basic smoke tests (purchase flow + gating).

