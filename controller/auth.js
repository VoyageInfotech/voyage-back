require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/auth");

const loggedInUsers = [];

const RegisterController = async (req, res) => {
  const { name, email, password, role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    if (!loggedInUsers.includes(user._id.toString())) loggedInUsers.push(user._id.toString());

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const LogoutController = (req, res) => {
  const { userId } = req.body;
  const index = loggedInUsers.indexOf(userId);
  if (index > -1) loggedInUsers.splice(index, 1);
  res.status(200).json({ message: "Logout successful" });
};

const GetLoggedInUsersController = async (req, res) => {
  try {
    const users = await User.find({ _id: { $in: loggedInUsers } }).select("name email role");
    res.status(200).json({ loggedInUserCount: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  RegisterController,
  LoginController,
  LogoutController,
  GetLoggedInUsersController,
};
