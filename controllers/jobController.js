const Job = require("../models/jobModel");


const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(400).json({ message: "Error :" + error });
  }
};

const addJob = async (req, res) => {
  try {
    const { title, description } = req.body;
    const job = new Job({ title, description, recruiterId: req.user.id });
    await job.save();
    console.log("job creation success");

    return res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(400).json({ message: "Error :" + error });
  }
};

module.exports = {
  addJob,
  getJobs,
};
