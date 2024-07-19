const Mailjet = require('node-mailjet');
const log = require('./log').log;


module.exports = {
    sendOTPEmail: async function (to, text, otp) {
        const mailjet = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY
        );
        var html = '<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">'
            + '< div style = "margin:50px auto;width:70%;padding:20px 0" >'
            + '<p style="font-size:1.1em">Hi,</p>'
            + '<p>Use the following OTP to complete your Forgot Password procedures. OTP is valid for 2 days</p>'
            + '<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">' + otp +'</h2>'
            + '<hr style="border:none;border-top:1px solid #eee" />'
            // + '<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">'
            // + '<p>Your Brand Inc</p>'
            // + '<p>1600 Amphitheatre Parkway</p>'
            // + '<p>California</p>'
            // + '</div>'
            + '</div>'
            + '</div>'
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
                        Subject: "Forgot Password OTP",
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