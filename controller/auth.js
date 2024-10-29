require("dotenv").config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../model/auth");

const RegisterController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "User registered successfully",
      token,
      name: newUser.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  RegisterController,
  LoginController,
};
