import Joi from "joi";

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
