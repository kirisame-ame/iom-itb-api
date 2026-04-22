'use strict';

const { normalizeWhatsAppRecipient } = require('../../utils/whatsappPhone');

const triggerWhatsappNotificationStub = async ({ formSlug, submission }) => {
  const phoneResult = normalizeWhatsAppRecipient(submission?.extractedWhatsapp, {
    defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '62',
  });

  // Stub only. Replace this function body with real WhatsApp integration later.
  console.info('WHATSAPP_STUB_TRIGGERED', {
    formSlug,
    submissionId: submission?.id,
    tallySubmissionId: submission?.tallySubmissionId,
    whatsappRaw: submission?.extractedWhatsapp || null,
    whatsappNormalized: phoneResult.normalized,
    whatsappValid: phoneResult.isValid,
    whatsappNormalizeReason: phoneResult.reason,
  });
};

module.exports = triggerWhatsappNotificationStub;
