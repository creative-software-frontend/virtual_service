# TODO - Debug membership routing

## Plan step
- [x] Inspect DashboardLayout.tsx navigation configuration
- [x] Inspect route definitions in App.tsx/router configuration
- [x] Verify USER_NAV membership entry points to MembershipPage route
- [x] Verify PROVIDER_NAV membership entry points to ProviderMembershipPage route
- [x] Verify role-based layouts are not sharing the same membership route
- [ ] Implement fix: split membership routes by role and remove accidental ProviderMembershipPage usage for user
- [ ] Run typecheck/lint/build to confirm no regressions

