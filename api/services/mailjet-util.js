const Mailjet = require('node-mailjet');
const log = require('./log').log;


module.exports = {
    sendOTPEmail: async function (to, subject, text, html) {
        const mailjet = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY
        );
        log("TO: " + to);
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "kiennt.k54@gmail.com",
                            Name: "Legrand 3-party OTP"
                        },
                        To: [
                            {
                                Email: to,
                                Name: "USER"
                            }
                        ],
                        Subject: subject,
                        TextPart: text,
                        HTMLPart: html
                    }
                ]
            });

        try {
            const result = await request;
            log("data: " + result.body);
            return result.body;
        } catch (error) {
            sails.log.error('Error sending email:', error);
            throw error;
        }
    }
};