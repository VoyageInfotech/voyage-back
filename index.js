const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const imageRouter = require("./routes/image");
const contactRouter = require("./routes/contact");
const dbConnection = require("./config/db");
const getTouchRouter = require("./routes/gettouch");
const testimonialRouter = require("./routes/testimonial");
const technologyRouter = require("./routes/technology");
const resumeRouter = require("./routes/resume");
const userRouter = require("./routes/auth");

dotenv.config();
const PORT = process.env.PORT || 6000;
dbConnection();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Voyage Infotech");
});

app.use("/api", imageRouter);
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/technology", technologyRouter);
app.use("/api/gettouch", getTouchRouter);
app.use("/api/testimonial", testimonialRouter);

// Start the server
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Server is running on port", PORT);
  }
});

// Handle server start errors
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error("Error starting server:", err);
  }
});
