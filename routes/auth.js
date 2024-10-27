const express = require("express");
const { RegisterController,LoginController } = require("../controller/auth");

const UserRouter = express.Router();

UserRouter.post("/register", RegisterController);
UserRouter.post("/login", LoginController);

module.exports = UserRouter;
