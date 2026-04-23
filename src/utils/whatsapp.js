const sendWhatsApp = async (to, message, idempotencyKey, clientReference) => {
  const apiKey = process.env.WA_API_KEY;
  const baseUrl = process.env.WA_API_URL || 'https://ppl.adharidwan.com';

  if (!apiKey) return;

  const body = { to, message };
  if (clientReference) body.client_reference = clientReference;

  console.log(`[WhatsApp] Sending to ${to}, key=${idempotencyKey}`);
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
