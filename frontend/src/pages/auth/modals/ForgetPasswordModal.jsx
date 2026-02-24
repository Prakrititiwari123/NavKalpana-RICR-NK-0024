import React, { useState } from "react";
import { BsArrowClockwise } from "react-icons/bs";
import api from "../../../config/Api"
import toast from "react-hot-toast";

const ForgetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    cfNewPassword: "",
  });
  

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (step === 1) {
        if (!formData.email) {
          toast.error("Email is required");
          return;
        }

        const res = await api.post("/auth/genOtp", {
          email: formData.email,
        });

        toast.success(res.data.message);
        setStep(2);
      }

      else if (step === 2) {
        if (!formData.otp) {
          toast.error("OTP is required");
          return;
        }

        const res = await api.post("/auth/verifyOtp", {
          email: formData.email,
          otp: formData.otp,
        });

        toast.success(res.data.message);
        setStep(3);
      }

      else if (step === 3) {
        if (!formData.newPassword || !formData.cfNewPassword) {
          toast.error("Both password fields are required");
          return;
        }

        if (formData.newPassword !== formData.cfNewPassword) {
          toast.error("Passwords do not match");
          return;
        }

        const res = await api.post("/auth/forgetPassword", {
          email: formData.email,
          newPassword: formData.newPassword,
        });

        toast.success(res.data.message);
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {step === 1 && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your registered email"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="cfNewPassword"
                  value={formData.cfNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">
                  <BsArrowClockwise />
                </span>
                Processing...
              </>
            ) : step === 1 ? (
              "Send OTP"
            ) : step === 2 ? (
              "Verify OTP"
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordModal;
