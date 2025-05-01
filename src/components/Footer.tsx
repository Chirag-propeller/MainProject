import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="ml-2 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-1 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/dashboard/profile">
        <div className="px-2 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">User</span>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>

          </div>

        </div>
        </Link>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} Propal AI
        </span>
      </div>
    </footer>
  );
}