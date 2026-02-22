import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


// ----------------------Protect------------------
export const Protect = async (req, res, next) => {
  try {
    const parax = req.cookies.Nexus;
    console.log("Token recived in Cookies:", parax);

    const tea = jwt.verify(parax, process.env.JWT_SECRET);
    console.log(tea);
    if (!tea) {
      const error = new Error("Unauthorized! Please Login Again");
      error.statusCode = 401;
      return next(error);
    }

    const verifiedUser = await User.findById(tea.id);
    if (!verifiedUser) {
      const error = new Error("Unauthorized! Please Login Again");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
};

// ----------------------admin Protect------------


// -------------------OTP Protect-----------------------
export const OtpProtect = async (req, res, next) => {
  try {
    const token = req.cookies.otpToken;
    console.log("Token recived in Cookies:", token);

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    if (!decode) {
      const error = new Error("Unauthorized! Please try again");
      error.statusCode = 401;
      return next(error);
    }

    const verifiedUser = await User.findById(decode.id);
    if (!verifiedUser) {
      const error = new Error("Unauthorized! Please try again");
      error.statusCode = 401;
      return next(error);
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};
