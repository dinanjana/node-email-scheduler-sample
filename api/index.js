/**
 * Created by dinanjanag on 4/14/19.
 */
const { sendEmail } = require('../service/emailService');
const { METHODS } = require('../Constants');

const POST_EMAIL_PATH = '/v1/emails';
const GET_EMAIL_PATH = '/v1/emails/:id';

const saveEmailHandler = (req, res) => {
  const result = sendEmail(req.body);
  console.log(req.body)
  res.send(result);
};

const handlers = {
  [POST_EMAIL_PATH]: [{method: METHODS.POST, handler: saveEmailHandler}],
  [GET_EMAIL_PATH]: [{}],
};

module.exports = {
  handlers,
};