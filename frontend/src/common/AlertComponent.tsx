// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import { useState, useEffect } from "react";
import { Alert } from "@material-tailwind/react";

function SuccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AlertComponent({ alert_message, is_success, topic, isOpen }) {
  return (
    <div className="fixed top-0 right-0 z-50 m-4 animate-fadeInRight">
      <Alert
        open={isOpen}
        icon={is_success ? <SuccessIcon /> : <ErrorIcon />}
        className={`rounded-none border-l-4 items-center font-medium  ${
          is_success
            ? "border-[#2ec946] bg-gray-900 text-[#2ec946]"
            : "border-red-500 bg-gray-900 text-red-500"
        }`}
      >
        <strong>{topic}:</strong> {alert_message}
      </Alert>
    </div>
  );
}
