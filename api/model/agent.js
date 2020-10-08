const { Double } = require("bson");
const Joi = require("joi");
const mongoose = require("mongoose");

const Agent = mongoose.model(
  "Agent",
  new mongoose.Schema({
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
  })
);

function validateAgent(item) {
  const schema = {
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    zipcode: Joi.string().required(),
    profession: Joi.string().required(),
  };
  return Joi.validate(item, schema);
}

exports.Agent = Agent;
exports.validate = validateAgent;
