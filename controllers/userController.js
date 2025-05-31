const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// signup user handler
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(200).json({
        success: false,
        message: "User already exists!",
      });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    console.log("user signup success");

    return res.status(201).json({
      success: true,
      message: "User signup successful",
    });
  } catch (error) {
    res.status(400).json({ message: "Error registering user :" + error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .json({ success: false, message: "Pasword is Incorrect" });
    }

    const secretKey = process.env.JWT_SECRETKEY;
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1d",
    });
    // can store jwt in cookies
    console.log("token: ", token);

    return res
      .status(200)
      .json({ success: true, message: "User logged in!", data: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging in user : " + error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    //clear token from cookies if stored in cookies

    const token = req.headers.authorization?.split(" ")[1];
    // delete token

    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Error logging out user :" + error });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
};
