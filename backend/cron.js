// cronJobs.js
const cron = require('node-cron');
const { checkOverduePayments } = require('./services/overduePaymentChecker');

// Schedule the check to run once a day at midnight
cron.schedule('0 0 * * *', checkOverduePayments);

console.log('Scheduled overdue payment check.');
