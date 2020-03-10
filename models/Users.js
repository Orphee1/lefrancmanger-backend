const mongoose = require("mongoose");

const Users = mongoose.model("Users", {
  token: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  salt: {
    type: String,
    default: ""
  },
  hash: {
    type: String,
    default: ""
  }
});

module.exports = Users;
