// models/NutritionLog.js
import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },

    calories: Number,

    macros: {
      protein: Number,
      carbs: Number,
      fats: Number,
    },
    foodItems: [
      {
        name: { type: String, trim: true },
        quantity: { type: String, trim: true },
        calories: Number,
      },
    ],
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("NutritionLog", nutritionSchema);
