"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "./UserDataContext";
import { User as UserIcon, Mail, Phone, Save, X } from "lucide-react";
import toast from "react-hot-toast";

import SelectionDropdown from "../agents/SelectionDropdown";

interface EditProfileFormProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onCancel: () => void;
}

// Major timezones with GMT offsets and primary cities
const timezones = [
  {
    label: "GMT-11:00 Midway (US)",
    tzCode: "Pacific/Midway",
    offset: "-11:00",
  },
  {
    label: "GMT-10:00 Hawaii Time (US)",
    tzCode: "Pacific/Honolulu",
    offset: "-10:00",
  },
  {
    label: "GMT-09:00 Alaska Time (US)",
    tzCode: "America/Anchorage",
    offset: "-09:00",
  },
  {
    label: "GMT-08:00 Pacific Time (US)",
    tzCode: "America/Los_Angeles",
    offset: "-08:00",
  },
  {
    label: "GMT-07:00 Mountain Time (US)",
    tzCode: "America/Denver",
    offset: "-07:00",
  },
  {
    label: "GMT-06:00 Central Time (US)",
    tzCode: "America/Chicago",
    offset: "-06:00",
  },
  {
    label: "GMT-05:00 Eastern Time (US)",
    tzCode: "America/New_York",
    offset: "-05:00",
  },
  {
    label: "GMT-04:00 Venezuela Time (VE)",
    tzCode: "America/Caracas",
    offset: "-04:00",
  },
  {
    label: "GMT-03:00 Brazil Time (BR)",
    tzCode: "America/Sao_Paulo",
    offset: "-03:00",
  },
  {
    label: "GMT-02:00 South Georgia (GS)",
    tzCode: "Atlantic/South_Georgia",
    offset: "-02:00",
  },
  {
    label: "GMT-01:00 Azores (PT)",
    tzCode: "Atlantic/Azores",
    offset: "-01:00",
  },
  {
    label: "GMT+00:00 Greenwich Mean Time (UK)",
    tzCode: "Europe/London",
    offset: "+00:00",
  },
  {
    label: "GMT+01:00 Central European Time (FR)",
    tzCode: "Europe/Paris",
    offset: "+01:00",
  },
  {
    label: "GMT+02:00 Eastern European Time (GR)",
    tzCode: "Europe/Athens",
    offset: "+02:00",
  },
  {
    label: "GMT+03:00 Moscow Time (RU)",
    tzCode: "Europe/Moscow",
    offset: "+03:00",
  },
  {
    label: "GMT+04:00 Gulf Standard Time (AE)",
    tzCode: "Asia/Dubai",
    offset: "+04:00",
  },
  {
    label: "GMT+05:30 India Standard Time (IN)",
    tzCode: "Asia/Kolkata",
    offset: "+05:30",
  },
];

