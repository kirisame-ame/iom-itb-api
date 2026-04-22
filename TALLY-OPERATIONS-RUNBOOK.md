# Tally Operations Runbook (iom-itb-api)

## 1. Purpose
This runbook covers day-to-day operations for the Tally ingestion implementation:
1. Local development workflow.
2. VPS or Coolify deployment workflow.
3. Secure handling of sensitive CSV seed files.
4. Migration and seeding commands (full vs targeted).
5. Webhook testing strategy.
6. Post-deploy verification checklist.

## 2. Current Feature Scope
Implemented scope in iom-itb-api:
1. 3 webhook endpoints:
- POST /webhooks/tally/pendaftaran-anggota
- POST /webhooks/tally/pengajuan-bantuan
- POST /webhooks/tally/orangtua-asuh
2. Canonical submission storage in TallySubmissions.
3. Status and catatan workflow only for pengajuan_bantuan submissions.
4. CSV backfill seeder from fixed file names:
- Form_Pendaftaran_Anggota.csv
- Form_Pengajuan_Bantuan.csv
- Form_Orang_Tua_Asuh.csv

## 3. Local Development Workflow
Use this when API runs on host machine and MySQL runs in Docker.

1. Start MySQL container only:
```bash
docker compose -f docker-compose.yml up -d mysql
```

2. Run migrations:
```bash
npm run migrate
```

3. Seed only Tally backfill seeder:
```bash
npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js
```

4. Start API:
```bash
npm run dev
```

5. If port 3000 is already in use, stop previous server process before restarting.

## 4. Sensitive CSV Handling (Do Not Commit)
CSV files contain sensitive data and must not be pushed to git.

1. Keep sensitive CSVs outside source control.
2. Keep file names fixed so seeder code remains reusable.
3. Use private folder and set SEED_CSV_DIR at runtime.
4. Upload to server via SCP or SFTP, never public URL.

Example local command (Git Bash):
```bash
export SEED_CSV_DIR=/d/private/iom-csv
npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js
```

## 5. Coolify or VPS Deployment Workflow
Use this flow for production or staging deployment.

1. Deploy app using docker-compose.coolify.yml.
2. Ensure environment variables are set in Coolify:
- DB_DATABASE
- MYSQL_ROOT_PASSWORD
- MYSQL_APP_USER
- MYSQL_APP_PASSWORD
- KEYCLOAK_ISSUER_URL
- KEYCLOAK_JWKS_URI
- KEYCLOAK_AUDIENCE
- TALLY_WEBHOOK_SECRET
- TALLY_WEBHOOK_SIGNATURE_HEADER
- TALLY_WEBHOOK_SIGNATURE_REQUIRED
3. Set signature required to true in production.
4. Configure private CSV storage mount in Coolify, for example host path to container path /opt/seed-csv.
5. Run migrations inside app container after deployment.
6. Run targeted Tally seeder only when needed.

Recommended production seed command:
```bash
SEED_CSV_DIR=/opt/seed-csv npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js
```

## 6. Migration and Seeder Command Matrix
Use targeted commands to avoid accidental global resets.

1. Run all pending migrations:
```bash
npm run migrate
```

2. Run migrations up to a specific file:
```bash
npx sequelize-cli db:migrate --config src/config/config.js --to 20260422101500-create-tally-webhook-events.js
```

3. Undo one migration by file name:
```bash
npx sequelize-cli db:migrate:undo --config src/config/config.js --name 20260422101500-create-tally-webhook-events.js
```

4. Run all seeders (not recommended in production by default):
```bash
npm run seed
```

5. Run only Tally seeder (recommended):
```bash
npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js
```

## 7. Webhook Testing Strategy
## Local tests
1. Keep TALLY_WEBHOOK_SIGNATURE_REQUIRED=false in local .env.
2. Test endpoints with curl using sample payloads.

Example:
```bash
curl -X POST http://localhost:3000/webhooks/tally/pengajuan-bantuan \
  -H "Content-Type: application/json" \
  -d '{"data":{"submissionId":"LOCAL-TEST-001","respondentId":"RESP-001","submittedAt":"2026-04-22 10:05:00","No WA":"+628123456789"}}'
```

## Public integration tests with Tally
1. Option A: use temporary tunnel (ngrok or cloudflared) and point Tally webhook there.
2. Option B: deploy to staging server and use https domain directly.
3. Keep signature required=true in internet-exposed environments.

## 8. Post-Deploy Verification Checklist
Run this checklist after each production deploy.

1. Health and connectivity
- API returns healthy response on root endpoint.
- DB connection success in logs.

2. Migrations
- Migration command completes without errors.
- New tables exist:
  - TallySubmissions
  - PengajuanBantuanStatuses
  - PengajuanBantuanStatusHistories
  - TallyWebhookEvents

3. Seeder
- Targeted seeder runs successfully.
- Rerun succeeds without duplicate explosions.

4. Webhooks
- All 3 endpoints return 200 for valid payload.
- Invalid signature returns 401 when signature required is true.
- Duplicate event is ignored correctly.

5. Status workflow
- For pengajuan_bantuan webhook, default status is VERIFIKASI_BERKAS.
- Status update endpoint can update status and catatan.
- History row is written on each status or catatan change.

6. Security
- TALLY_WEBHOOK_SECRET is set and not logged.
- Sensitive CSV files are not present in git repo.
- Sensitive CSV path is private on server.

## 9. Quick Rollback Guidance
If deployment fails after new migration:
1. Stop traffic if needed.
2. Undo latest migration file by name.
3. Redeploy previous stable image.
4. Restore DB backup if required.

Do not use destructive reset commands on production database.
