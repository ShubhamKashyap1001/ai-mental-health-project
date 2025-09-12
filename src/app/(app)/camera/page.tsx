"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<string>("");

  // Start camera
  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current!.srcObject = stream;
      });
    }
  }, []);

  // Simulate backend response
  const handleCheck = () => {
    setTimeout(() => {
      setResultData("Your emotions look calm and positive 😊");
      setShowResult(true);
    }, 2000); // 2 sec delay like backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-4 w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Camera Analysis</h2>
        <video ref={videoRef} autoPlay className="w-full rounded-xl border" />
        <button 
          onClick={handleCheck}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Analyze
        </button>
      </div>

      {/* Invisible Result Card */}
      {showResult && (
        <div className="mt-6 bg-green-100 border-l-4 border-green-500 p-4 rounded-xl shadow">
          <p className="text-gray-700 font-medium">{resultData}</p>
        </div>
      )}
    </div>
  );
}
