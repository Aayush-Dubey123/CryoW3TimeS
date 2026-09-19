// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use 'next/router' for older versions
import { Icons } from "@/components/Icons"; // Adjust this import based on your UI library
import Link from "next/link";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { signIn } from "next-auth/react"; // Ensure this import is present
import Image from "next/image";
// Example user data for demonstration purposes
const users: { id: number; name: string; email: string; password: string; image: string }[] = []; // This will hold the registered users

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Check if the user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError("User already exists with this email.");
      setIsLoading(false);
      return;
    }

    // Create a new user
    const newUser = {
      id: users.length + 1, // Simple ID generation
      name,
      email,
      password, // In a real application, hash the password
      image: "https://example.com/path/to/profile-image.jpg", // Placeholder image
    };

    // Add the new user to the users array
    users.push(newUser);

    // Redirect to the login page or dashboard after successful sign-up
    router.push("/login");
  }

  return (
    <div className="min-h-screen relative flex flex-col !font-sans rounded-3xl items-center justify-center bg-gradient-to-br  px-4">
      <AnimatedGridPattern
        numSquares={120}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="inset-x-0 inset-y-[-30%] h-[130%] skew-y-12"
      />
      <div className="w-full relative max-w-[400px] !font-sans space-y-6 bg-white/80 shadow-lg rounded-3xl p-6">
        <div className="flex flex-col items-center text-center space-y-2">
        <div className="relative flex justify-center m-1  w-[5rem] h-[5rem] items-center ">
            {/* Adjust width and height as needed */}
            <Image
              src="/cry_p.png" // Replace with the path to your logo in the public folder
              alt="Website Logo" // Provide a description for accessibility
              layout="fill" // This makes the image fill the parent container
              className="object-contain  w-auto justify-center self-center p-0  items-center shadow-black shadow-md flex rounded-full" // This ensures the image maintains its aspect ratio
            />
          </div>
          <h1 className="text-2xl font-semibold font-sans tracking-tight text-gray-800">
            Create an Account
          </h1>
          <p className="text-gray-600 font-sans">
            Please enter your details to sign up.
          </p>
        </div>
        <div className="grid gap-2">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex h-11 items-center rounded-xl justify-center gap-2  bg-[#4285F4] text-white hover:bg-[#357ae8] px-8"
            disabled={isLoading}
          >
            <Icons.google className="h-5 w-5" />
            <span className="font-sans">Continue with Google</span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 pb-4 font-semibold font-sans text-gray-500">
                Or continue with
              </span>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
                  {error}
                </div>
              )}
            </div>
            <form onSubmit={onSubmit} className="space-y-2 relative">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 text-black rounded-xl border border-gray-200 font-sans focus:outline-none focus:ring-2 focus:ring-gray-100"
                disabled={isLoading}
              />
              <input
                name="email"
                type="email"
                placeholder="E-Mail Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 text-black rounded-xl border border-gray-200 font-sans focus:outline-none focus:ring-2 focus:ring-gray-100"
                disabled={isLoading}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 rounded-xl text-black border font-sans border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
                disabled={isLoading}
              />

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#24292F] font-sans text-white hover:bg-[#24292F]/90 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/login"
            className="text-gray-500 font-semibold font-sans hover:text-gray-900"
          >
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}