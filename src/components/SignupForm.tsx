"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing up with", { name, email, password });
    // Add signup logic here
    // router.push("/login"); // Example: redirect to login after signup
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-4 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
        />

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
          Sign Up
        </button>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-primary cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
