const express = require("express");
const auth = require("../middleware/auth");
const Job = require("../models/jobModel");

const recruiterRouter = express.Router()

recruiterRouter.get(
  "/jobs/:jobId/applicants",
  auth(["recruiter"]),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId).populate(
        "applicants",
        "name email"
      );
      if (job.recruiterId.toString() !== req.user.id) {
        return res.status(400).json({ success: false, error: "Not your job" });
      }

      return res.status(200).json({ success: true, data: job.applicants });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Error fetching job applicants: " + error });
    }
  }
);

module.exports = recruiterRouter;
