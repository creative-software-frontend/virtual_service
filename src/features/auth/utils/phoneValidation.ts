// Shared Bangladesh mobile number validation used by signup forms and backend.
//
// Rules:
//  - Country code is fixed to +880 (not editable by the user).
//  - The user types only the remaining 10 digits.
//  - Digits only, maximum 10 digits.
//  - First digit must be 1.
//  - Second digit must be one of 3,4,5,6,7,8,9 (valid BD mobile prefixes).
//  - Exactly 10 digits required for a valid number.

export const BD_COUNTRY_CODE = '+880';

// Matches exactly 10 digits where the first is 1 and the second is 3-9.
export const BD_MOBILE_REGEX = /^1[3-9]\d{8}$/;

export const BD_PHONE_ERROR = 'Please enter a valid Bangladesh mobile number.';

// Returns true only when the input is exactly 10 valid BD mobile digits.
export function isValidBdMobile(digits: string): boolean {
    return BD_MOBILE_REGEX.test(digits);
}

// Strips everything except digits and caps the length at 10.
export function sanitizeBdMobileInput(value: string): string {
    return value.replace(/\D/g, '').slice(0, 10);
}
