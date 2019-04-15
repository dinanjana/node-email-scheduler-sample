/**
 * Created by dinanjanag on 4/15/19.
 */
const { SENT_COL, QUEUE_COL, FAILED_COL, SYDNEY_TZ } = require('../Constants');
const { insertEmail } = require('../repository/db');
const ObjectId = require("mongodb").ObjectID;
const moment = require('moment-timezone');
const uuid = require('uuid/v1');

const shouldEmailBeQueued = () => {
  const EIGHT_AM = moment({ hour: 8, minute: 0 }).tz(SYDNEY_TZ);
  const FIVE_PM = moment({ hour: 17, minute: 0 }).tz(SYDNEY_TZ);
  const currentTime = moment().tz(SYDNEY_TZ);
  return currentTime.isAfter(EIGHT_AM) && currentTime.isBefore(FIVE_PM);
};

const sendEmail = (email) => {
  let status = SENT_COL;
  if (shouldEmailBeQueued()) {
    status = QUEUE_COL;
  }
  const id = ObjectId();
  insertEmail(id, email, status);

  return {status, id};
};

module.exports = {
  sendEmail,
};