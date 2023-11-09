const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const todoSchema = new Schema({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  createdDate: { type: Date, default: Date.now }
});

const User = mongoose.model("user", todoSchema);
module.exports = User;