"use client"

import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export default function Navbar() {
  const router = useRouter()

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-background shadow-md">

      {/* Brand name */}
      <button
        onClick={() => router.push("/")}
        className="text-xl font-bold text-foreground hover:opacity-80 transition"
      >
        AI Mental Health
      </button>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/aboutus")}
          className="hover:underline"
        >
          About Us
        </button>
        {/* Scrolls to Home page features section */}
        <a
          href="/#features"
          className="hover:underline"
        >
          Features
        </a>
      </div>

      {/* Right side - Dashboard + Login + Dark Mode */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/userdashboard")}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition"
        >
          Login
        </button>

        <ModeToggle />
      </div>
    </nav>
  )
}
