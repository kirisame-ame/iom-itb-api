'use strict';

const db = require('../models');

async function run() {
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  try {
    await db.sequelize.query('TRUNCATE TABLE PengajuanBantuanStatusHistories');
    await db.sequelize.query('TRUNCATE TABLE PengajuanBantuanStatuses');
    await db.sequelize.query('TRUNCATE TABLE TallyWebhookEvents');
    await db.sequelize.query('TRUNCATE TABLE TallySubmissions');
  } finally {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
  console.log('Cleared: TallySubmissions, TallyWebhookEvents, PengajuanBantuanStatuses, PengajuanBantuanStatusHistories');
  console.log('Re-seed with:');
  console.log('  SEED_CSV_DIR=/path/to/csv npx sequelize-cli db:seed --config src/config/config.js --seed 20260422103000-seed-tally-submissions-from-csv.js');
}

run()
  .then(async () => { await db.sequelize.close(); process.exit(0); })
  .catch(async (err) => { console.error(err); await db.sequelize.close(); process.exit(1); });
