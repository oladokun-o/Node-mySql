const indexModel = require("../models/index.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const defaultEmail = "";

// Create a transporter using Gmail SMTP
const EmailTransporter = nodemailer.createTransport({
  host: "server266.web-hosting.com",
  port: 465,
  secure: true,
  auth: {
    user: "", // Replace with your Gmail email address
    pass: "", // Replace with your Gmail password or an App Password
  },
});

router.post("/loginbyemail", async function (req, res, next) {
  let payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await indexModel.findByEmail(payload.email);
  if (user.length) {
    if (user[0].password === payload.password) {
      res.status(200).json({
        code: 200,
        message: "Success",
        data: user[0],
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Wrong password!",
        data: {},
      });
    }
  } else {
    return res.status(500).json({
      code: 500,
      message: "User with email not found!",
      data: {},
    });
  }
});

//get login otp by sending otp to email
router.post("/getloginbyotp", async function (req, res, next) {
  let payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await indexModel.findByEmail(payload.email);
  const otp = Math.floor(1000 + Math.random() * 9000);

  if (user.length) {
    console.log("user found, updating otp");
    var otpupdated = await indexModel.findAndUpdateOTP(payload.email, otp);

    if (otpupdated.affectedRows > 0) {
      console.log("otp updated, sending email");
      const mailOptions = {
        from: defaultEmail,
        to: payload.email,
        subject: "OTP for login",
        text: `Your OTP is ${otp}`,
      };
      EmailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          console.log("email sent", info);
          res.status(200).json({
            code: 200,
            message: "Success",
            data: {
              otp_checked: true,
            },
          });
        }
      });
    } else {
      console.log("otp update failed", otpupdated);
      return res.status(500).json({
        code: 500,
        message: "OTP update failed! Please try again later!",
        data: {
          otp_checked: false,
        },
      });
    }
  }
});

//verify otp
router.post("/verifyloginotp", async function (req, res, next) {
  let payload = {
    email: req.body.email,
    otp: req.body.otp,
  };

  const user = await indexModel.findByEmail(payload.email);
 if (user.length) {
    console.log(payload, user[0].token);
    if (Number(user[0].token) === Number(payload.otp)) {
      res.status(200).json({
        code: 200,
        message: "Success",
        data: user[0],
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Wrong OTP!",
        data: {},
      });
    }
  } else {
    return res.status(500).json({
      code: 500,
      message: "User with email not found!",
      data: {},
    });
  }
});

//generate otp and send to email
router.post("/getOTP", async function (req, res, next) {
  let payload = {
    email: req.body.email,
  };

  const user = await indexModel.findByEmail(payload.email);

 if (user.length) {
    return res.status(500).json({
      code: 500,
      message: "Email already exists!",
      data: {},
    });
  }
});

//register user
router.post("/register", async function (req, res) {
  // Assuming you receive the user registration data from the frontend
  const { username, email, password, confirmPassword } = req.body;

  // Create a payload object with default values for Vendor fields
  const payload = {
    // Set as needed or leave it as 0 if it's an empty field
  };

  // Populate the payload object with the received data
  payload.username = username;
  payload.email = email;
  payload.password = password;

  const newuser = await indexModel.createUser(payload);
  // if new user is created, send success message and email saying to wait for approval
  if (newuser.affectedRows > 0) {
    res.status(200).json({
      code: 200,
      message: "Success",
      data: newuser,
    });
    const mailOptions = {
      from: defaultEmail,
      to: email,
      subject: "Registration successful",
      text: `Your registration is successful. Please wait for approval.`,
    };

    EmailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent", info);
      }
    });
    //send welcome email
    const adminMailOptions = {
      from: defaultEmail,
      to: payload.email,
      subject: "Welcome!",
      text: `Welcome, thank you for registering.`,
    };

    EmailTransporter.sendMail(adminMailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent", info);
      }
    });
  } else {
    console.log("registration failed", newuser);
    return res.status(500).json({
      code: 500,
      message: "Registration failed! Please try again later!",
      data: {},
    });
  }
});

router.post("/logout", function (req, res) {
  req.logout();
  res.status(200).send("logged out!");
});

module.exports = router;
