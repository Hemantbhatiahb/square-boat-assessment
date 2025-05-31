const express = require("express");
const { getJobs, addJob } = require("../controllers/jobController");
const auth = require("../middleware/auth");

const jobRouter = express.Router();

jobRouter.get("/", getJobs);

jobRouter.post("/", auth(["recruiter"]), addJob);

module.exports = jobRouter;
