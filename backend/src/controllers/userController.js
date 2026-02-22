import cloudinary from "../config/cloudnary.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";


// ================= UPDATE USER PROFILE =================
export const UserUpdate = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      gender,
      dob,
      address,
      city,
      pin,
      documents,
      healthData,
    } = req.body;

    const currentUser = req.user;

    // ===== BASIC VALIDATION =====
    if (!fullName || !email || !mobileNumber) {
      const error = new Error("Full Name, Email, and Mobile Number are required");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^\d{10}$/.test(mobileNumber.replace(/\D/g, ""))) {
      const error = new Error("Mobile number must be 10 digits");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^\d{6}$/.test(pin)) {
      const error = new Error("PIN code must be 6 digits");
      error.statusCode = 400;
      return next(error);
    }

    // ===== UPDATE BASIC INFO =====
    currentUser.fullName = fullName;
    currentUser.email = email.toLowerCase();
    currentUser.mobileNumber = mobileNumber;
    currentUser.gender = gender || currentUser.gender;
    currentUser.dob = dob || currentUser.dob;
    currentUser.address = address || currentUser.address;
    currentUser.city = city || currentUser.city;
    currentUser.pin = pin || currentUser.pin;

    // ===== UPDATE DOCUMENTS =====
    if (documents) {
      if (
        documents.pan &&
        documents.pan !== "N/A" &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documents.pan)
      ) {
        const error = new Error("Invalid PAN format");
        error.statusCode = 400;
        return next(error);
      }

      currentUser.documents = {
        gst: documents.gst || currentUser.documents?.gst || "N/A",
        uidai: documents.uidai || currentUser.documents?.uidai || "N/A",
        pan: documents.pan || currentUser.documents?.pan || "N/A",
      };
    }

    // ===== UPDATE HEALTH DATA =====
    if (healthData) {
      currentUser.healthData = {
        ...currentUser.healthData,
        ...healthData,
      };
    }

    await currentUser.save();

    res.status(200).json({
      message: "User Updated Successfully",
      data: currentUser,
    });
  } catch (error) {
    next(error);
  }
};



// ================= CHANGE PROFILE PHOTO =================
export const UserChangePhoto = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const dp = req.file;

    if (!dp) {
      const error = new Error("Profile Picture required");
      error.statusCode = 400;
      return next(error);
    }

    if (currentUser.photo?.publicID) {
      await cloudinary.uploader.destroy(currentUser.photo.publicID);
    }

    const b64 = Buffer.from(dp.buffer).toString("base64");
    const dataURI = `data:${dp.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "HealthNexus/User",
      width: 500,
      height: 500,
      crop: "fill",
    });

    currentUser.photo.url = result.secure_url;
    currentUser.photo.publicID = result.public_id;

    await currentUser.save();

    res.status(200).json({
      message: "Photo Updated Successfully",
      data: currentUser,
    });
  } catch (error) {
    next(error);
  }
};



// ================= RESET PASSWORD =================
export const UserResetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const currentUser = req.user;

    if (!oldPassword || !newPassword) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const isVerified = await bcrypt.compare(oldPassword, currentUser.password);

    if (!isVerified) {
      const error = new Error("Old password did not match");
      error.statusCode = 401;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    currentUser.password = hashPassword;
    await currentUser.save();

    res.status(200).json({
      message: "Password Reset Successful",
    });
  } catch (error) {
    next(error);
  }
};