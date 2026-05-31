# Tally Dev Notes (iom-itb-api)

## 1. What This Module Does
This module ingests Tally submissions from two sources:
1. Historical bootstrap from CSV exports.
2. Realtime ingestion from Tally webhooks.

Data model design:
1. All forms are stored in one table `TallySubmissions`, segmented by `formSlug`.
2. Only `pengajuan_bantuan` has status and catatan workflow tables.
3. WhatsApp number normalization is done at send-time, not forced into DB schema.

## 2. Form Mapping
1. `pendaftaran_anggota`
- CSV: `Form_Pendaftaran_Anggota.csv`
- Webhook: `POST /webhooks/tally/pendaftaran-anggota`

2. `pengajuan_bantuan`
- CSV: `Form_Pengajuan_Bantuan.csv`
- Webhook: `POST /webhooks/tally/pengajuan-bantuan`
- Status workflow active

3. `orang_tua_asuh`
- CSV: `Form_Orang_Tua_Asuh.csv`
- Webhook: `POST /webhooks/tally/orangtua-asuh`

## 3. Common Dev Workflow
## A) First-time setup
1. Run pending migrations:
```bash
npm run migrate
```

2. Run targeted Tally seeder only:
```bash
npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js
```

## B) Daily work
1. Code changes.
2. Start API:
```bash
npm run dev
```

3. Smoke test webhook locally with curl:
```bash
curl -X POST http://localhost:3000/webhooks/tally/pengajuan-bantuan \
  -H "Content-Type: application/json" \
  -d '{"eventId":"evt-local-001","eventType":"FORM_RESPONSE","data":{"submissionId":"LOCAL-TEST-001","respondentId":"RESP-001","formId":"FORM-001","createdAt":"2026-04-22T12:00:00.000Z","fields":[{"label":"Nomor WA untuk WAG IOM-ITBContoh: 08123456789","type":"INPUT_TEXT","value":"081234567890"}]}}'
```

## C) Updating CSV data
1. Keep same filenames.
2. Add new rows.
3. Rerun targeted seeder command above.
4. Seeder is idempotent by `formSlug + tallySubmissionId`.

## 4. Command Rules (Important)
1. Use `npm run migrate` for all pending migrations.
2. Prefer targeted seed command for Tally data, not `npm run seed`.
3. Do not run destructive reset commands in shared environments.

## 5. Controller and Service Map
## Webhook ingestion path
1. Route: `src/routes/tallyWebhooks.js`
2. Controller: `src/controllers/tallyWebhooks.js`
3. Service: `src/services/tallyWebhooks/processTallyWebhook.js`
4. Optional notifier hook: `src/services/tallyWebhooks/triggerWhatsappNotificationStub.js`

Processing behavior:
1. Signature validation (configurable via env).
2. Event dedup by `eventKey` in `TallyWebhookEvents`.
3. Upsert submission into `TallySubmissions`.
4. If `formSlug = pengajuan_bantuan`, initialize status row.
5. Trigger WhatsApp stub after successful DB processing.

## Admin/API read and update path
1. Route: `src/routes/tallySubmissions.js`
2. Controller: `src/controllers/tallySubmissions.js`

Endpoints:
1. `GET /tally-submissions/form/:formSlug`
- Supports pagination and sorting.
- Search is payload text based and may be heavy at large scale.

2. `GET /tally-submissions/form/:formSlug/:tallySubmissionId`
- Returns detail.
- For `pengajuan_bantuan`, includes status and history.

3. `PATCH /tally-submissions/pengajuan-bantuan/:tallySubmissionId/status`
- Update status and or catatan.
- Writes history on every effective change.

## 6. WhatsApp Number Handling
Raw extracted value:
1. Stored in `TallySubmissions.extractedWhatsapp` as received.

Normalization for sender integration:
1. Utility file: `src/utils/whatsappPhone.js`
2. Called in stub: `src/services/tallyWebhooks/triggerWhatsappNotificationStub.js`

Rules:
1. `08xxx` -> `+62xxx` by default.
2. `+628xxx` kept.
3. Explicit `+countrycode` kept.
4. Validation uses E.164-like pattern.

Env:
1. `WHATSAPP_DEFAULT_COUNTRY_CODE=62`

## 7. Environment Variables You Must Set
Minimum Tally-related vars:
1. `TALLY_WEBHOOK_SECRET`
2. `TALLY_WEBHOOK_SIGNATURE_HEADER=tally-signature`
3. `TALLY_WEBHOOK_SIGNATURE_REQUIRED=false` for local, `true` for production
4. `WHATSAPP_DEFAULT_COUNTRY_CODE=62`

CSV bootstrap path override:
1. `SEED_CSV_DIR=/your/private/csv/folder`

## 8. Known Caveats
1. Local server may fail if unrelated modules are missing deps; install missing package first.
2. Route `/tally-submissions/*` is JWT-protected.
3. Signature verification depends on raw body; do not remove `express.raw` registration for `/webhooks/tally`.
4. Search on JSON payload via SQL `LIKE` is acceptable now but not ideal for very large datasets.

## 9. Recommended Next Improvements
1. Add generated indexed columns for high-frequency filter keys.
2. Add per-form explicit phone label allowlist if needed.
3. Replace stub with queue-backed WhatsApp sender and retry policy.
4. Add integration tests for webhook signature and status history behavior.
