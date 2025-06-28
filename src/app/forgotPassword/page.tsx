"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PasswordStrength from "@/components/ui/PasswordStrength";
import { Eye, EyeClosed } from "lucide-react";

function isPasswordStrong(password: string) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      toast.error(error.response?.data?.message || "Failed to send OTP", {
        id: "forgot-password",
      });
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
      toast.error(error.response?.data?.message || "Invalid OTP", {
        id: "verify-otp",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("Please fill in all password fields.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");

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
      toast.error(error.response?.data?.message || "Failed to reset password", {
        id: "reset-password",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
      </div>

      {/* Centered Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 relative z-10 shadow-2xl">
        <form
          onSubmit={
            step === "email"
              ? handleEmailSubmit
              : step === "otp"
                ? handleOtpVerify
                : handleResetPassword
          }
          className="w-full max-w-md bg-white/50 backdrop-blur-lg p-8 sm:p-10 rounded-2xl space-y-6"
        >
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-900 to-indigo-400 bg-clip-text text-transparent">
            {step === "email"
              ? "Forgot your password?"
              : step === "otp"
                ? "Enter OTP sent to your email"
                : "Reset your password"}
          </h2>

          {/* Email Field */}
          {step === "email" && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-indigo-500 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-[#1f2937] placeholder:text-gray-700 rounded-xl h-10 shadow-indigo-400"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          {/* OTP Field */}
          {step === "otp" && (
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-indigo-500 font-medium">
                OTP
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl text-center text-lg tracking-widest h-10"
                placeholder="Enter the 6-digit OTP"
                required
              />
            </div>
          )}

          {/* New Password Fields */}
          {step === "reset" && (
            <>
              <div className="relative space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-indigo-500 font-medium"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent text-[#1f2937] placeholder:text-gray-700 pr-10 rounded-xl h-10 shadow-indigo-400"
                  placeholder="Enter new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-9 p-0 text-gray-400 hover:text-black hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeClosed className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
                {newPassword && !isPasswordStrong(newPassword) && (
                  <div className="absolute top-full left-0 mt-2 w-full z-40 bg-white opacity-90 rounded-xl p-3">
                    <PasswordStrength password={newPassword} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-indigo-500 font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent text-[#1f2937] placeholder:text-gray-700 rounded-xl h-10 shadow-indigo-400"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-400 via-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl"
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
          </Button>
        </form>
      </div>
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
