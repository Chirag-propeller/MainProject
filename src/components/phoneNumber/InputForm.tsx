"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface PhoneFormModalProps {
  onClose: () => void;
}

const PhoneFormModal: React.FC<PhoneFormModalProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [terminationURI, setTerminationURI] = useState("");
  const [sipUsername, setSipUsername] = useState("");
  const [sipPassword, setSipPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [provider, setProvider] = useState("");
  const [agentAttached, setAgentAttached] = useState(false);
  const [agentName, setAgentName] = useState("");

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      phoneNumber,
      terminationUri: terminationURI,
      sipTrunkUserName: sipUsername,
      sipTrunkPassword: sipPassword,
      nickname,
      provider,
      agentAttached,
      agentName,
    };

    try {
      const res = await fetch("/api/phoneNumber/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Phone entry created:", data);
        onClose(); // close modal
      } else {
        alert("Failed to save phone entry");
      }
    } catch (error) {
      console.error("Error saving phone entry:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/50 dark:bg-gray-900/80 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 p-6 rounded-[6px] shadow-xl w-[90%] max-w-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Add Phone Number
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              Phone Number
            </label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Enter phone number"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-[6px] p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              Termination URI
            </label>
            <input
              value={terminationURI}
              onChange={(e) => setTerminationURI(e.target.value)}
              required
              placeholder="Enter termination URI"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-[6px] p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              SIP Trunk User Name (Optional)
            </label>
            <input
              value={sipUsername}
              onChange={(e) => setSipUsername(e.target.value)}
              placeholder="Enter SIP Trunk User Name"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-[6px] p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              SIP Trunk Password (Optional)
            </label>
            <input
              type="password"
              value={sipPassword}
              onChange={(e) => setSipPassword(e.target.value)}
              placeholder="Enter SIP Trunk Password"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-[6px] p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              Nickname (Optional)
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter Nickname"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-[6px] p-2 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneFormModal;
