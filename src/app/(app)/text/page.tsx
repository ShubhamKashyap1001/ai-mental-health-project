// "use client";
// import { useState } from "react";

// export default function TextPage() {
//   const [input, setInput] = useState("");
//   const [showResult, setShowResult] = useState(false);

//   const handleAnalyze = () => {
//     setTimeout(() => {
//       setShowResult(true);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
//       <div className="bg-card p-6 rounded-2xl shadow-lg w-[400px] text-center">
//         <h2 className="text-xl font-semibold mb-4">Text Analysis</h2>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="w-full p-3 border rounded-xl focus:outline-none bg-background text-foreground"
//           rows={4}
//           placeholder="Write your thoughts..."
//         />
//         <button
//           onClick={handleAnalyze}
//           className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition"
//         >
//           Analyze
//         </button>
//       </div>

//       {showResult && (
//         <div className="mt-6 bg-muted border-l-4 border-purple-500 p-4 rounded-xl shadow">
//           <p>Detected: Stress level low ✨</p>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";
// import { useState } from "react";

// export default function TextPage() {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<string | null>(null);

//   const handleAnalyze = async () => {
//     if (!input.trim()) return;
//     setLoading(true);
//     setResult(null);

//     try {
//       const res = await fetch("http://localhost:5000/api/text", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: input }),
//       });
//       const data = await res.json();
//       setResult(`Detected: ${data.label || "unknown"}`);
//     } catch {
//       setResult("❌ Error analyzing text");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
//       <div className="bg-card p-6 rounded-2xl shadow-lg w-[400px] text-center">
//         <h2 className="text-xl font-semibold mb-4">📝 Text Analysis</h2>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="w-full p-3 border rounded-xl focus:outline-none bg-background text-foreground"
//           rows={4}
//           placeholder="Write your thoughts..."
//         />
//         <button
//           onClick={handleAnalyze}
//           disabled={loading}
//           className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
//         >
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>
//       </div>

//       {result && (
//         <div className="mt-6 bg-muted border-l-4 border-purple-500 p-4 rounded-xl shadow">
//           <p>{result}</p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function TextPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/text", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": "node-secret" // ✅ authentication
        },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResult(`Detected: ${data.label || "unknown"}`);
    } catch {
      setResult("❌ Error analyzing text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="bg-card p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-4">📝 Text Analysis</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none bg-background text-foreground"
          rows={4}
          placeholder="Write your thoughts..."
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-muted border-l-4 border-purple-500 p-4 rounded-xl shadow">
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

