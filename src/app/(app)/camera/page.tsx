"use client";
import React, { useEffect, useRef, useState } from "react";


const BACKEND_URL = "https://fcc1baf2e6d0.ngrok-free.app/analyze-face";
const BACKEND_API_KEY = "hackathon123";
const GEMINI_API_KEY = "AIzaSyBIQk3XTN5OnR_RuQ15I8D6FDaATOC9exU";
const GEMINI_MODEL = "gemini-2.0-flash";

type Msg = {
  id: string;
  from: "user" | "ai" | "system";
  text: string;
  meta?: any;
};

const uid = (p = "") =>
  `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}${p}`;

export default function EmotionChat() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [running, setRunning] = useState(false);
  const [intervalSec, setIntervalSec] = useState(5);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      from: "ai",
      text: "Hi — I can check your face and chat like a caring friend. Click Start.",
    },
  ]);
  const [lastFace, setLastFace] = useState<any | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [loadingCapture, setLoadingCapture] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start camera on mount
  useEffect(() => {
    (async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraOn(true);
      } catch (e) {
        setCameraOn(false);
        pushAiMessage("❌ Camera access denied. Please enable your camera.");
      }
    })();

    return () => {
      const tracks =
        (videoRef.current?.srcObject as MediaStream | null)?.getTracks() || [];
      tracks.forEach((t) => t.stop());
    };
  }, []);

  // Auto capture effect
  useEffect(() => {
    if (running) {
      captureAndProcess();
      intervalRef.current = window.setInterval(
        captureAndProcess,
        intervalSec * 1000
      );
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, intervalSec]);

  // Push messages
  const pushUserMessage = (text: string, meta?: any) =>
    setMessages((m) => [...m, { id: uid("u"), from: "user", text, meta }]);
  const pushAiMessage = (text: string, meta?: any) =>
    setMessages((m) => [...m, { id: uid("a"), from: "ai", text, meta }]);

  // Build Gemini input
  const buildContentsFromHistory = () => {
    const contents: any[] = [];
    contents.push({
      role: "user",
      parts: [
        {
          text: "You are a calm, empathetic friend. Reply short, warm, with one kind follow-up question.",
        },
      ],
    });
    for (const m of messages) {
      const role = m.from === "ai" ? "model" : "user";
      contents.push({ role, parts: [{ text: m.text }] });
      if (m.meta?.face) {
        contents.push({
          role: "user",
          parts: [{ text: `FACE_ANALYSIS: ${JSON.stringify(m.meta.face)}` }],
        });
      }
    }
    return contents;
  };

  // Call Gemini once
  const callGemini = async (contents: any[]) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
      GEMINI_API_KEY
    )}`;
    const body = {
      contents,
      generationConfig: { maxOutputTokens: 300, temperature: 0.5 },
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Gemini error: ${resp.status} ${t}`);
    }
    const j = await resp.json();
    return (
      j?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I’m here for you."
    );
  };

  // Send to Gemini (only 1 response now)
  const sendToGeminiWithHistory = async (
    newUserText?: string,
    faceJson?: any
  ) => {
    const contents = buildContentsFromHistory();
    if (faceJson)
      contents.push({
        role: "user",
        parts: [{ text: `FACE_ANALYSIS: ${JSON.stringify(faceJson)}` }],
      });
    if (newUserText)
      contents.push({ role: "user", parts: [{ text: newUserText }] });

    const reply = await callGemini(contents);
    return reply;
  };

  const revealAi = async (text: string) => {
    pushAiMessage(text);
    if (speechEnabled) speakText(text);
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    window.speechSynthesis.speak(utt);
  };

  // Capture image and process
  const captureAndProcess = async () => {
    if (!videoRef.current) return;
    setLoadingCapture(true);
    try {
      const video = videoRef.current;
      if (!video.videoWidth) throw new Error("Camera is off.");
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(video, 0, 0);
      const blob = await new Promise<Blob>((r) =>
        canvas.toBlob((b) => r(b as Blob), "image/jpeg", 0.8)
      );

      const form = new FormData();
      form.append("file", blob, "capture.jpg");
      const backendResp = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "x-api-key": BACKEND_API_KEY },
        body: form,
      });
      if (!backendResp.ok) throw new Error(await backendResp.text());
      const faceData = await backendResp.json();
      setLastFace(faceData);
      pushUserMessage(`I appear ${faceData.label}`, { face: faceData });

      const reply = await sendToGeminiWithHistory(undefined, faceData);
      await revealAi(reply);
    } catch (err: any) {
      pushAiMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoadingCapture(false);
    }
  };

  const handleSendTyped = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    pushUserMessage(text);
    try {
      const reply = await sendToGeminiWithHistory(text, undefined);
      await revealAi(reply);
    } catch (err: any) {
      pushAiMessage(`❌ Error: ${err.message}`);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      pushAiMessage("❌ Voice input not supported.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onresult = (ev: any) => {
      const transcript = ev.results[0][0].transcript;
      setInput(transcript);
      handleSendTyped();
    };
    recog.start();
  };

  const toggleAuto = () => setRunning((r) => !r);

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6 border">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel: Camera */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">👀 Emotion Friend</h2>
            <div className="relative rounded-xl overflow-hidden border bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[360px] object-cover"
              />
              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70 text-lg font-semibold">
                  Camera is OFF — please enable your camera
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={toggleAuto}
                className={`px-4 py-2 rounded text-white ${
                  running ? "bg-red-500" : "bg-green-600"
                }`}
              >
                {running ? "Stop Auto" : "Start Auto"}
              </button>
              <button
                onClick={captureAndProcess}
                disabled={loadingCapture}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {loadingCapture ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          </div>

          {/* Right Panel: Chat */}
          <div className="w-full md:w-[380px] border-l pl-6">
            <h3 className="text-lg font-semibold mb-3">Conversation</h3>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-auto">
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

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type a message…"
              />
              <button
                onClick={handleSendTyped}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Send
              </button>
              <button
                onClick={startVoiceInput}
                className={`px-3 py-2 rounded ${
                  listening ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                🎙️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
