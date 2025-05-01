"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/ui/inputField";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const SignupAndVerifyPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // To track if OTP has been sent
  const [isVerified, setIsVerified] = useState(false); // To track if the OTP is verified
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle OTP input changes
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Handle form submit (sign-up)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    toast.loading("Creating your account...", { id: "signup" });

    try {
      // Send the form data to create a user
      const response = await axios.post("/api/user/signup", form);

      toast.success("Signup successful! Otp is send to your email. Please verify your email.", { id: "signup" });
      
      setIsOtpSent(true); // Show OTP input after successful sign up
    } catch (error: any) {
      console.log(error);
      const apiError = error.response?.data;

      if (apiError) {
        const { message, errorCode, data } = apiError;
        const fieldErrors = data?.fieldErrors as Record<string, string[]>;

        // If validation error and zod returned field-level info
        if (errorCode === "VALIDATION_ERROR" && data?.fieldErrors) {
          const fieldMessages = Object.entries(fieldErrors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("\n");
      
          toast.error(fieldMessages || message, { id: "signup" });
        } else {
          toast.error(message || "Unexpected error", { id: "signup" });
        }
      } else {
        toast.error("Network error. Please try again.", { id: "signup" });
      }
      return;      
    } finally {
      setLoading(false);
    }

    try {
            const response = await axios.post("/api/user/sendEmail", form);
            console.log(response);
            // toast.success("Signup successful! Redirecting to login...", { id: "signup" });
            // router.push("/veriftOtp");
          } catch (error: any) {
            console.log(error);
            toast.error(
              error.response?.data?.message || "Something went wrong. Try again.",
              { id: "signup" }
            );
          } finally {
            setLoading(false);
          }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter your OTP.");
      return;
    }

    setLoading(true);
    toast.loading("Verifying OTP...", { id: "verify" });

    try {
      // Send OTP to verify
      const response = await axios.post("/api/user/verifyOtp", {...form, otp });
      toast.success("Email verified successfully!", { id: "verify" });
      setIsVerified(true); // OTP verified successfully

      // Redirect to login page after successful verification
      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
        { id: "verify" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <form
        onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}
        className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {isOtpSent ? "Verify your Email" : "Create your account"}
        </h2>



        {!isOtpSent && (
          <>
            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white text-lg font-medium py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}

        {isOtpSent && !isVerified && (
          <>
            <InputField
              label="OTP"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white text-lg font-medium py-2 rounded-xl transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            if (googleLoading) return;
            setGoogleLoading(true);
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/api/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
          }}
          className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-100 transition-all text-sm font-medium text-gray-700 shadow-sm disabled:opacity-60 cursor-pointer"
          disabled={googleLoading}
        >
          <FcGoogle className="text-lg" />
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupAndVerifyPage;
