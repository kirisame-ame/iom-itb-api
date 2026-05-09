const normalizePhone = (phone) => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0')) return '+62' + digits.slice(1);
  if (digits.startsWith('62')) return '+' + digits;
  return '+' + digits;
};

const sendWhatsApp = async (to, message, idempotencyKey, clientReference) => {
  const apiKey = process.env.WA_API_KEY;
  const baseUrl = process.env.WA_API_URL || 'https://ppl.adharidwan.com';

  if (!apiKey) return;

  const normalizedTo = normalizePhone(to);
  const body = { to: normalizedTo, message };
  if (clientReference) body.client_reference = clientReference;

  console.log(`[WhatsApp] Sending to ${normalizedTo} (original: ${to}), key=${idempotencyKey}`);
  try {
    const res = await fetch(`${baseUrl}/api/v1/messages/whatsapp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Idempotency-Key': idempotencyKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(`[WhatsApp] Response ${res.status}:`, text);
  } catch (err) {
    console.error('[WhatsApp] Failed to send notification:', err.message);
  }
};

module.exports = sendWhatsApp;
