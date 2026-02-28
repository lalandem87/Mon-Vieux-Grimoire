const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(mongooseUniqueValidator);

const User = mongoose.model("user", UserSchema);

module.exports = User;

