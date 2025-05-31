const express = require("express");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const candidateRouter = require("./routes/candidateRoutes");
const recruiterRouter = require("./routes/recruiterRoutes");
const jobRouter = require("./routes/jobRoutes");

require("dotenv").config();

const app = express();

// middleware
app.use(express.json());


// connect to database
connectDB();

// routes

/* Routes */
app.use("/api/users", userRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/recruiter", recruiterRouter);
app.use('/api/job', jobRouter);

app.get("/", (req, res) => {
  console.log("Hellow from express");
  return res.send("Server is running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
