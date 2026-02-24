import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";


export const updateUserProfile = async (req, res, next) => {

  try {
    const {
      fullName,
      email,
      phone, // Note: frontend sends 'phone', backend expects 'mobileNumber'
      dob,
      gender,
      address,
      city,
      pin,
      photo,
      healthData,
      documents,
    } = req.body;

    const userId = req.user?._id || req.body.id || req.body._id;
    if (!userId) {
      const error = new Error("User id is required");
      error.statusCode = 400;
      return next(error);
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // ===== BASIC VALIDATION =====
    if (!fullName || !email || !phone) {
      const error = new Error("Full Name, Email, and Phone are required");
      error.statusCode = 400;
      return next(error);
    }
    


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      return next(error);
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      const error = new Error("Phone number must be 10 digits");
      error.statusCode = 400;
      return next(error);
    }

    // PIN validation - only if provided and not N/A
    if (pin && pin !== "N/A" && pin.trim() !== "") {
      if (!/^\d{6}$/.test(pin)) {
        const error = new Error("PIN code must be 6 digits");
        error.statusCode = 400;
        return next(error);
      }
    }

    // Check if email already exists (if changing email)
    if (email !== currentUser.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        const error = new Error("Email already in use");
        error.statusCode = 409;
        return next(error);
      }
    }


      
    currentUser.fullName = fullName;
    currentUser.email = email.toLowerCase();
    currentUser.phone = phone; 
    currentUser.dob = dob || currentUser.dob || "N/A";
    currentUser.gender = gender || currentUser.gender || "N/A";
    currentUser.address = address || currentUser.address || "N/A";
    currentUser.city = city || currentUser.city || "N/A";
    currentUser.pin = pin || currentUser.pin || "N/A";

    // ===== UPDATE PHOTO =====
    if (photo) {
      currentUser.photo = {
        url: photo.url || currentUser.photo?.url || "",
        publicID: photo.publicID || currentUser.photo?.publicID || ""
      };
    }

    // ===== UPDATE DOCUMENTS =====
    if (documents) {
      // Validate PAN if provided and not N/A
      if (
        documents.pan &&
        documents.pan !== "N/A" &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documents.pan)
      ) {
        const error = new Error("Invalid PAN format (e.g., ABCDE1234F)");
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
      if (!currentUser.healthData) {
        currentUser.healthData = {};
      }

      // Update vitals
      if (healthData.vitals) {
        currentUser.healthData.vitals = {
          ...currentUser.healthData?.vitals,
          height: healthData.vitals.height || currentUser.healthData?.vitals?.height || null,
          weight: healthData.vitals.weight || currentUser.healthData?.vitals?.weight || null,
          bloodGroup: healthData.vitals.bloodGroup || currentUser.healthData?.vitals?.bloodGroup || "N/A",
          heartRate: healthData.vitals.heartRate || currentUser.healthData?.vitals?.heartRate || null,
          bloodPressure: healthData.vitals.bloodPressure || currentUser.healthData?.vitals?.bloodPressure || "N/A",
          oxygenSaturation: healthData.vitals.oxygenSaturation || currentUser.healthData?.vitals?.oxygenSaturation || null,
          temperature: healthData.vitals.temperature || currentUser.healthData?.vitals?.temperature || null,
        };

        // Calculate BMI if height and weight are provided
        if (currentUser.healthData.vitals.height && currentUser.healthData.vitals.weight) {
          const heightInMeters = currentUser.healthData.vitals.height / 100;
          const bmi = currentUser.healthData.vitals.weight / (heightInMeters * heightInMeters);
          currentUser.healthData.vitals.bmi = Math.round(bmi * 10) / 10;
        }
      }

      // Update medical history
      if (healthData.medicalHistory) {
        currentUser.healthData.medicalHistory = {
          chronicDiseases: healthData.medicalHistory.chronicDiseases || currentUser.healthData?.medicalHistory?.chronicDiseases || [],
          surgeries: healthData.medicalHistory.surgeries || currentUser.healthData?.medicalHistory?.surgeries || [],
          allergies: healthData.medicalHistory.allergies || currentUser.healthData?.medicalHistory?.allergies || [],
        };
      }

      // Update lifestyle
      if (healthData.lifestyle) {
        currentUser.healthData.lifestyle = {
          smoking: healthData.lifestyle.smoking !== undefined ? healthData.lifestyle.smoking : currentUser.healthData?.lifestyle?.smoking || false,
          alcohol: healthData.lifestyle.alcohol !== undefined ? healthData.lifestyle.alcohol : currentUser.healthData?.lifestyle?.alcohol || false,
          exerciseFrequency: healthData.lifestyle.exerciseFrequency || currentUser.healthData?.lifestyle?.exerciseFrequency || "None",
          diet: healthData.lifestyle.diet || currentUser.healthData?.lifestyle?.diet || "N/A",
        };
      }

      // Update emergency contacts
      if (healthData.emergencyContacts) {
        currentUser.healthData.emergencyContacts = healthData.emergencyContacts.map(contact => ({
          name: contact.name || "",
          relation: contact.relationship || contact.relation || "N/A",
          phone: contact.phone || "",
        }));
      }
    }

    // Save to MongoDB
    await currentUser.save();

    // Remove sensitive data before sending response
    const userResponse = currentUser.toObject();
    delete userResponse.password;
    delete userResponse.__v;

    res.status(200).json({
      message: "User Updated Successfully",
      data: userResponse,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      error.message = "Email already exists";
      error.statusCode = 409;
    }
    next(error);
  }
};


// ================= CHANGE PROFILE PHOTO =================
export const UserChangePhoto = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.id || req.body._id;
    if (!userId) {
      const error = new Error("User id is required");
      error.statusCode = 400;
      return next(error);
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

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
    const userId = req.user._id; // from Protect middleware

    if (!oldPassword || !newPassword) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    // Fetch user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(oldPassword, user.password);
    if (!isVerified) {
      const error = new Error("Old password did not match");
      error.statusCode = 401;
      return next(error);
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};

