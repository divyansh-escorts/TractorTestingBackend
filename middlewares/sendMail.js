const nodemailer = require('nodemailer');
const fetchSecrets = require('./fetchSecrets');

// async function sendEmail(message, subject, to) {
//     let secrets = await fetchSecrets()
//     var transporter = nodemailer.createTransport({
//         service: "hotmail",
//         auth: {
//             user: secrets.EMAIL_ID,
//             pass: secrets.EMAIL_PASSWORD,
//         },
//     });
//     let mail_list = [to];
//     // console.log(to)
//     var mailOptions = {
//         from: "manav.doda@escorts.co.in",
//         to: mail_list,
//         subject: subject,
//         html: message,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log("Email sent: " + info.response);
//         }
//     });
// }

// module.exports = sendEmail
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");
const credentials = require("../gmail-api/credentials.json");
const tokens = require("../gmail-api/token.json");

const getGmailService = () => {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  oAuth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (message, subject, to) => {
  const options = {
    to,
    subject,
    html: message,
    textEncoding: "base64",
    headers: [
      { key: "X-Application-Developer", value: "Manav Doda" },
      { key: "X-Application-Version", value: "v1.0.0.2" },
    ],
  };
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};

module.exports = sendMail;
