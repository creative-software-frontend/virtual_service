# TODO — Partner Search & Match Requests

## Step 1 — Inspect
- [x] Determine whether user search endpoint exists
- [x] Determine whether filtering logic exists
- [x] Confirm profile fields support search
- [x] Confirm match/request DB tables exist
- [x] Inspect frontend routing/layout constraints

## Step 2 — Implement
- [ ] Backend: add `match_requests` table via initTables
- [ ] Backend: implement `GET /api/user/search`
- [ ] Backend: implement match request endpoints:
  - [ ] POST `/api/user/match-request`
  - [ ] GET `/api/user/match-request`
  - [ ] POST `/api/user/match-request/:id/accept`
  - [ ] POST `/api/user/match-request/:id/reject`
- [ ] Backend: reuse existing SQL/controller patterns; avoid duplicate SQL logic

- [ ] Frontend: add API wrappers in `src/utils/api.ts`
- [ ] Frontend: add feature folder `src/features/dashboard/pages/partner/`
  - [ ] PartnerSearchPage
  - [ ] MatchRequestsPage
  - [ ] components/ProfileCard
  - [ ] components/ProfileDetailsModal
  - [ ] components/SearchFilters
  - [ ] components/SearchResults
  - [ ] components/MatchRequestButton
  - [ ] hooks/usePartnerSearch
  - [ ] hooks/useMatchRequests
  - [ ] utils/searchValidation
  - [ ] types/partner
- [ ] Frontend: wire routes in `src/routes/index.tsx`
- [ ] Frontend: add BottomNav items in `src/features/dashboard/DashboardLayout.tsx`

## Step 3 — Verify
- [ ] Run `npm run build`
- [ ] Fix TypeScript errors / unused imports
- [ ] Ensure no chat duplication logic


