'use strict';

function sanitizePhoneInput(rawValue) {
  if (rawValue === null || rawValue === undefined) {
    return '';
  }

  const text = String(rawValue).trim();
  if (!text) {
    return '';
  }

  // Keep digits and plus only. Remove spaces, dashes, parentheses, dots, etc.
  const cleaned = text.replace(/[^\d+]/g, '');

  // If there are multiple plus signs, keep only the first one when it is leading.
  if (cleaned.startsWith('+')) {
    return `+${cleaned.slice(1).replace(/\+/g, '')}`;
  }

  return cleaned.replace(/\+/g, '');
}

function normalizeWhatsAppRecipient(rawValue, options = {}) {
  const defaultCountryCode = String(options.defaultCountryCode || '62').replace(/\D/g, '') || '62';
  const sanitized = sanitizePhoneInput(rawValue);

  if (!sanitized) {
    return {
      isValid: false,
      normalized: null,
      reason: 'EMPTY_VALUE',
      rawValue,
      sanitized,
    };
  }

  let normalized = sanitized;

  // Convert international prefix 00XX... to +XX...
  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  if (normalized.startsWith('+')) {
    // Explicit country code format; keep as provided after sanitization.
    normalized = `+${normalized.slice(1).replace(/\D/g, '')}`;
  } else {
    const digitsOnly = normalized.replace(/\D/g, '');

    if (!digitsOnly) {
      return {
        isValid: false,
        normalized: null,
        reason: 'NO_DIGITS',
        rawValue,
        sanitized,
      };
    }

    if (digitsOnly.startsWith('0')) {
      // Local style (Indonesia example 08xx) -> +62xx by default.
      normalized = `+${defaultCountryCode}${digitsOnly.slice(1)}`;
    } else if (digitsOnly.startsWith(defaultCountryCode)) {
      // Already starts with default country code without plus.
      normalized = `+${digitsOnly}`;
    } else {
      // If user entered other country code without plus, normalize to +<digits>.
      normalized = `+${digitsOnly}`;
    }
  }

  const e164Pattern = /^\+[1-9]\d{7,14}$/;
  const isValid = e164Pattern.test(normalized);

  return {
    isValid,
    normalized: isValid ? normalized : null,
    reason: isValid ? null : 'INVALID_E164_FORMAT',
    rawValue,
    sanitized,
  };
}

module.exports = {
  sanitizePhoneInput,
  normalizeWhatsAppRecipient,
};
