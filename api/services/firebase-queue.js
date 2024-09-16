const Queue = require('bull');
const admin = require('firebase-admin');

const serviceAccount = require('../../config/legrand-app-60159-firebase-adminsdk-3ph31-2daab6b723.json');//'./config/legrand-dev-api-firebase-adminsdk-r0fjc-901a1347a2.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Tạo hàng đợi với Redis
const notificationQueue = new Queue('notificationQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

// Xử lý công việc trong hàng đợi
notificationQueue.process(async (job, done) => {
    const { registrationTokens, message } = job.data;

    try {
        console.log(registrationTokens);
        console.log(message);
        const response = await admin.messaging().sendEachForMulticast({
            tokens: registrationTokens,
            notification: message.title,
            data: message.body
        });
        console.log(JSON.stringify(response[0].error));
        console.log('Successfully sent message:', response);
        done(null, response);
    } catch (error) {
        console.error('Error sending message:', error);
        done(error);
    }
});

module.exports = notificationQueue;
