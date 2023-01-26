const nodemailer = require('nodemailer');

const email = '******.******@gmail.com';
const psw = '****************';

exports.send = (string) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: psw
        }
    });
    mailTransporter.sendMail({
            from: email,
            to: email,
            subject: 'Sendmail module test',
            html: string
        }, (err, reply) => {
            err ? console.log(err && err.stack) : console.dir(reply);
        }
    );
}