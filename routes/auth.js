const express = require("express");
const {
  RegisterController,
  LoginController,
  LogoutController,
  GetLoggedInUsersController,
} = require("../controller/auth");

const UserRouter = express.Router();

UserRouter.post("/register", RegisterController);
UserRouter.post("/login", LoginController);
UserRouter.post("/logout", LogoutController);
UserRouter.get("/login-users", GetLoggedInUsersController);

module.exports = UserRouter;
