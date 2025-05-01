"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import InputField from "@/components/ui/inputField";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter your OTP.");
      return;
    }

    setLoading(true);
    toast.loading("Verifying OTP...", { id: "verify" });

    try {
      const response = await axios.post("/api/user/verifyOtp", {
        otp,
      });

      toast.success("Email verified successfully!", { id: "verify" });
      router.push("/login"); // redirect to login after successful verification
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
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Verify your Email
        </h2>


        <InputField
          label="OTP"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
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

        {/* <p className="text-center text-sm text-gray-600">
          Didn't get an OTP?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Resend
          </span>
          (You can add resend later)
        </p> */}
      </form>
    </div>
  );
};

export default VerifyOtpPage;
