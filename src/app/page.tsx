"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
      <h1 className="text-4xl font-bold mb-12 text-gray-800">AI Mental Health Companion</h1>
      <div className="flex gap-6">
        <button 
          onClick={() => router.push("/camera")}
          className="px-8 py-4 rounded-2xl text-gray-800 bg-white shadow-lg hover:bg-blue-100 text-lg font-semibold"
        >
          📷 Camera
        </button>
        <button 
          onClick={() => router.push("/mic")}
          className="px-8 py-4 rounded-2xl bg-white shadow-lg text-gray-800 hover:bg-green-100 text-lg font-semibold"
        >
          🎤 Mic
        </button>
        <button 
          onClick={() => router.push("/text")}
          className="px-8 py-4 rounded-2xl bg-white shadow-lg text-gray-800 hover:bg-pink-100 text-lg font-semibold"
        >
          💬 Text
        </button>
      </div>
    </div>
  );
}
