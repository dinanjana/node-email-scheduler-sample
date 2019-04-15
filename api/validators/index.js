/**
 * Created by dinanjanag on 4/15/19.
 */
const Joi = require('joi');

const schema = Joi.object().keys({
  to: Joi.string().email({ minDomainAtoms: 2 }).required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
});

const validate = (body) => Joi.validate(body, schema);

module.exports = {
  validate,
};