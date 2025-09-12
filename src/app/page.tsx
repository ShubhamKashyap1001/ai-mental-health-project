"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-gray-100 transition">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          AI Mental Health Companion 🧠💙
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 text-gray-700 dark:text-gray-300">
          Your personal AI-powered companion to help you track emotions, 
          reduce stress, and promote better mental well-being through 
          <span className="font-semibold"> camera, voice, and text</span>.
        </p>

        {/* Main Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={() => router.push("/camera")}
            className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:bg-blue-100 dark:hover:bg-gray-700 text-lg font-semibold transition"
          >
            📷 Use Camera
          </button>
          <button 
            onClick={() => router.push("/mic")}
            className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:bg-green-100 dark:hover:bg-gray-700 text-lg font-semibold transition"
          >
            🎤 Use Mic
          </button>
          <button 
            onClick={() => router.push("/text")}
            className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:bg-pink-100 dark:hover:bg-gray-700 text-lg font-semibold transition"
          >
            💬 Use Text
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-16 px-6 rounded-t-3xl shadow-inner transition">
        <h2 className="text-3xl font-bold text-center mb-10">✨ How It Helps You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">📷 Camera Analysis</h3>
            <p>Analyze your facial expressions to detect stress, anxiety, or positivity in real time.</p>
          </div>
          <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">🎤 Voice Emotion</h3>
            <p>Understand emotions in your voice tone, detecting calmness, stress, or excitement.</p>
          </div>
          <div className="bg-pink-50 dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">💬 Text Support</h3>
            <p>Write your thoughts and get AI-driven insights to improve your mental well-being.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-black text-black dark:text-white text-center py-4 mt-10">
        <p>© {new Date().getFullYear()} AI Mental Health Companion | Built with ❤️</p>
      </footer>
    </div>
  );
}
