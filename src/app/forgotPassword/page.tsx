"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/inputField";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email.");

    setLoading(true);
    toast.loading("Sending OTP...", { id: "forgot-password" });

    try {
      await axios.post("/api/user/forgotPassword", { email });
      toast.success("OTP sent to your email.", { id: "forgot-password" });
      setStep("otp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP", { id: "forgot-password" });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) return toast.error("Please enter the OTP.");

    setLoading(true);
    toast.loading("Verifying OTP...", { id: "verify-otp" });

    try {
      await axios.post("/api/user/verifyResetPasswordOtp", { email, otp });
      toast.success("OTP verified!", { id: "verify-otp" });
      setStep("reset");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP", { id: "verify-otp" });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) return toast.error("Please fill in all password fields.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");

    setLoading(true);
    toast.loading("Resetting password...", { id: "reset-password" });

    try {
      await axios.post("/api/user/resetPassword", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully!", { id: "reset-password" });
      router.push("/login");
    } catch (error: any) {
      
      toast.error(error.response?.data?.message || "Failed to reset password", { id: "reset-password" });
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <form
        onSubmit={
          step === "email"
            ? handleEmailSubmit
            : step === "otp"
            ? handleOtpVerify
            : handleResetPassword
        }
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {step === "email"
            ? "Forgot your password?"
            : step === "otp"
            ? "Enter OTP sent to your email"
            : "Reset your password"}
        </h2>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          // disabled={step !== "email"}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {step === "otp" && (
          <InputField
            label="OTP"
            name="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        {step === "reset" && (
          <>
            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white text-lg font-medium py-2 rounded-xl transition-all duration-200 ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? step === "email"
              ? "Sending..."
              : step === "otp"
              ? "Verifying..."
              : "Resetting..."
            : step === "email"
            ? "Send OTP"
            : step === "otp"
            ? "Verify OTP"
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;



// // forgot-password.tsx
// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import InputField from "@/components/ui/inputField";

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Please enter your email address.");
//       return;
//     }

//     setLoading(true);
//     toast.loading("Sending password reset email...", { id: "forgot-password" });

//     try {
//       // Call the backend to send the password reset email
//       const response = await axios.post("/api/user/forgot-password", { email });
//       toast.success("Password reset email sent!", { id: "forgot-password" });
//       router.push("/login"); // Redirect back to login page
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Something went wrong.", { id: "forgot-password" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
//       <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6">
//         <h2 className="text-3xl font-bold text-gray-800 text-center">Forgot your password?</h2>
//         <InputField
//           label="Email"
//           name="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full text-white text-lg font-medium py-2 rounded-xl transition-all duration-200 ${
//             loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPasswordPage;
