// app/signup/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import InputField  from "@/components/ui/inputField";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup data:", form);
    const response = await axios.post("/api/user/signup", form);
    console.log(response);
    router.push('/login');
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">Create your account</h2>
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
        {/* <InputField
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        /> */}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-2 rounded-xl transition-all duration-200"
        >
          Sign Up
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

export default SignupPage;

