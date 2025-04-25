// app/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField from "@/components/ui/inputField";
import { useRouter } from "next/router";
import axios from "axios";


const LoginPage = () => {
  const [form, setForm] = useState({
    email: "", 
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>

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

        <div className="flex justify-between text-sm text-gray-600">
          <span></span>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-2 rounded-xl transition-all duration-200"
        >
          Login
        </button>

        <div className="text-center text-sm text-gray-500">
          Or continue with:
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            className="px-4 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Google
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
