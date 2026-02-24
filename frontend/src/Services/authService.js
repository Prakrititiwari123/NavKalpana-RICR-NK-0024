// services/authService.js
import axiosInstance from "../config/Api";

export const loginUser = async ({ email, password, rememberMe = false }) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await axiosInstance.post(
      "/auth/login",
      { email: email.trim().toLowerCase(), password, rememberMe },
      { withCredentials: true }
    );

    if (!response?.data) {
      throw new Error("No response from server");
    }

    const data = response.data;
    console.log("LOGIN RESPONSE:", data);

    // Extract user safely
    const user = data.user || data.data?.user || null;

    if (!user) {
      throw new Error("User data missing from response");
    }

    const safeUserData = {
      id: user.id || user._id,
      email: user.email,
      fullName: user.fullName || user.name,
    };

    localStorage.setItem(
      "healthnexus_user",
      JSON.stringify(safeUserData)
    );

    return {
      success: true,
      user,
      message: data.message || "Login successful",
    };

  } catch (error) {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Login failed";
      throw new Error(message);
    }

    throw new Error(error.message || "Login failed");
  }
};