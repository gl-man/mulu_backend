var express = require("express"),
  router = express.Router(),
  querystring = require("querystring"),
  https = require("https"),
  mongoose = require("mongoose");
const zipCodeData = require("zipcode-city-distance");
const config = require("../config");

require("./model");

var Agent = mongoose.model("Agent");
var Contact = mongoose.model("Contact");

module.exports = function () {
  router.post("/add_agent", (req, res, next) => {
    console.log(req.body);
    newAgent = Agent({
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
        console.log("new agent save failed!");
        return;
      }
      return res.send({
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
        console.log("new Contact save failed!");
        return;
      }
      return res.send({
        message: "new contact saved!",
        success: true,
        data: contactItem,
      });
    });
  });

  router.post("/get_all_agent", (req, res, next) => {
    Agent.find({}, (err, agents) => {
      if (err) {
        console.log("getting all agents failed!");
        return;
      }

      return res.send({
        message: "all agents!",
        success: true,
        data: agents,
      });
    });
  });

  router.post("/get_current_agent", (req, res, next) => {
    Agent.findOne(
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      },
      (err, agent) => {
        if (err) {
          console.log("getting current agent failed!");
          return;
        }

        return res.send({
          message: "current agent!",
          success: true,
          data: agent,
        });
      }
    );
  });

  router.post("/get_all_contact", (req, res, next) => {
    Contact.find({}, (err, contacts) => {
      if (err) {
        console.log("getting all contacts failed!");
        return;
      }

      return res.send({
        message: "all contacts!",
        success: true,
        data: contacts,
      });
    });
  });

  //   var getDistances = (zipcode_agent, zipcode_contacts) => {
  //     return new Promise((resolve, reject) => {
  //       url =
  //         "https://www.zipcodeapi.com/rest/" +
  //         config.apiKey +
  //         "/multi-distance.json/" +
  //         zipcode_agent +
  //         "/" +
  //         zipcode_contacts[0];
  //       for (var i = 1; i < zipcode_contacts.length; i++) {
  //         url = url + ", " + zipcode_contacts[i];
  //       }
  //       url = url + "/km";
  //       console.log("url:", url);
  //       https
  //         .get(url, (resp) => {
  //           let data = "";

  //           // A chunk of data has been recieved.
  //           resp.on("data", (chunk) => {
  //             data += chunk;
  //           });

  //           // The whole response has been received. Print out the result.
  //           resp.on("end", () => {
  //             console.log(data);
  //             resolve(JSON.parse(data).distances);
  //           });
  //         })
  //         .on("error", (err) => {
  //           reject(err);
  //         });
  //     });
  //   };
  let getDistances = (zipcode_agent, zipcode_contacts) => {
    result = {};
    zipcode_contacts.forEach((zipcode) => {
      result[zipcode] = zipCodeData.zipCodeDistance(
        zipcode_agent,
        zipcode,
        "K"
      );
    });
    return result;
  };

  router.post("/get_nearby_contact", (req, res, next) => {
    Agent.find({}, (err, agents) => {
      if (err) {
        console.log("getting current agent failed!");
        return;
      }

      Contact.find({}, async (err, contacts) => {
        if (err) {
          console.log("getting all contacts failed!");
          return;
        }
        //////////////////////////////////////////////////
        var currentAgent, otherAgent;
        if (
          agents[0].firstname == req.body.firstname &&
          agents[0].lastname == req.body.lastname
        ) {
          currentAgent = agents[0];
          otherAgent = agents[1];
        } else {
          currentAgent = agents[1];
          otherAgent = agents[0];
        }

        zipcode_contacts = [];
        contacts.forEach((contact) => {
          zipcode_contacts.push(contact.zipcode);
        });

        //get all distance
        result1 = getDistances(currentAgent.zipcode, zipcode_contacts);
        result2 = getDistances(otherAgent.zipcode, zipcode_contacts);

        console.log(result1, result2);
        result = [];
        //make result with sorting
        Object.keys(result1).forEach((key) => {
          if (result1[key] <= result2[key]) {
            for (var i = 0; i < result.length; i++) {
              if (result1[result[i].zipcode] > result1[key]) {
                break;
              }
            }
            for (var j = 0; j < contacts.length; j++) {
              if (contacts[j].zipcode == key) {
                break;
              }
            }
            result.splice(i, 0, contacts[j]);
          }
        });
        console.log(result);
        console.log("end function");
        return res.send({
          message: "nearby contacts!",
          success: true,
          data: result,
        });
      });
    });
  });

  return router;
};
