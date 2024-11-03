const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, enum: [0, 1], default: 1 }  // 0 for admin, 1 for user
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
