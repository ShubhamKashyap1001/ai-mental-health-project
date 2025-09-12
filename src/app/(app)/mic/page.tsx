"use client";
import { useState } from "react";

export default function MicPage() {
  const [showResult, setShowResult] = useState(false);

  const handleRecord = () => {
    setTimeout(() => {
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-[400px] text-center transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Mic Analysis
        </h2>
        <button 
          onClick={handleRecord}
          className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
        >
          🎤 Start Recording
        </button>
      </div>

      {showResult && (
        <div className="mt-6 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 p-4 rounded-xl shadow transition">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            Detected: Calm tone 🧘
          </p>
        </div>
      )}
    </div>
  );
}
