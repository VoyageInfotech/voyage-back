const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const imageRouter = require("./routes/image");
const ContactRouter = require("./routes/contact");
const DbConnection = require("./config/db");
const GetTouchRouter = require("./routes/gettouch");
const TestimonialRouter = require("./routes/testimonial");

dotenv.config();

const PORT = process.env.PORT || 6000;

DbConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

// Register routes
app.use("/api", imageRouter);
app.use("/api/contact", ContactRouter);
app.use("/api/gettouch", GetTouchRouter);
app.use("/api/testimonial", TestimonialRouter);

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