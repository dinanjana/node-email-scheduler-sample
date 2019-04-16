/**
 * Created by dinanjanag on 4/14/19.
 */
const DB_URL = 'mongodb+srv://emailApi:gJq3w393THm3pGbQ@email-test-cluster-yubpp.mongodb.net/test?retryWrites=true';
const DATABASE = 'emails';
const QUEUE_COL = 'queued';
const SENT_COL = 'sent';
const FAILED_COL = 'failed';
const EMAIL_STATUS = 'status';
const SYDNEY_TZ = 'Australia/Sydney';
const EMAIL_STATE = {
  QUEUE_COL,
  SENT_COL,
  FAILED_COL,
};
const METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};
const FROM = 'test@test.com';
const DELAY = 1000 * 60 * 60;
module.exports = {
  DB_URL,
  DATABASE,
  QUEUE_COL,
  SENT_COL,
  FAILED_COL,
  EMAIL_STATUS,
  SYDNEY_TZ,
  METHODS,
  FROM,
  DELAY,
  EMAIL_STATE,
};