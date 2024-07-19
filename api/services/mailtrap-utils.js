const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'kiennt.k54@gmail.com', // Replace with your Mailtrap username
        pass: 'Mrneo1991@!'  // Replace with your Mailtrap password
    }
});

module.exports = transporter;