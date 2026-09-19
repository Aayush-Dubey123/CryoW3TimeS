"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import Email from "next-auth/providers/email";
export default function LoginPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
      <div
        style={{ fontFamily: "sans-serif" }}
        className="w-full relative max-w-[400px] !font-sans  space-y-6  bg-white/90  shadow-xl bg-blur-xl    rounded-3xl p-6"
      >
        <div className="text-center flex flex-col items-center justify-center  space-y-2">
          <div className="relative flex justify-center  w-[5rem] h-[5rem] items-center ">
            {/* Adjust width and height as needed */}
            <Image
              src="/cry_p.png" // Replace with the path to your logo in the public folder
              alt="Website Logo" // Provide a description for accessibility
              layout="fill" // This makes the image fill the parent container
              className="object-contain w-auto justify-center self-center p-0  items-center shadow-black shadow-md flex rounded-full" // This ensures the image maintains its aspect ratio
            />
          </div>

          <h1 className="text-2xl font-semibold font-sans tracking-tight text-gray-800">
            Welcome back
          </h1>

          <p className="text-gray-600 font-sans">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

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
              <span className="  px-2 font-semibold font-sans text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-2 relative">
            <input
              name="email"
              type="email"
              placeholder="E-Mail Address"
              required
              className="w-full h-11 px-3 text-black rounded-xl border border-gray-200 font-sans focus:outline-none focus:ring-2 focus:ring-gray-100"
              disabled={isLoading}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full h-11 px-3 rounded-xl text-black border font-sans border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 items-center align-middle top-16 -translate-y-1/2 text-gray-300 "
              disabled={isLoading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            {/* <div>
              <Link
                href="/forgot-password"
                className="text-gray-500 text-sm underline text-end items-end font-sans hover:text-gray-900"
              >
                Forgot password?
              </Link>
            </div> */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#24292F] font-sans text-white hover:bg-[#24292F]/90 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/signup"
            className="text-gray-500 font-semibold font-sans hover:text-gray-900"
          >
            Don&apos;t have an account yet? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
