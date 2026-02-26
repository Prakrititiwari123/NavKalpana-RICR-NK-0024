import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { genOtpToken,genToken } from "../utils/authToken.js";
import OTP from "../models/otpModel.js"
import { sendOTPEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";


export const UserRegister = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      biologicalSex,
      height,
      weight,
      activityLevel,
      experienceLevel,
      primaryGoal,
    } = req.body;


    console.log({
      fullName,
      email,
      password,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      experienceLevel,
      primaryGoal,
    });
    
    // REQUIRED CHECK
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, password required" });
    }

    // DUPLICATE CHECK
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // DEFAULT AVATAR
    const photo = {
      url: `https://placehold.co/600x400?text=${fullName.charAt(0).toUpperCase()}`,
    };

    // CREATE USER (ALL FIELDS)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      photo,

      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      experienceLevel,
      primaryGoal,
    });

    res.status(201).json({
      message: "Registration successful",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};


export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔐 NEW ACCESS TOKEN
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET,
      { expiresIn: "10m" }
    );

    // ✅ SET ACCESS TOKEN COOKIE (THIS WAS MISSING)
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};





export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(401).json({ message: "Email not registered" });
    }

    const isVerified = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isVerified) {
      return res.status(401).json({ message: "Password didn't match" });
    }

    // 🔐 ACCESS TOKEN (SHORT)
    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.ACCESS_SECRET,
      { expiresIn: "10m" }
    );

    // 🔐 REFRESH TOKEN (LONG)
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ ACCESS TOKEN COOKIE
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ REFRESH TOKEN COOKIE
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    existingUser.password = undefined;

    return res.status(200).json({
      success: true,
      user: existingUser,
    });

  } catch (error) {
    next(error);
  }
};










// ------------------UserLogout---------------
export const Logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // https ho to true
    });

    res.status(200).json({
      message: "Logout successful",
    });
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
    console.log("Delete account request received");
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