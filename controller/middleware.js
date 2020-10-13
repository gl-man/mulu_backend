var mongoose = require("mongoose");

require("./model");

var Tokenlist = mongoose.model("Tokenlist");

module.exports = async (req, res, next) => {
  try {
    if (
      req.headers.authorization == "" ||
      req.headers.authorization == undefined
    ) {
      res.status(401).json({
        success: false,
        data: {},
        message:
          "Not authorized attempt access, this incedent will be reported!",
      });
    } else {
      const token = req.headers.authorization;
      console.log(token);
      Tokenlist.findOne(
        {
          token: token,
        },
        (err, token) => {
          //   console.log("token", token);
          if (err || !token) {
            return res.status(401).json({
              success: false,
              data: {},
              message:
                "Not authorized attempt access, this incedent will be reported",
            });
          }
          req.userid = token.userid;
          req.token = token.token;
          next();
        }
      );
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: {},
      message: "Not authorized attempt access, this incedent will be reported",
    });
  }
};
