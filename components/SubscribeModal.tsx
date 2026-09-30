"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SubscribeModalProps {
  children?: React.ReactNode;
  triggerText?: string;
  className?: string;
}

export default function SubscribeModal({
  children,
  triggerText = "Subscribe",
  className,
}: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    // Simulate instant safe local subscription
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className={`bg-purple-600 hover:bg-purple-500 text-white rounded-full px-5 font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all ${className}`}
          >
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] bg-[#0E0D17] border border-purple-500/20 text-gray-100 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-2 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Daily Web3 Digest
              </DialogTitle>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Get the curated 24-hour crypto snapshot, breaking headlines, and on-chain intelligence delivered directly every morning.
          </p>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-3 bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 mt-2">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-white">
              You are on the list!
            </h3>
            <p className="text-xs text-gray-300">
              We have saved <span className="text-purple-300 font-medium">{email}</span>. You will receive your first 24-hour market digest tomorrow morning.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="mt-2 border-gray-700 text-gray-300 hover:text-white rounded-full text-xs"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-400" /> Free forever
              </span>
              <span>No spam, unsubscribe anytime</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe to Daily Snapshot
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
