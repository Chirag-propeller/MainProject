"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setRequirements({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const allValid = Object.values(requirements).every(Boolean);
  if (allValid) return null;

  return (
    <div className="text-sm">
      <p className="text-indigo-950 font-medium mb-3">Password Requirements:</p>
      <ul className="space-y-2">
        <li
          className={`flex items-center gap-2 ${requirements.length ? "text-indigo-950" : "text-indigo-400"}`}
        >
          {requirements.length ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>At least 6 characters</span>
        </li>
        <li
          className={`flex items-center gap-2 ${requirements.uppercase ? "text-indigo-950" : "text-indigo-400"}`}
        >
          {requirements.uppercase ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>One uppercase letter</span>
        </li>
        <li
          className={`flex items-center gap-2 ${requirements.lowercase ? "text-indigo-950" : "text-indigo-400"}`}
        >
          {requirements.lowercase ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>One lowercase letter</span>
        </li>
        <li
          className={`flex items-center gap-2 ${requirements.number ? "text-indigo-950" : "text-indigo-400"}`}
        >
          {requirements.number ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>One number</span>
        </li>
        <li
          className={`flex items-center gap-2 ${requirements.special ? "text-indigo-950" : "text-indigo-400"}`}
        >
          {requirements.special ? (
            <Check className="w-4 h-4 flex-shrink-0" />
          ) : (
            <X className="w-4 h-4 flex-shrink-0" />
          )}
          <span>
            One special character (!@#$%^&amp;*(),.?&quot;:&#123;&#125;|{">"})
          </span>
        </li>
      </ul>
    </div>
  );
}
