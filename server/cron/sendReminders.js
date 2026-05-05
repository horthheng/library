// cron/sendReminders.js
const cron = require('node-cron');
const borrowController = require('../controllers/borrowController');

//  time for send email remainder
cron.schedule('0 9 * * *', async () => {
  console.log('Checking for near-due borrows...');
  await borrowController.sendReturnReminders();
});
