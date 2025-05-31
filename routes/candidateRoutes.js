const express = require("express");
const Job = require("../models/jobModel");
const auth = require("../middleware/auth");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const candidateRouter = express.Router();

const mongoose = require("mongoose");

candidateRouter.post("/apply/:jobId", auth(["candidate"]), async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId).populate("recruiterId");

    // Job doesn't exist
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Already applied
    if (job.applicants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied" });
    }

    job.applicants.push(req.user.id);
    await job.save();

    // TODO: send email to candidate
    // TODO: send email to recruiter

    return res
      .status(200)
      .json({ success: true, message: "Applied successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
});

candidateRouter.get("/applications", auth(["candidate"]), async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user.id })
      .select("title description recruiterId")
      .populate("recruiterId", "name");

    const updatedJobsData = jobs.map((job) => ({
      title: job.title,
      description: job.description,
      recruiterName: job.recruiterId.name,
    }));

    return res.status(200).json({
      success: true,
      data: updatedJobsData,
    });
  } catch (err) {
    return res.status(400).json({ error: "Error :" + err });
  }
});

module.exports = candidateRouter;
