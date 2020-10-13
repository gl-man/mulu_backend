var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose");
const zipCodeData = require("zipcode-city-distance");
const config = require("../config");

const authCheck = require("./middleware");
const api = require("./api");

require("./model");

var Agent = mongoose.model("Agent");
var Contact = mongoose.model("Contact");
var Tokenlist = mongoose.model("Tokenlist");

module.exports = function () {
  router.post("/login", (req, res, next) => {
    Agent.find(
      {
        username: req.body.username,
      },
      (err, agents) => {
        if (agents.length === 0) {
          return res.status(406).json({
            success: false,
            data: {},
            message: "Account does not exists",
          });
        } else {
          for (var i = 0; i < agents.length; i++) {
            if (agents[i].password === req.body.password) {
              var suid = require("rand-token").suid;
              var token = suid(32);
              var newToken = Tokenlist({
                userid: agents[i]._id,
                token: token,
              });
              newToken.save((err, token) => {
                if (err) {
                  console.log("token didn't save to database with ERROR!", err);
                  // return res.status(409).json({
                  //   success: false,
                  //   data: {},
                  //   message: "token save failed",
                  // });
                  return;
                }
              });
              return res.status(200).json({
                success: true,
                data: { token: token, user: agents[i] },
                message: "login success",
              });
            }
          }
          return res.status(407).json({
            success: false,
            data: {},
            message: "Password and/or username is not correct",
          });
        }
      }
    );
  });

  router.post("/signup", (req, res, next) => {
    console.log(req.body);
    newAgent = Agent({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      gender: req.body.gender,
      zipcode: req.body.zipcode,
      profession: req.body.profession,
      location: zipCodeData.getInfo("zipcode", req.body.zipcode).data.location,
    });

    newAgent.save(function (err, agentItem) {
      if (err) {
        return res.status(406).json({
          success: false,
          data: {},
          message: "Account save failed",
        });
      }
      return res.status(200).json({
        message: "new Agent saved!",
        success: true,
        data: agentItem,
      });
    });
  });

  router.post("/add_contact", (req, res, next) => {
    newContact = Contact({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      gender: req.body.gender,
      zipcode: req.body.zipcode,
      location: zipCodeData.getInfo("zipcode", req.body.zipcode).data.location,
    });

    newContact.save(function (err, contactItem) {
      if (err) {
        return res.status(406).json({
          success: false,
          data: {},
          message: "new Contact save failed!",
        });
      }
      return res.status(200).json({
        message: "new contact saved!",
        success: true,
        data: contactItem,
      });
    });
  });

  router.post("/api/get_all_agent", authCheck, api.getAllAgent);
  router.post("/api/get_all_contact", authCheck, api.getAllContact);
  router.post("/api/get_current_agent", authCheck, api.getCurrentAgent);
  router.post("/api/get_nearby_contact", authCheck, api.getNearByContact);

  router.post("/api/logout", authCheck, api.logOut);

  return router;
};
