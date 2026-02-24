import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
   
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    dob: { type: String, default: "N/A" },
    gender: {
      type: String,
      enum: ["male", "female", "others", "N/A"],
      default: "N/A",
    },
     phone: { type: String  },  
    address: { type: String, default: "N/A" },
    city: { type: String, default: "N/A" },
    pin: { type: String, default: "N/A" },
    photo: {
      url: { type: String, default: "" },
      publicID: { type: String, default: "" },
    },

    healthData: {
      vitals: {
        height: { type: Number, default: null }, // cm
        weight: { type: Number, default: null }, // kg
        bmi: { type: Number, default: null },
        bloodGroup: { type: String, default: "N/A" },
        heartRate: { type: Number, default: null },
        bloodPressure: { type: String, default: "N/A" }, // systolic/diastolic
        oxygenSaturation: { type: Number, default: null },
        temperature: { type: Number, default: null },
      },
      medicalHistory: {
        chronicDiseases: { type: [String], default: [] },
        surgeries: { type: [String], default: [] },
        allergies: { type: [String], default: [] },
      },
      medications: {
        currentMedications: { type: [String], default: [] },
        pastMedications: { type: [String], default: [] },
      },
      lifestyle: {
        smoking: { type: Boolean, default: false },
        alcohol: { type: Boolean, default: false },
        exerciseFrequency: {
          type: String,
          enum: ["None", "Occasional", "Regular"],
          default: "None",
        },
        diet: { type: String, default: "N/A" },
      },
      labReports: [
        {
          reportName: { type: String, },
          reportDate: { type: Date, default: Date.now },
          result: { type: String, default: "N/A" },
          fileUrl: { type: String, default: "" },
        },
      ],
      appointments: [
        {
          doctorName: { type: String, default: "N/A" },
          specialization: { type: String, default: "N/A" },
          appointmentDate: { type: Date, default: Date.now },
          notes: { type: String, default: "" },
        },
      ],
      vaccinations: [
        {
          vaccineName: { type: String,  },
          dose: { type: String, default: "N/A" },
          date: { type: Date, default: Date.now },
        },
      ],
      emergencyContacts: [
        {
          name: { type: String,  },
          relation: { type: String, default: "N/A" },
          phone: { type: String,  },
        },
      ],
    },

    documents: {
      gst: { type: String, default: "N/A" },
      uidai: { type: String, default: "N/A" },
      pan: { type: String, default: "N/A" },
    },

    isActive: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
