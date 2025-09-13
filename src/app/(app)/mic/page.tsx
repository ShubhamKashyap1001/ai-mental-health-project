// "use client";
// import { useState } from "react";

// export default function MicPage() {
//   const [showResult, setShowResult] = useState(false);

//   const handleRecord = () => {
//     setTimeout(() => {
//       setShowResult(true);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-[400px] text-center transition">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
//           Mic Analysis
//         </h2>
//         <button 
//           onClick={handleRecord}
//           className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
//         >
//           🎤 Start Recording
//         </button>
//       </div>

//       {showResult && (
//         <div className="mt-6 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 p-4 rounded-xl shadow transition">
//           <p className="text-gray-700 dark:text-gray-200 font-medium">
//             Detected: Calm tone 🧘
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useRef } from "react";

export default function MicPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setResult(null);
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const fd = new FormData();
        fd.append("file", blob, "recording.webm");

        try {
          const res = await fetch("http://localhost:5000/api/voice", {
            method: "POST",
            body: fd,
          });
          const data = await res.json();
          setResult(`Detected: ${data.label || "unknown"}`);
        } catch {
          setResult("❌ Error analyzing voice");
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 5000); // auto-stop after 5s
    } catch {
      setResult("❌ Microphone access denied");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-[400px] text-center transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          🎤 Voice Analysis
        </h2>
        <button
          onClick={startRecording}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Recording..." : "Start Recording"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 p-4 rounded-xl shadow transition">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
