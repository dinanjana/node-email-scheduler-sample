/**
 * Created by dinanjanag on 4/15/19.
 */
const { getAllEmails, updateStatus } = require('../repository/db');
const { QUEUE_COL, SENT_COL, FAILED_COL } = require('../Constants');
const { shouldEmailBeSent } = require('./emailService');
const { sendMail } = require('../repository/email');
const { _ } = require('lodash');

const run = async () => {
  if (shouldEmailBeSent() || true) {
    const emails = await getAllEmails(QUEUE_COL);
    console.log(`Found [${emails.length}] of queued emails to be sent. Sending them now`);
    _.map(emails, entry => sendMail(entry.email)
      .then(() => updateEmail(entry, SENT_COL))
      .catch((err) => {
        console.error('Error when sending mail', err);
        updateEmail(entry, FAILED_COL);
      })
    );
  }
};

const updateEmail = (entry, status) => {
  updateStatus(entry._id, status);
};

module.exports = {
  run,
};