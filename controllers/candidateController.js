const { mongoose } = require("mongoose");
const Job = require("../models/jobModel");
const { sendEmail } = require("../utils/emailService");

const applyJob = async (req, res) => {
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

    const candidate = await User.findById(req.user.id);

    //send email
    await sendEmail(
      candidate.email,
      "Job application sent",
      `You have applied to: ${job.title}`
    );
    await sendEmail(
      job.recruiterId.email,
      "New Applicant",
      `${candidate.name} applied to job: ${job.title}`
    );

    return res
      .status(200)
      .json({ success: true, message: "Applied successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
};

const getApplications = async (req, res) => {
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
};

module.exports = { applyJob, getApplications };
