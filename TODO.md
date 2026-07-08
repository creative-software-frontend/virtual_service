# TODO

## Membership authorization (DB-driven)
- [x] Investigate existing membershipMiddleware.js and routes usage
- [x] Verify DB tables `features` and `package_features` exist
- [x] Verify package_features schema & sample rows
- [ ] Replace hardcoded membership feature mapping with DB-driven checkFeatureAccess(featureName)
- [ ] Enforce error messages exactly:
  - [ ] no membership: "This feature requires membership"
  - [ ] expired: "Membership expired"
  - [ ] locked: "Upgrade membership to access this feature"
- [ ] Protect routes:
  - [ ] partner search
  - [ ] chat
  - [ ] unlimited profile views
  - [ ] premium routes
- [ ] Remove debug logs from membershipController.js and MembershipPage.tsx (if present)
- [ ] Smoke test flows: buy membership, access denied, access granted

