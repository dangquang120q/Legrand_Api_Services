const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

module.exports = {
    sendOTPEmail: async function (to, subject, text, html) {
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "legrand3partyotp@alfamail.com",
                            Name: "Legrand 3-party OTP"
                        },
                        To: [
                            {
                                Email: to,
                                Name: ""
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
            return result.body;
        } catch (error) {
            sails.log.error('Error sending email:', error);
            throw error;
        }
    }
};