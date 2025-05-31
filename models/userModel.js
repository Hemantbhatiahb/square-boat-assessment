const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  // hash if modified
  if (!user.isModified("password")) return next(); 

  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    user.password = hashedPassword;
    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
