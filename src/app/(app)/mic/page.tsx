// "use client";
// import { useState, useRef } from "react";

// export default function MicPage() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any | null>(null);
//   const [recording, setRecording] = useState(false);

//   const mediaRef = useRef<MediaRecorder | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   // ✅ Replace with your backend URL
//   const API_URL = "https://8b6c4aafe6e4.ngrok-free.app/analyze-voice";
//   const API_KEY = "hackathon123";

//   // 🔄 Convert Blob → WAV
//   const convertToWav = async (blob: Blob): Promise<Blob> => {
//     const arrayBuffer = await blob.arrayBuffer();
//     const audioCtx = new AudioContext();
//     const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

//     const wavBuffer = audioBufferToWav(audioBuffer);
//     return new Blob([wavBuffer], { type: "audio/wav" });
//   };

//   // Helper: AudioBuffer → WAV buffer
//   function audioBufferToWav(buffer: AudioBuffer) {
//     let numOfChan = buffer.numberOfChannels,
//       length = buffer.length * numOfChan * 2 + 44,
//       bufferData = new ArrayBuffer(length),
//       view = new DataView(bufferData),
//       channels: Float32Array[] = [],
//       i,
//       sample,
//       offset = 0,
//       pos = 0;

//     function setUint16(data: number) {
//       view.setUint16(pos, data, true);
//       pos += 2;
//     }
//     function setUint32(data: number) {
//       view.setUint32(pos, data, true);
//       pos += 4;
//     }

//     // RIFF/WAV header
//     setUint32(0x46464952); // "RIFF"
//     setUint32(length - 8); // file length - 8
//     setUint32(0x45564157); // "WAVE"

//     setUint32(0x20746d66); // "fmt "
//     setUint32(16); // length = 16
//     setUint16(1); // PCM
//     setUint16(numOfChan);
//     setUint32(buffer.sampleRate);
//     setUint32(buffer.sampleRate * 2 * numOfChan);
//     setUint16(numOfChan * 2);
//     setUint16(16);

//     setUint32(0x61746164); // "data"
//     setUint32(length - pos - 4);

//     for (i = 0; i < buffer.numberOfChannels; i++)
//       channels.push(buffer.getChannelData(i));

//     while (pos < length) {
//       for (i = 0; i < numOfChan; i++) {
//         sample = Math.max(-1, Math.min(1, channels[i][offset]));
//         sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
//         view.setInt16(pos, sample, true);
//         pos += 2;
//       }
//       offset++;
//     }
//     return bufferData;
//   }

//   // 🎯 Send audio chunk to backend
//   const sendChunk = async (blob: Blob) => {
//     const fd = new FormData();
//     const wavBlob = await convertToWav(blob);
//     fd.append("file", wavBlob, "recording.wav");

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "x-api-key": API_KEY },
//         body: fd,
//       });

//       const data = await res.json();
//       console.log("✅ Backend response:", data);
//       setResult(data);

//       // Show detected emotion in chat
//       if (data.emotion_analysis) {
//         alert(
//           `🧠 Detected Emotion: ${data.emotion_analysis.predicted_label}\n\n` +
//             JSON.stringify(data.emotion_analysis.probabilities, null, 2)
//         );
//       }

//       // Play AI voice reply if available
//       if (data.gemini_voice) {
//         const audio = new Audio(`data:audio/mp3;base64,${data.gemini_voice}`);
//         audio.play();
//       }
//     } catch (err) {
//       console.error(err);
//       setResult({ error: "❌ Error analyzing voice" });
//     }
//   };

//   // ▶️ Start Recording
//   const startRecording = async () => {
//     setResult(null);
//     setLoading(true);
//     setRecording(true);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       streamRef.current = stream;

//       const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//       mediaRef.current = recorder;

//       recorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           sendChunk(e.data);
//         }
//       };

//       recorder.start(3000); // send every 3s
//       setTimeout(() => stopRecording(), 10000); // auto-stop after 10s
//     } catch {
//       setResult({ error: "❌ Microphone access denied" });
//       setLoading(false);
//       setRecording(false);
//     }
//   };

//   // ⏹ Stop Recording
//   const stopRecording = () => {
//     if (mediaRef.current && mediaRef.current.state !== "inactive") {
//       mediaRef.current.stop();
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((t) => t.stop());
//     }
//     setLoading(false);
//     setRecording(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-[500px] text-center transition">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
//           🎤 Real-time Voice Emotion Detection + Gemini AI
//         </h2>

