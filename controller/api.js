var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose");
const zipCodeData = require("zipcode-city-distance");

require("./model");

var Agent = mongoose.model("Agent");
var Contact = mongoose.model("Contact");
var Tokenlist = mongoose.model("Tokenlist");

logOut = (req, res, next) => {
  Tokenlist.findOne(
    {
      token: req.token,
    },
    (err, token) => {
      if (err || !token) {
        return res.status(501).json({
          success: false,
          data: {},
          message: "Token extract error",
        });
      }
      token
        .remove()
        .then((item) => {
          return res.status(200).json({
            success: true,
            data: {},
            message: "successful logout!",
          });
        })
        .catch((err) => {
          return res.status(501).json({
            success: false,
            data: {},
            message: "logout error(token remove error)",
          });
        });
    }
  );
};

getAllAgent = (req, res, next) => {
  Agent.find({}, (err, agents) => {
    if (err) {
      return res.status(406).json({
        success: false,
        data: {},
        message: "getting all agents failed!",
      });
    }

    return res.status(200).json({
      message: "all agents!",
      success: true,
      data: agents,
    });
  });
};

getCurrentAgent = (req, res, next) => {
  Agent.findOne(
    {
      _id: req.userid,
    },
    (err, agent) => {
      if (err || !agent) {
        return res.status(406).json({
          success: false,
          data: {},
          message: "getting current agent failed!",
        });
      }
      return res.status(200).json({
        message: "current agent!",
        success: true,
        data: agent,
      });
    }
  );
};

getAllContact = (req, res, next) => {
  Contact.find({}, (err, contacts) => {
    if (err) {
      return res.status(406).json({
        success: false,
        data: {},
        message: "getting all contacts failed!",
      });
    }

    return res.status(200).json({
      message: "all contacts!",
      success: true,
      data: contacts,
    });
  });
};

let getDistances = (zipcode_agent, zipcode_contacts) => {
  result = {};
  zipcode_contacts.forEach((zipcode) => {
    result[zipcode] = zipCodeData.zipCodeDistance(zipcode_agent, zipcode, "K");
  });
  return result;
};

getNearByContact = (req, res, next) => {
  Agent.find({}, (err, agents) => {
    if (err) {
      return res.status(406).json({
        success: false,
        data: {},
        message: "getting agents failed!",
      });
    }

    Contact.find({}, async (err, contacts) => {
      if (err) {
        return res.status(406).json({
          success: false,
          data: {},
          message: "getting contacts failed!",
        });
      }
      //////////////////////////////////////////////////

      var result = [];
      for (var i = 0; i < agents.length; i++) {
        nearbycontacts = [];
        for (var j = 0; j < contacts.length; j++) {
          var flag = false;
          for (var k = 0; k < agents.length; k++) {
            // console.log(agents[i].username, "<>", agents[k].username);

            var dist1 = await zipCodeData.zipCodeDistance(
              agents[i].zipcode,
              contacts[j].zipcode,
              "K"
            );
            var dist2 = await zipCodeData.zipCodeDistance(
              agents[k].zipcode,
              contacts[j].zipcode,
              "K"
            );
            // console.log(dist1, dist2);
            if (i != k && dist1 > dist2) {
              flag = true;
            }
          }
          if (flag == false) {
            nearbycontacts.push(contacts[j]);
            // console.log(nearbycontacts);
          }
        }
        result.push({ agent: agents[i], nearbycontacts: nearbycontacts });
      }

      return res.status(200).json({
        message: "nearby contacts!",
        success: true,
        data: result,
      });
    });
  });
};

module.exports = {
  getAllAgent,
  getCurrentAgent,
  getAllContact,
  getNearByContact,

  logOut,
};
