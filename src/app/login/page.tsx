"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

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

const LoginPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const router = useRouter();

  // Optional: Automatically cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/user/login", form);

      if (response.data.success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(response.data.error || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const method = document.cookie
      .split("; ")
      .find((row) => row.startsWith("lastLoginMethod="))
      ?.split("=")[1];

    if (method) {
      setLastMethod(method);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
      </div>
      <div className="absolute top-10 left-4 sm:top-20 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-4 sm:top-40 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg rotate-45 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-50 left-20 sm:bottom-32 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-400 to-indigo-700 rounded-full opacity-20 animate-pulse"></div>

      {/* Layout */}
      <div className="container mx-auto px-4 py-4 sm:py-8 flex flex-col lg:flex-row min-h-screen gap-8">
        {/* Left Panel */}
        <div className="lg:w-2/3 flex flex-col justify-center space-y-6 sm:space-y-8 relative">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-indigo-900 via-gray-600 to-indigo-900 bg-clip-text text-transparent">
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

          {/* Features (optional) */}
          <div className="relative min-h-[150px] sm:min-h-[100px] lg:min-h-[150px] flex items-center justify-center lg:justify-start overflow-hidden">
            <div className="max-w-md lg:max-w-lg xl:max-w-xl">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-indigo-300/40 backdrop-blur-md rounded-xl p-6 sm:p-8 transition-all duration-1000 ${
                    index === activeFeature
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 translate-y-4 pointer-events-none"
                  }`}
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
          </div>

          <div className="flex justify-center lg:justify-start space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                  index === activeFeature
                    ? "bg-indigo-600 w-6 sm:w-8"
                    : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-2/3 flex items-center justify-center">
          <Card className="w-full max-w-md md:max-w-lg bg-white/50 backdrop-blur-lg px-4 sm:px-6 py-4 md:py-6 rounded-2xl shadow-indigo-500 flex flex-col justify-center gap-4">
            <CardHeader className="text-center pb-2 sm:pb-4">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto mb-2"
              />
              <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-indigo-900 to-indigo-400 bg-clip-text text-transparent">
                Welcome Back!
              </CardTitle>
              <CardDescription className="bg-gradient-to-r from-indigo-900 to-indigo-400 bg-clip-text text-transparent">
                Log in to continue your AI-powered conversations
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-0">
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center text-indigo-500 font-medium">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>

                    {lastMethod === "email" && (
                      <span className="ml-2 font-semibold bg-purple-300 text-xs text-indigo-950 px-2 py-[2px] rounded-full shadow-md">
                        Last Used
                      </span>
                    )}
                  </div>

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

                {/* Password */}
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
                    className="bg-transparent text-[#1f2937] placeholder:text-gray-700 pr-12 rounded-xl h-10 shadow-indigo-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-black focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end text-sm text-indigo-400">
                  <Link href="/forgotPassword" className="hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-400 via-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group mt-2 rounded-xl"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="flex items-center space-x-2 my-2 text-indigo-900">
                  <span className="h-px w-full bg-indigo-600" />
                  <span className="text-sm text-black">OR</span>
                  <span className="h-px w-full bg-indigo-400" />
                </div>

                <div className="relative w-full">
                  <Button
                    type="button"
                    onClick={() =>
                      (window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`)
                    }
                    variant="secondary"
                    className="w-full bg-gradient-to-r from-indigo-400 via-indigo-400 to-indigo-600 hover:from-indigo-300 hover:to-indigo-700 text-white font-semibold py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group mt-2 rounded-xl"
                    disabled={loading}
                  >
                    <FaGoogle className="text-xl mr-2" />
                    Sign in with Google
                  </Button>
                  {lastMethod === "google" && (
                    <span className="absolute -top-2 -right-2 bg-purple-300 text-xs text-indigo-950 px-2 font-semibold py-[2px] rounded-full shadow-md">
                      Last Used
                    </span>
                  )}
                </div>

                <p className="text-xs text-indigo-500 text-center mt-2">
                  Don’t have an account?{" "}
                  <Link href="/signup" className="text-indigo-600 underline">
                    Sign up
                  </Link>
                </p>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import InputField from "@/components/ui/inputField";
// import { useRouter } from "next/navigation"; // ✅ App Router
// import axios from "axios";
// import { toast } from "react-hot-toast"; // ✅ For showing notifications
// import { FcGoogle } from "react-icons/fc";

// const LoginPage = () => {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false); // ✅ Loading state
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true); // ✅ Start loading
//     console.log(form);

//     try {
//       const response = await axios.post("/api/user/login", form);

//       if (response.data.success) {
//         toast.success("Login successful!");
//         router.push("/dashboard"); // ✅ Redirect to dashboard (or wherever you want)
//       } else {
//         toast.error(response.data.error || "Something went wrong");
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error(
//         error.response?.data?.error || "Login failed. Please try again."
//       );
//     } finally {
//       setLoading(false); // ✅ Stop loading
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-gray-800 text-center">
//           Welcome Back
//         </h2>

//         <InputField
//           label="Email"
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         />
//         <InputField
//           label="Password"
//           name="password"
//           type="password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />

//         <div className="flex justify-between text-sm text-gray-600">
//           <span></span>
//           <Link
//             href="/forgotPassword"
//             className="text-blue-600 hover:underline"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full text-white text-lg font-medium py-2 rounded-xl transition-all duration-200 ${
//             loading
//               ? "bg-indigo-400 cursor-not-allowed"
//               : "bg-indigo-600 hover:bg-indigo-700"
//           }`}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <div className="text-center text-sm text-gray-500">
//           Or continue with:
//         </div>

//         <div className="flex gap-4 justify-center">
//           <button
//             type="button"
//             onClick={() =>
//               (window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`)
//             }
//             className="cursor-pointer px-4 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
//             disabled={loading}
//           >
//             <FcGoogle className="text-lg" />
//             Google
//           </button>
//         </div>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           Don’t have an account?{" "}
//           <Link href="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

// // // app/login/page.tsx
// // "use client";

// // import React, { useState } from "react";
// // import Link from "next/link";
// // import InputField from "@/components/ui/inputField";
// // import { useRouter } from "next/router";
// // import axios from "axios";

// // const LoginPage = () => {
// //   const [form, setForm] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log("Login data:", form);
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6"
// //       >
// //         <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>

// //         <InputField
// //           label="Email"
// //           name="email"
// //           type="email"
// //           value={form.email}
// //           onChange={handleChange}
// //           required
// //         />
// //         <InputField
// //           label="Password"
// //           name="password"
// //           type="password"
// //           value={form.password}
// //           onChange={handleChange}
// //           required
// //         />

// //         <div className="flex justify-between text-sm text-gray-600">
// //           <span></span>
// //           <Link href="/forgot-password" className="text-blue-600 hover:underline">
// //             Forgot password?
// //           </Link>
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-2 rounded-xl transition-all duration-200"
// //         >
// //           Login
// //         </button>

// //         <div className="text-center text-sm text-gray-500">
// //           Or continue with:
// //         </div>

// //         <div className="flex gap-4 justify-center">
// //           <button
// //             type="button"
// //             className="px-4 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
// //           >
// //             Google
// //           </button>
// //           <button
// //             type="button"
// //             className="px-4 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
// //           >
// //             GitHub
// //           </button>
// //         </div>

// //         <p className="text-center text-sm text-gray-600 mt-4">
// //           Don’t have an account?{" "}
// //           <Link href="/signup" className="text-blue-600 hover:underline">
// //             Sign up
// //           </Link>
// //         </p>
// //       </form>
// //     </div>
// //   );
// // };

// // export default LoginPage;
