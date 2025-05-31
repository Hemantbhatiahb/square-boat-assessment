const express = require("express");
const User = require("../models/userModel");
const {
  signupUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const userRouter = express.Router();

// signup user
userRouter.post("/signup", signupUser);

//login
userRouter.post("/login", loginUser);

userRouter.post("/logout", auth(["candidate", "recruiter"]), logoutUser);

module.exports = userRouter;
