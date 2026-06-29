# TODO_profile_edit_ui.md

- [ ] Update Edit Profile form in `src/features/dashboard/pages/ProfilePage.tsx`:
  - [ ] Replace **Education** free-text input with single-select dropdown (SSC/HSC/Diploma/Bachelor's/Master's/PhD/Other)
  - [ ] Replace **Marital Status** free-text input with dropdown (Single/Divorced/Widowed)
  - [ ] Replace **Relationship Goal** free-text input with dropdown (Serious Relationship/Marriage/Friendship/Casual Dating/Travel Partner/Activity Partner/Networking/Open to Anything)
  - [ ] Replace **Interests** comma input with tag picker:
    - [ ] Single-select interest dropdown + Add button
    - [ ] Render selected interests as removable chips (×)
    - [ ] Prevent duplicates
    - [ ] Persist chips back into `draft.interests` as comma-separated string
  - [ ] Extend `validateDraft()`:
    - [ ] Education must be selected
    - [ ] Marital Status must be selected
    - [ ] Relationship Goal must be selected
    - [ ] At least one interest selected
- [ ] Keep all existing behavior intact (save/cancel/avatar upload).
- [ ] Ensure TypeScript correctness.
- [ ] Run `npm run build` and fix any TS errors.

