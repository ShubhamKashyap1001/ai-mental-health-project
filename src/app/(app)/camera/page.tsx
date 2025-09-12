"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<string>("");

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current!.srcObject = stream;
      });
    }
  }, []);

  const handleCheck = () => {
    setTimeout(() => {
      setResultData("Your emotions look calm and positive 😊");
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="bg-card shadow-lg rounded-2xl p-4 w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">Camera Analysis</h2>
        <video ref={videoRef} autoPlay className="w-full rounded-xl border" />
        <button
          onClick={handleCheck}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition"
        >
          Analyze
        </button>
      </div>

      {showResult && (
        <div className="mt-6 bg-muted border-l-4 border-green-500 p-4 rounded-xl shadow">
          <p>{resultData}</p>
        </div>
      )}
    </div>
  );
}
