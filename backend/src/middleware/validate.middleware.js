const { errorResponse } = require('../utils/responseFormat');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    const errors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return errorResponse(res, 400, 'Validation Error', errors);
  }
};
module.exports = validate;
