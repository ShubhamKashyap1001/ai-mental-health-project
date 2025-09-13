// "use client";
// import { useEffect, useRef, useState } from "react";

// export default function CameraPage() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [showResult, setShowResult] = useState(false);
//   const [resultData, setResultData] = useState<string>("");

//   useEffect(() => {
//     if (videoRef.current) {
//       navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//         videoRef.current!.srcObject = stream;
//       });
//     }
//   }, []);

//   const handleCheck = () => {
//     setTimeout(() => {
//       setResultData("Your emotions look calm and positive 😊");
//       setShowResult(true);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
//       <div className="bg-card shadow-lg rounded-2xl p-4 w-[400px] text-center">
//         <h2 className="text-xl font-semibold mb-4">Camera Analysis</h2>
//         <video ref={videoRef} autoPlay className="w-full rounded-xl border" />
//         <button
//           onClick={handleCheck}
//           className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition"
//         >
//           Analyze
//         </button>
//       </div>

//       {showResult && (
//         <div className="mt-6 bg-muted border-l-4 border-green-500 p-4 rounded-xl shadow">
//           <p>{resultData}</p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current!.srcObject = stream;
      }).catch(() => {
        setResult("❌ Camera access denied");
      });
    }
  }, []);

  const handleCheck = async () => {
    if (!videoRef.current) return;
    setLoading(true);
    setResult(null);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg")
    );
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    try {
      const res = await fetch("http://localhost:5000/api/face", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(`Detected emotion: ${data.label || "unknown"}`);
    } catch {
      setResult("❌ Error analyzing face");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="bg-card shadow-lg rounded-2xl p-4 w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">📷 Face Analysis</h2>
        <video ref={videoRef} autoPlay className="w-full rounded-xl border" />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-muted border-l-4 border-green-500 p-4 rounded-xl shadow">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
