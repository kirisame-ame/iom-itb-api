const cron = require('node-cron');
const { Op } = require('sequelize');
const { forgotPassword, BroadcastSettings } = require('../models');
const runBroadcast = require('../services/broadcast/runBroadcast');

const forgotPasswordJob = cron.schedule('*/10 * * * *', async () => {
    const now = Date.now();
    try {
        const result = await forgotPassword.destroy({
            where: {
                expiredAt: {
                    [Op.lt]: now
                }
            }
        });
        if (result > 0) {
            console.log('Expired token deleted');
        }else {
            console.log('No expired token found');
        };
    } catch (error) {
        console.error(error);
    }
});

// Runs daily at 08:00 to check and fire due broadcast settings
const broadcastJob = cron.schedule('0 8 * * *', async () => {
    console.log('[Broadcast] Running scheduled broadcast check...');
    try {
        const settings = await BroadcastSettings.findAll({ where: { isActive: true } });
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon ... 7=Sun
        const dayOfMonth = today.getDate();

        for (const setting of settings) {
            const isDue = isDueBroadcast(setting, today, dayOfWeek, dayOfMonth);
            if (isDue) {
                console.log(`[Broadcast] Firing: ${setting.name}`);
                await runBroadcast(setting.id).catch((err) =>
                    console.error(`[Broadcast] Error for setting ${setting.id}:`, err.message)
                );
            }
        }
    } catch (err) {
        console.error('[Broadcast] Cron error:', err.message);
    }
});

function isDueBroadcast(setting, today, dayOfWeek, dayOfMonth) {
    const { scheduleInterval, scheduleDay, lastRunAt } = setting;

    if (scheduleInterval === 'weekly') {
        if (dayOfWeek !== scheduleDay) return false;
    } else if (scheduleInterval === 'monthly') {
        if (dayOfMonth !== scheduleDay) return false;
    } else if (scheduleInterval === '3months') {
        if (dayOfMonth !== scheduleDay) return false;
        // Only fire if lastRunAt is null or more than ~85 days ago
        if (lastRunAt) {
            const diff = (today - new Date(lastRunAt)) / (1000 * 60 * 60 * 24);
            if (diff < 85) return false;
        }
    }

    // Avoid running twice on the same day
    if (lastRunAt) {
        const last = new Date(lastRunAt);
        if (
            last.getFullYear() === today.getFullYear() &&
            last.getMonth() === today.getMonth() &&
            last.getDate() === today.getDate()
        ) return false;
    }

    return true;
}

module.exports = { forgotPasswordJob, broadcastJob };