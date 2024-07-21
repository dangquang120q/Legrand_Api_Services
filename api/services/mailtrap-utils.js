const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        // user: '0c919c9033104c', // Replace with your Mailtrap username
        // pass: 'df355faa4303e5'  // Replace with your Mailtrap password
        user: 'api',
        pass: '37c20491f6f2f6f2ae43437920172e6c'
    }
});

module.exports = transporter;