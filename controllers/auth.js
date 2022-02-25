const crypto = require("crypto");
const express = require('express');
const bcrypt = require("bcryptjs");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const upload = require("../utils/upload");
const app = express();

app.use(express.json())


// @desc    Login user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("failure")
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("failure")
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    console.log("success")
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Register user
exports.register = async (req, res, next) => {
  const { firstname, lastname, email, password, phone,role } = req.body;
  const verified = false
  try {
    const user1 = await User.findOne({ email });

    if (user1) {
      return next(new ErrorResponse("email is used", 404));
    }
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      phone,
      role,
      verified
    });
    console.log("success")
    sendToken(user, 200, res);
  } catch (err) {
    console.log("failure")
    next(err);
  }
};
exports.uploadimage = async (req, res, next) => {
  //const {id } = req.body;

  const id = req.body.email
  const password = req.body.password

  try {
    const user = await User.findOne({ _id: id });

    console.log(user)
    if (!user) {
      return next(new ErrorResponse("no user found", 404));
    }
    console.log(req.file)
    user.image = req.file.filename;
    user.password = password

    await user.save();

    res.status(201).json({
      success: true,
      data: "image Updated Success",
    });
  } catch (err) {
    return next(new ErrorResponse("error 40444", 404));
  }


}
// find by id user
exports.findbyID = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return next(new ErrorResponse("no user found", 401));
    }
    res.status(200).json({ success: true, data: user });

  } catch (error) {
    next(error);
  }


}
//update user 
exports.updateUser = async (req, res, next) => {
  const { id, password, phone, firstname, lastname } = req.body;
  try {
    const user = await User.findOne({ _id: id });

    //no user 
    if (!user) {
      return next(new ErrorResponse("no user found", 401));
    }
    //user exists
    user.password = password;
    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;

    await user.save();

    res.status(201).json({
      success: true,
      data: user,
      message: "user updated"
    });

  } catch (error) {
    next(error);
  }
}
//random code
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
// @desc    Forgot Password Initialization
exports.forgotPassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email

    var code = makeid(5);
    // HTML Message
    const message = `
      You have requested a password reset /n
      your reset code is : ${code}  
      
    `;
    console.log(message)
    try {
      await sendEmail(user.email, "reset password", message);


      res.status(200).json({ success: true, data: code });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset User Password
exports.resetPassword = async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {

    const {  pass ,email ,password} = req.body;
    

    const user = await User.findOne({ email: email });
    if (!user) return next(new ErrorResponse("no user found", 401));

    //
    
    
    user.password = password
     console.log(user.password)
    await user.save();


    res.status(200).json({ success: true, data: "success" });
  } catch (error) {
    return next(new ErrorResponse("error ", 401));
    console.log(error);
  }
}

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ sucess: true, token });
};