//         {!recording ? (
//           <button
//             onClick={startRecording}
//             disabled={loading}
//             className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
//           >
//             {loading ? "Preparing..." : "Start Recording"}
//           </button>
//         ) : (
//           <button
//             onClick={stopRecording}
//             className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
//           >
//             ⏹ Stop Recording
//           </button>
//         )}
//       </div>

//       {result && (
//         <div className="mt-6 bg-yellow-100 dark:bg-yellow-800 border-l-4 border-yellow-500 p-4 rounded-xl shadow transition w-[500px] text-left space-y-3">
//           {result.error ? (
//             <p className="text-red-600 font-medium">{result.error}</p>
//           ) : (
//             <>
//               <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                 🎯 Emotion: {result.emotion_analysis?.predicted_label}
//               </p>

//               <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                 💡 {result.gemini_text}
//               </p>

//               {result.emotion_analysis?.probabilities && (
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   <p className="font-medium">📊 Probabilities:</p>
//                   <ul className="list-disc list-inside">
//                     {Object.entries(result.emotion_analysis.probabilities).map(
//                       ([emo, prob]) => (
//                         <li key={emo}>
//                           {emo}: {(prob as number * 100).toFixed(2)}%
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 </div>
//               )}

//               {result.gemini_voice && (
//                 <audio
//                   controls
//                   src={`data:audio/mp3;base64,${result.gemini_voice}`}
//                   className="mt-2 w-full"
//                 />
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useEffect, useRef, useState } from "react";

const BACKEND_URL = "https://fcc1baf2e6d0.ngrok-free.app/analyze-voice";
const BACKEND_API_KEY = "hackathon123";
const GEMINI_API_KEY = "AIzaSyBIQk3XTN5OnR_RuQ15I8D6FDaATOC9exU";
const GEMINI_MODEL = "gemini-2.0-flash";

type Msg = {
  id: string;
  from: "user" | "ai";
  text: string;
  meta?: any;
};

const uid = (p = "") =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}${p}`;

export default function MicChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      from: "ai",
      text: "🎤 Hi — I can listen to your voice, detect your mood, and respond kindly. Click Start Recording.",
    },
  ]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const pushUserMessage = (text: string, meta?: any) =>
    setMessages((m) => [...m, { id: uid("u"), from: "user", text, meta }]);
  const pushAiMessage = (text: string, meta?: any) =>
    setMessages((m) => [...m, { id: uid("a"), from: "ai", text, meta }]);


  const callGemini = async (history: Msg[], newInput: string, emotionJson?: any) => {
    const contents: any[] = [
      {
        role: "user",
        parts: [
          {
            text: "You are a caring, empathetic friend. Respond warmly, short, with one follow-up question.",
          },
        ],
      },
    ];

    for (const m of history) {
      const role = m.from === "ai" ? "model" : "user";
      contents.push({ role, parts: [{ text: m.text }] });
    }

    if (emotionJson) {
      contents.push({
        role: "user",
        parts: [{ text: `VOICE_ANALYSIS: ${JSON.stringify(emotionJson)}` }],
      });
    }

    if (newInput) {
      contents.push({ role: "user", parts: [{ text: newInput }] });
    }

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 200, temperature: 0.6 },
        }),
      }
    );

    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I’m here for you, I care about how you feel."
    );
  };

 
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    window.speechSynthesis.speak(utt);
  };

  // Send audio blob to backend
  const sendAudio = async (blob: Blob) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, "voice.wav");

      const resp = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "x-api-key": BACKEND_API_KEY },
        body: fd,
      });

      if (!resp.ok) throw new Error(await resp.text());
      const emotionData = await resp.json();

      pushUserMessage("🎙️ I just spoke something...", { voice: emotionData });

      const reply = await callGemini(messages, "", emotionData);
      pushAiMessage(reply);
      speakText(reply);
    } catch (err: any) {
      pushAiMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        await sendAudio(blob);
      };

      recorder.start();
      setRecording(true);
    } catch {
      pushAiMessage("❌ Microphone access denied.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setRecording(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-4">🎤 Voice Emotion Friend</h2>

        <div className="mb-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              ▶️ Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {/* Chat Window */}
        <div className="border-t pt-4 max-h-[500px] overflow-auto space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`px-3 py-2 rounded-xl max-w-[75%] ${
                m.from === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}
