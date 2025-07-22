"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RECHARGE_OPTIONS = [
  { value: 5, label: "$5" },
  { value: 10, label: "$10" },
  { value: 15, label: "$15" },
  { value: 20, label: "$20" },
  { value: 50, label: "$50" },
];

const RechargeSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = () => {
    if (!selectedAmount) return;

    // Mock payment processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully recharged $${selectedAmount}`);
      setSelectedAmount(null);
    }, 2000);
  };

  return (
    <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[6px] ">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-300">
          Recharge Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {RECHARGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={
                  selectedAmount === option.value ? "default" : "secondary"
                }
                className={`w-full h-12 text-base font-medium bg-gray-100 dark:bg-gray-400 ${selectedAmount === option.value ? "ring-2 ring-indigo-300 dark:ring-indigo-800" : ""}`}
                onClick={() => setSelectedAmount(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="mt-6">
            <Button
              className="w-full h-12 text-base font-semibold"
              disabled={!selectedAmount || isProcessing}
              onClick={handleRecharge}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>Pay {selectedAmount && `$${selectedAmount}`}</>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Secure payment processed by Stripe
            <div className="flex justify-center mt-2">
              <svg
                className="h-5"
                viewBox="0 0 60 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v2.11c-1.05.55-2.33.88-4.23.88-3.77 0-5.9-1.86-5.9-5.62 0-3.45 2.05-5.73 5.22-5.73 3.07 0 4.76 1.93 4.76 5.02a6.4 6.4 0 0 1-.07 1.73zm-8.1-1.95h5.2c0-1.56-.82-2.48-2.48-2.48-1.49 0-2.54.95-2.72 2.48zm-8.95 6.17c-.76 0-1.27-.21-1.65-.51a2.94 2.94 0 0 1-.69-.81l-.21 1.12h-2.74V3.37h3.16v5.95a3.39 3.39 0 0 1 2.84-1.27c2.56 0 4.5 2.34 4.5 5.67v.03c0 3.37-1.91 5.75-4.51 5.75h-.7zm-.44-8.9c-1.46 0-2.47 1.52-2.47 3.16v.03c0 1.66 1.02 3.16 2.47 3.16 1.49 0 2.44-1.48 2.44-3.16v-.03c0-1.68-.98-3.16-2.44-3.16zM36.2 18.5c-3.57 0-5.92-2.5-5.92-5.67v-.03a5.76 5.76 0 0 1 5.96-5.77c3.58 0 5.96 2.5 5.96 5.7v.03c0 3.19-2.32 5.75-5.96 5.75h-.04zm.03-9.02c-1.65 0-2.75 1.3-2.75 3.32v.03c0 2 1.1 3.35 2.75 3.35 1.63 0 2.76-1.3 2.76-3.35v-.03c0-2.03-1.13-3.32-2.76-3.32zm-9.96 8.82h3.16v-5.7c0-1.92 1.12-2.87 2.33-2.87 1.77 0 2.07 1.32 2.07 2.65v5.92h3.16V11.5c0-3.2-1.73-4.84-4-4.84a4.01 4.01 0 0 0-3.59 1.95l-.23-1.6h-2.85c.05.75.09 1.6.09 2.57v7.72h-.14zm-8.35-13.29c-.97 0-1.75-.81-1.75-1.77s.78-1.79 1.75-1.79c.99 0 1.77.83 1.77 1.79 0 .96-.8 1.77-1.77 1.77zm-1.56 13.3h3.16V7h-3.16v11.31zM11.2 17.77c-1.59 0-2.23-.7-2.23-2.33v-6.3h2.75V7h-2.75V3.72H5.8V7H3.83v2.13h1.97v6.6c0 2.89 1.62 4.54 4.72 4.54.89 0 1.88-.21 2.46-.49v-2.22c-.43.18-.96.3-1.72.3h-.06z"
                  fill="#6571FF"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RechargeSection;
