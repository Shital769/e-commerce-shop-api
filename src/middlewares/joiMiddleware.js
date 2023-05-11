import Joi from "joi";

const SHORTSTRING = Joi.string().max(100);
const LONGSTRING = Joi.string().max(500);
const SHORTREQUIRED = Joi.string().max(100).required();
const LONGREQUIRED = Joi.string().max(500).required();
const EMAIL = Joi.string().email({ minDomainSegments: 2 });
const NUMBER = Joi.number();
const NUMREQUIRED = Joi.number().required();

const joiValidation = (schema, req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    error
      ? res.json({
          status: "error",
          message: error.message,
        })
      : next();
  } catch (error) {
    next(error);
  }
};

//validation for new customer/user
export const newCustomerValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    address: SHORTSTRING.allow("", null),
    email: EMAIL,
    fName: SHORTREQUIRED,
    lName: SHORTREQUIRED,
    password: SHORTREQUIRED,
    phone: SHORTSTRING.allow("", null),
  });

  joiValidation(schema, req, res, next);
};

//validation for email verification
export const emailVerificationValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    emailVerificatiomCode: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

//validation for customer/user login
export const CustomerLoginValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    password: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};

//validation for reset password
export const resetPasswordValidation = (req, res, next) => {
  //conditions
  const schema = Joi.object({
    email: EMAIL,
    password: SHORTREQUIRED,
    otp: SHORTREQUIRED,
  });

  joiValidation(schema, req, res, next);
};
