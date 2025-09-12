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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Mic Analysis</h2>
        <button 
          onClick={handleRecord}
          className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
        >
          🎤 Start Recording
        </button>
      </div>

      {showResult && (
        <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-xl shadow">
          <p className="text-gray-700 font-medium">Detected: Calm tone 🧘</p>
        </div>
      )}
    </div>
  );
}
