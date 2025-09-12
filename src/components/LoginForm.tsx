"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    console.log("Logging in with", { email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          Login
        </button>

        <p className="text-center text-gray-600 dark:text-gray-300">
          New User?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
