# TODO

## Deposit screenshot REQUIRED (implementation checklist)

### Done
- [x] Update WalletPage.tsx (Deposit modal)
  - [x] Screenshot selection mandatory
  - [x] Validation message: “Please upload your payment screenshot.”
  - [x] Disable Deposit button while screenshot is uploading
  - [x] Prevent multiple uploads concurrently
  - [x] Reuse existing image upload API (upload/avatar API) with server folder deposits (backend already routes deposits)
  - [x] Validate file type (jpg/jpeg/png/webp) and size <= 5 MB
  - [x] Show upload progress/loading
  - [x] Upload screenshot and send returned image URL as screenshot_url
- [x] Admin pending deposits show screenshot requirement status
- [x] Admin “View Screenshot” opens full uploaded image in new tab

### Remaining / confirm
- [ ] Confirm backend stores screenshot_url into `deposit_requests.screenshot_url` and admin pending list includes it (already present in walletService)
- [ ] Run lint/typecheck/build to ensure WalletPage compiles
- [ ] Manual verification: cannot submit deposit without successful screenshot upload

