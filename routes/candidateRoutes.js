const express = require("express");
const { applyJob, getApplications } = require("../controllers/candidateController");
const auth = require("../middleware/auth");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const candidateRouter = express.Router();


candidateRouter.post("/apply/:jobId", auth(["candidate"]),applyJob );

candidateRouter.get("/applications", auth(["candidate"]), getApplications );

module.exports = candidateRouter;
