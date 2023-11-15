const joi = require('joi');

const formValidation = (data) => {
  const schema =   joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        phone_number: joi.string().required(),
        requirements: joi.string().required()
    })
    return schema.validate(data);
}

module.exports = formValidation;