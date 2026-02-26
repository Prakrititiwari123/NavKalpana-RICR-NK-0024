// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const Protect = async (req, res, next) => {
  
  try {
    // 🔑 ACCESS TOKEN ONLY
    const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - Access token missing",
      });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};


export const RefreshProtect = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};


export const AdminProtect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }


    

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
};



export const OtpProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.otpToken;

    if (!token) {
      return res.status(401).json({
        message: "OTP token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.OTP_SECRET // 🔐 SEPARATE SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid OTP user",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired OTP",
    });
  }
};


// middlewares/checkUserActive.js
export const checkUserActive = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized - user not attached",
      });
    }

    if (req.user.isActive === false) {
      return res.status(403).json({
        message: "Account has been deactivated",
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};