const currencyOptions = [
  { name: "INR - Indian Rupee", value: "INR" },
  { name: "USD - US Dollar", value: "USD" },
  { name: "EUR - Euro", value: "EUR" },
  { name: "GBP - British Pound", value: "GBP" },
  { name: "JPY - Japanese Yen", value: "JPY" },
];

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    timezone: user.timezone || "",
    currency: user.currency || "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification states
  const [originalEmail, setOriginalEmail] = useState(user.email);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Reset form data when user prop changes (e.g., after successful update)
  useEffect(() => {
    console.log("EditProfileForm: User prop changed, updating form data:", {
      newEmail: user.email,
      newName: user.name,
      timestamp: new Date().toISOString(),
    });

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      timezone: user.timezone || "",
      currency: user.currency || "",
    });
    setOriginalEmail(user.email);
    setIsEmailVerified(true);
    setShowOtpInput(false);
    setEmailOtp("");

    console.log(
      "EditProfileForm: Form data updated, new originalEmail:",
      user.email
    );
  }, [user]);

  // Check if email has changed
  useEffect(() => {
    if (formData.email !== originalEmail) {
      setIsEmailVerified(false);
      setShowOtpInput(false);
      setEmailOtp("");
    } else {
      setIsEmailVerified(true);
      setShowOtpInput(false);
      setEmailOtp("");
    }
  }, [formData.email, originalEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number format is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailVerification = async () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch("/api/user/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          emailChangeVerification: true,
        }),
      });

      if (response.ok) {
        setShowOtpInput(true);
        setErrors((prev) => ({ ...prev, email: undefined }));
        toast.success(`OTP sent to ${formData.email}`);
      } else {
        const error = await response.json();
        setErrors((prev) => ({
          ...prev,
          email: error.error || "Failed to send verification email",
        }));
        toast.error("Failed to send verification email");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: "Failed to send verification email",
      }));
      toast.error("Failed to send verification email");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!emailOtp.trim()) {
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch("/api/user/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: emailOtp,
          emailChangeVerification: true,
        }),
      });

      if (response.ok) {
        setIsEmailVerified(true);
        setShowOtpInput(false);
        setEmailOtp("");
        toast.success("Email verified successfully!");
      } else {
        const error = await response.json();
        console.error("OTP verification failed:", error.message);
        toast.error("Incorrect OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Incorrect OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if email has changed and needs verification
    if (formData.email !== originalEmail && !isEmailVerified) {
      setErrors((prev) => ({
        ...prev,
        email: "Please verify the email address",
      }));
      toast.error("Please verify the email address");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Saving profile with data:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.trim() === "" ? "" : formData.phone,
        emailChanged: formData.email !== originalEmail,
        isEmailVerified,
      });

      await onSave({
        name: formData.name,
        email: formData.email,
        phone: formData.phone.trim() === "" ? "" : formData.phone,
        timezone: formData.timezone,
        currency: formData.currency,
      });

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 relative">
      <div className="flex items-center mb-4">
        <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
        <h3 className="text-sm font-semibold text-gray-800">
          Edit Profile Information
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="text-xs font-medium text-gray-700 mb-1 flex items-center"
          >
            <UserIcon className="w-3 h-3 mr-1 text-gray-500" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-xs font-medium text-gray-700 mb-1 flex items-center"
          >
            <Mail className="w-3 h-3 mr-1 text-gray-500" />
            Email Address
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`flex-1 px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="Enter your email address"
            />
            {formData.email !== originalEmail && !isEmailVerified && (
              <Button
                type="button"
                onClick={handleEmailVerification}
                disabled={isVerifying}
                className="px-3 py-2 text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {isVerifying ? "Sending..." : "Verify"}
              </Button>
            )}
          </div>
          {showOtpInput && (
            <div className="mt-2 space-y-2">
              <label
                htmlFor="emailOtp"
                className="block text-xs font-medium text-gray-700"
              >
                Enter verification code sent to {formData.email}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="emailOtp"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <Button
                  type="button"
                  onClick={handleOtpVerification}
                  disabled={isVerifying || !emailOtp.trim()}
                  className="px-3 py-2 text-xs bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </div>
          )}
          {isEmailVerified && formData.email !== originalEmail && (
            <p className="mt-1 text-xs text-green-600 flex items-center">
              <Save className="w-3 h-3 mr-1" />
              Email verified successfully
            </p>
          )}
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-xs font-medium text-gray-700 mb-1 flex items-center"
          >
            <Phone className="w-3 h-3 mr-1 text-gray-500" />
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              errors.phone
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <X className="w-3 h-3 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="timezone"
            className="text-xs font-medium text-gray-700 mb-1 flex items-center"
          >
            Timezone
          </label>

          <SelectionDropdown
            options={timezones.map((tz) => ({
              name: tz.label,
              value: tz.tzCode,
            }))}
            selectedOption={formData.timezone}
            setOption={(value) =>
              setFormData((prev) => ({ ...prev, timezone: value as string }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="text-xs font-medium text-gray-700 mb-1 flex items-center"
          >
            Currency
          </label>
          <SelectionDropdown
            options={currencyOptions}
            selectedOption={formData.currency}
            setOption={(value) =>
              setFormData((prev) => ({ ...prev, currency: value as string }))
            }
          />
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-3 h-3 mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-1" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
