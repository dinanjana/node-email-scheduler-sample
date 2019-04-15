/**
 * Created by dinanjanag on 4/14/19.
 */
const { sendEmail, getEmailForId, deleteQueuedEmail } = require('../service/emailService');
const { METHODS } = require('../Constants');
const { validate } = require('./validators/index');
const { _ } = require('lodash');

const POST_EMAIL_PATH = '/v1/emails';
const GET_EMAIL_PATH = '/v1/emails/:id';

const responseMapper = ({_id, status}) =>
  ({id: _id, status: status.toUpperCase()});

const saveEmailHandler = (req, res) => {
  const err = validate(req.body);
  if (err.error) {
    return res.status(400).send(err);
  }
  sendEmail(req.body).then(
    (result) => res.send(responseMapper(result))).catch(
      err => res.status(500).send(err));
};

const getEmailHandler = (req, res) => {
  getEmailForId(req.params.id)
  .then(data => {
    if (_.isEmpty(data)) {
      return res.status(404).send(data);
    }
    res.send(responseMapper(data));
  })
  .catch(err => {
    console.error(`Error occurred while fetching email for id [${req.params.id}]`);
    res.status(500).send(err);
  });
};

const deleteEmailHandler = (req, res) => {
  deleteQueuedEmail(req.params.id)
  .then(data => res.send({id: req.params.id , deleted: data}))
  .catch(err => res.status(500).send(err));
};
const handlers = {
  [POST_EMAIL_PATH]: [{method: METHODS.POST, handler: saveEmailHandler}],
  [GET_EMAIL_PATH]: [{method: METHODS.GET, handler: getEmailHandler},
    {method: METHODS.DELETE, handler: deleteEmailHandler}],
};

module.exports = {
  handlers,
};