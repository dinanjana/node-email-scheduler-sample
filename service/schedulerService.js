/**
 * Created by dinanjanag on 4/15/19.
 */
const { getAllEmails, getEmail, insertEmail, updateStatus, deleteEmail } = require('../repository/db');
const { QUEUE_COL, SENT_COL, FAILED_COL } = require('../Constants');
const { shouldEmailBeSent } = require('./emailService');
const { sendEmail } = require('../repository/email');
const { _ } = require('lodash');

const run = async () => {
  if (shouldEmailBeSent()) {
    const emails = await getAllEmails(QUEUE_COL);
    console.log(`Found [${emails.length} ${JSON.stringify(emails)}] of queued emails to be sent. Sending them now`);
    _.map(emails,
      email => getEmail(email._id, email.status)
      .then((msg) => sendEmail(msg)
        .then(() => updateEmail(email, SENT_COL))
        .catch(() => updateEmail(email, FAILED_COL))
      ));
  }
};

const updateEmail = (email, status) => {
  deleteEmail(email._id, QUEUE_COL);
  insertEmail(email._id, {to: email.to, content: email.content, subject: email.subject}, status);
  updateStatus(email._id, status);
};

module.exports = {
  run,
};