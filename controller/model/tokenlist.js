const Joi = require("joi");
const mongoose = require("mongoose");

const Tokenlist = mongoose.model(
  "Tokenlist",
  new mongoose.Schema({
    userid: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  })
);

function validateTokenlist(item) {
  const schema = {
    userid: Joi.string().required(),
    token: Joi.string().required(),
  };
  return Joi.validate(item, schema);
}

exports.Tokenlist = Tokenlist;
exports.validate = validateTokenlist;
