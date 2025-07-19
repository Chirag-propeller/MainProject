"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
import PasswordStrength from "@/components/ui/PasswordStrength";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeClosed,
  Shield,
  ArrowRight,
  Check,
  Lock,
  Mail,
  User,
  Phone,
} from "lucide-react";

const features = [
  {
    title: "Accelerate Your Customer Engagement.",
    text: "Transform interactions with proPAL AI that's instant, integrated, and incredibly smart.",
  },
  {
    title: "Connect Smarter, Convert Faster.",
    text: "Expand your reach across geographies with seamless, multi-lingual AI fully integrated into your existing systems.",
  },
  {
    title: "AI-Powered Conversations. Redefined.",
    text: "Deliver human-like conversational experiences at scale, with unparalleled speed and precision.",
  },
  {
    title: "Effortless Automation, Powerful Conversions.",
    text: "proPAL AI intelligently syncs with your workflow, ensuring every lead is nurtured and every query is resolved.",
  },
];

function isPasswordStrong(password: string) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

const SignupAndVerifyPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    timezone: "",
    currency: "",
  });

  const [activeFeature, setActiveFeature] = useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setOtp(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return toast.error("Please fill in all required fields.");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);
    toast.loading("Creating your account...", { id: "signup" });

    try {
      const response = await axios.post("/api/user/signup", form);
      toast.success(
        "Signup successful! Otp is sent to your email. Please verify.",
        { id: "signup" }
      );
      setIsOtpSent(true);
      await axios.post("/api/user/sendEmail", form);
    } catch (error: any) {
      const apiError = error.response?.data;
      if (apiError?.errorCode === "VALIDATION_ERROR") {
        const fieldMessages = Object.entries(apiError.data?.fieldErrors || {})
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("\n");
        toast.error(fieldMessages || apiError.message, { id: "signup" });
      } else {
        toast.error(apiError?.message || "Unexpected error", { id: "signup" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          timezone:
            data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          currency: data.currency || "USD",
        }));
      })
      .catch(() => {
        setForm((prev) => ({
          ...prev,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          currency: "USD",
        }));
      });
  }, []);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter your OTP.");

    setLoading(true);
    toast.loading("Verifying OTP...", { id: "verify" });

    try {
      await axios.post("/api/user/verifyOtp", { ...form, otp });
      toast.success("Email verified successfully!", { id: "verify" });
      setIsVerified(true);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
        { id: "verify" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-4 sm:top-40 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg rotate-45 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-50 left-20 sm:bottom-32 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-400 to-indigo-700 rounded-full opacity-20 animate-pulse"></div>

      <div className="flex-1 container mx-auto px-2 py-4 flex flex-col lg:flex-row gap-4">
        {/* Left Section - Enhanced Features */}
        <div className="lg:w-2/3 flex flex-col justify-center space-y-6 sm:space-y-8 relative">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-indigo-900 via-gray-600 to-indigo-900 bg-clip-text text-transparent ">
              The Future of{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Intelligent
              </span>{" "}
              Customer Conversations.
            </h1>
            <p className="text-lg sm:text-xl text-gray-900 italic leading-relaxed max-w-2xl mx-auto lg:mx-0">
              proPAL AI orchestrates every step of your customer journey, from
              first call to automated follow-up.
            </p>
          </div>
          <div className="hidden lg:flex relative min-h-[150px] items-center justify-center lg:justify-start overflow-hidden shadow-indigo-500">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-indigo-300/40 backdrop-blur-md rounded-xl p-6 sm:p-8 transition-all duration-1000 ${
                  index === activeFeature
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                } `}
              >
                <h3 className="text-gray-800 font-semibold mb-3 text-lg sm:text-xl lg:text-2xl break-words">
                  {feature.title}
                </h3>
                <p className="text-gray-800 text-sm sm:text-base leading-relaxed break-words">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          {/* Feature indicators */}
          <div className="hidden lg:flex relative min-h-[20px] items-center justify-center lg:justify-start overflow-hidden space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                  index === activeFeature
                    ? "bg-indigo-600 w-6 sm:w-8"
                    : "bg-indigo-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Section - PAuth Form */}
        <div className="lg:w-2/3 flex items-center justify-center">
          <Card className="w-full max-w-[440px] md:max-w-lg bg-white/50 backdrop-blur-lg px-4 py-1 rounded-2xl shadow-indigo-500 flex flex-col justify-center gap-1">
            <CardHeader className="text-center sm:pb-4">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto"
              />
              <CardTitle className="text-xl sm:text-lg bg-gradient-to-r from-indigo-900 to-indigo-400 bg-clip-text text-transparent ">
                Get Started
              </CardTitle>
              <CardDescription className="bg-gradient-to-r from-indigo-900 to-indigo-400 bg-clip-text text-transparent ">
                Create your account to begin intelligent conversations
              </CardDescription>
            </CardHeader>
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}>
              <CardContent className="space-y-3 px-0">
                {!isOtpSent ? (
                  <>
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-indigo-500 font-medium flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" /> Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="bg-transparent text-[#1f2937] placeholder:text-gray-700 rounded-xl h-10 shadow-indigo-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-indigo-500 font-medium flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2" /> Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="bg-transparent text-[#1f2937] placeholder:text-gray-700 rounded-xl h-10 shadow-indigo-400"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-indigo-500 font-medium flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-2" /> Phone Number
                        (Optional)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="bg-transparent text-[#1f2937] placeholder:text-gray-700 rounded-xl h-10 shadow-indigo-400"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-indigo-500 font-medium flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          className="bg-transparent text-[#1f2937] placeholder:text-gray-700 pr-10 rounded-xl h-10 shadow-indigo-400"
                          placeholder="Create a strong password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-1.5 text-gray-400 hover:text-black hover:bg-transparent from-[#4f46e5] to-[#6366f1]"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeClosed className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        {form.password && !isPasswordStrong(form.password) && (
                          <div className="absolute top-full left-0 mt-2 w-full z-40 bg-white opacity-90 rounded-xl p-3">
                            <PasswordStrength password={form.password} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-indigo-500 font-medium flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2" /> Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="bg-transparent text-[#1f2937] placeholder:text-gray-700 pr-10 rounded-xl h-10 shadow-indigo-400"
                          placeholder="Confirm your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-2 text-gray-400 hover:text-black hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeClosed className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-400 via-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-1.5 transition-all duration-300 hover:scale-105 hover:shadow-lg group mt-2 rounded-xl"
                    >
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center space-x-2 my-2 text-indigo-900">
                      <span className="h-px w-full bg-indigo-600" />
                      <span className="text-sm text-black">OR</span>
                      <span className="h-px w-full bg-indigo-400" />
                    </div>

                    {/* Google Sign-In */}
                    <Button
                      type="button"
                      disabled={googleLoading}
                      onClick={() => {
                        setGoogleLoading(true);
                        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
                      }}
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-indigo-400 via-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-1.5 transition-all duration-300 hover:scale-105 hover:shadow-lg group mt-2 rounded-xl"
                    >
                      <FaGoogle className="text-xl mr-1.5" />
                      {googleLoading ? "Redirecting..." : "Sign in with Google"}
                    </Button>

                    <p className="text-xs text-indigo-500 text-center mt-2">
                      Already have an account?{" "}
                      <Link href="/login" className="text-indigo-600 underline">
                        Login
                      </Link>
                    </p>
                  </>
                ) : (
                  <div className="space-y-5">
                    <Label
                      htmlFor="otp"
                      className="text-white font-medium flex items-center"
                    >
                      <Shield className="w-4 h-4 mr-2" /> Verification Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-white/5 border-white/20 text-black placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl text-center text-lg tracking-widest h-10"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />

                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full bg-gradient-to-r from-indigo-300 to-indigo-700 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                    >
                      Verify Account
                      <Check className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => setIsOtpSent(false)}
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 rounded-xl"
                    >
                      Back to Sign Up
                    </Button>
                  </div>
                )}
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupAndVerifyPage;

{
  /* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
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
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
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
    </div> */
}
