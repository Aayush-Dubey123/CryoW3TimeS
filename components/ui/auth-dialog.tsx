"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export function AuthDialog() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add authentication logic here
    console.log(isSignIn ? "Signing in..." : "Signing up...", { email, password });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-500/10">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0A0B0F] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isSignIn ? "Sign In" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1A1625] border-white/10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1A1625] border-white/10"
              required
            />
          </div>
          <div className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-purple-500 hover:text-purple-400"
            >
              {isSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}