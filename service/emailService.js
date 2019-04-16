/**
 * Created by dinanjanag on 4/15/19.
 */
const { SENT_COL, QUEUE_COL, FAILED_COL, EMAIL_STATUS, SYDNEY_TZ } = require('../Constants');
const { insertEmail, getEmail, deleteEmail } = require('../repository/db');
const { sendMail } = require('../repository/email');
const ObjectId = require("mongodb").ObjectID;
const moment = require('moment-timezone');

const shouldEmailBeSent = () => {
  const EIGHT_AM = moment().tz(SYDNEY_TZ).hours(8).minutes(0).seconds(0);
  const FIVE_PM = moment().tz(SYDNEY_TZ).hours(17).minutes(0).seconds(0);
  const currentTime = moment().tz(SYDNEY_TZ);
  return currentTime.isAfter(EIGHT_AM) && currentTime.isBefore(FIVE_PM);
};

const sendEmail = async (email) => {
  let status = QUEUE_COL;
  if (shouldEmailBeSent()) {
    status = SENT_COL;
  }
  const _id = ObjectId();
  if (status === SENT_COL) {
    try {
      await sendMail(email);
    } catch (err) {
      console.error('Email failed to deliver', err);
      status = FAILED_COL;
    }
  }
  insertEmail(_id, email, status);
  return {status, _id};
};

const getEmailForId = (id) => {
  return getEmail(id, EMAIL_STATUS);
};

const deleteQueuedEmail = (id) => {
  return deleteEmail(id, QUEUE_COL);
};

module.exports = {
  sendEmail,
  getEmailForId,
  deleteQueuedEmail,
  shouldEmailBeSent,
};