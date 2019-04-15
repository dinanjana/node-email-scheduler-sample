/**
 * Created by dinanjanag on 4/15/19.
 */
const sgMail = require('@sendgrid/mail');
const { FROM } = require('../Constants');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = ({to, content, subject}) => {
  const msg = { to, from: FROM, subject, text: content };
  return sgMail.send(msg);
};

module.exports = {
  sendMail
};