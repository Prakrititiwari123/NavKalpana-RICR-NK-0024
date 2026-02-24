import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { genOtpToken,genToken } from "../utils/authToken.js";
import OTP from "../models/otpModel.js"
import { sendOTPEmail } from "../utils/emailService.js";


// ----------------UserRegister-----------------
export const UserRegister = async (req, res, next) => {
  try {
    console.log(req.body);
    //accept data from Frontend
    const { fullName, email,  password } = req.body;

    //verify that all data exist
    if (!fullName || !email  || !password) {
      const error = new Error("All feilds required");
      error.statusCode = 400;
      return next(error);
    }

    console.log({ fullName, email,  password });

    //Check for duplaicate user before registration
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      return next(error);
    }

    console.log("Sending Data to DB");

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    console.log("Password Hashing Done. hashPassword = ", hashPassword);

    const photoURL = `https://placehold.co/600x400?text=${fullName.charAt(0).toUpperCase()}`;
    const photo = {
      url: photoURL,
    };

    //save data to database
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashPassword,
      photo,
    });

    // send response to Frontend
    console.log(newUser);
    res.status(201).json({ message: "Registration Successfull" });
    //End
  } catch (error) {
    next(error);
  }
};



// -----------------UserLogin---------------------
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("email " + email, "Password " + password);
    
    if (!email || !password) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    // Use findOne instead of find to get a single user object
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }
    console.log("Hi Im "+   existingUser);
    

    const isVerified = await bcrypt.compare(password, existingUser.password);

    if (!isVerified) {
      const error = new Error("Password didn't match");
      error.statusCode = 401;
      return next(error);
    }

    genToken(existingUser, res);

    // remove password before sending response
    existingUser.password = undefined;

    res.status(200).json({
      message: "Login Successful",
      user: existingUser,
    });

  } catch (error) {
    next(error);
  }
};

// ------------------UserLogout---------------
export const UserLogout = async (req, res, next) => {
  try {
    res.clearCookie("Nexus");
    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    next(error);
  }
};

// ----------------UserGenOTP-------------------
export const UserGenOTP = async (req, res, next) => {
  try {
    //Fetch Data from Frontend
    const { email } = req.body;

    //verify that all data exist
    if (!email) {
      const error = new Error("All feilds required");
      error.statusCode = 400;
      return next(error);
    }

    //Check if user is registred or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }

    //Check if user is otp is there or not
    const existingUserOTP = await  OTP.findOne({ email });
    if (existingUserOTP) {
      await existingUserOTP.deleteOne();
    }

    const otp = Math.floor(Math.random() * 1000000).toString();
    console.log(typeof otp);

    //encrypt the otp
    const salt = await bcrypt.genSalt(10);
    const hashOTP = await bcrypt.hash(otp, salt);

    console.log(hashOTP);

    await OTP.create({
      email,
      otp: hashOTP,
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP send on registered email" });
  } catch (error) {
    next(error);
  }
};

// --------------UserVerifyOTP-------------------
export const UserVerifyOtp = async (req, res, next) => {
  try {
    //Fetch Data from Frontend
    const { email, otp } = req.body;

    //verify that all data exist
    if (!email || !otp) {
      const error = new Error("All feilds required");
      error.statusCode = 400;
      return next(error);
    }

    //Check if user is otp is there or not
    const existingUserOTP = await OTP.findOne({ email });
    if (!existingUserOTP) {
      const error = new Error("OTP Match Error, Please Retry");
      error.statusCode = 401;
      return next(error);
    }

    //verify the Password
    const isVerified = await bcrypt.compare(otp, existingUserOTP.otp);
    if (!isVerified) {
      const error = new Error("OTP Match Error, Please Retry");
      error.statusCode = 401;
      return next(error);
    }

    await existingUserOTP.deleteOne();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }

    //Token Generation will be done here
    genOtpToken(existingUser, res);

    //send message to Frontend
    res.status(200).json({ message: "OTP Verified. Create New Password Now" });
    //End
  } catch (error) {
    next(error);
  }
};

// ---------------UserForgetPassword
export const UserForgetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;

    if (!newPassword) {
      const error = new Error("All feilds required");
      error.statusCode = 400;
      return next(error);
    }

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    currentUser.password = hashPassword;

    await currentUser.save();

    res
      .status(200)
      .clearCookie("otpToken")
      .json({ message: "Password Changed. Please login again" });
  } catch (error) {
    next(error);
  }
};


// ----------------------Delete Account---------------

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log("Deleting user with ID:", userId); // 👈 Check ID
    
    // Pehle check karo user exists karta hai?
    const existingUser = await User.findById(userId);
    console.log("Existing user:", existingUser); // 👈 Should show user data
    
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete attempt
    const deletedUser = await User.deleteOne({_id: userId});
    console.log("Deleted user result:", deletedUser); // 👈 Should show deleted user
    
    res.clearCookie('health');
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error); // 👈 Check actual error
    next(error);
  }
};