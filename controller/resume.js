require("dotenv").config();
const Resume = require("../model/resume");
const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const ResumeController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      address,
      applyForPosition,
      currentCompanyName,
      year,
      month,
      currentSalary,
      expectedSalary,
      resumeImage,
    } = req.body;

    console.log(req.body);
    const existingUser = await Resume.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
        success: false,
      });
    }

    let resumeFilePath = null;
    if (req.file) {
      resumeFilePath = path.join(__dirname, "../uploads/", req.file.filename);
    }

    const newUser = new Resume({
      firstName,
      lastName,
      email,
      mobile,
      address,
      applyForPosition,
      currentCompanyName,
      year,
      month,
      currentSalary,
      expectedSalary,
      resumeImage: resumeFilePath || resumeImage,
    });
    await newUser.save();

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Resume Submission from ${firstName} ${lastName}`,
      text: `
        A new resume has been submitted with the following details:

        First Name: ${firstName}
        Last Name: ${lastName}
        Email: ${email}
        Mobile: ${mobile}
        Address: ${address}
        Applying for Position: ${applyForPosition}
        Current Company Name: ${currentCompanyName}
        Experience: ${year} years, ${month} months
        Current Salary: ${currentSalary}
        Expected Salary: ${expectedSalary}
        Resume Image URL: ${resumeImage ? resumeImage : "No resume image uploaded"}
        
        Best regards,
        Your Application
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).send({
      message: "CV sent successfully and saved to database",
      data: newUser,
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error processing request",
      success: false,
    });
  }
};

const ResumegetController = async (req, res) => {
  try {
    const resumes = await Resume.find({});
    return res.status(200).send({
      message: "Resumes retrieved successfully",
      data: resumes,
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error retrieving resumes",
      success: false,
    });
  }
};

module.exports = { ResumeController, ResumegetController };
