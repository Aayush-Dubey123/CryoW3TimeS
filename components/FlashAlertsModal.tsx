"use client";

import React, { useState } from "react";
import { Bell, Flame, Activity, ExternalLink, Zap, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FlashAlert {
  id: string;
  tag: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
}

const DEFAULT_ALERTS: FlashAlert[] = [
  {
    id: "1",
    tag: "Market Pulse",
    title: "Bitcoin consolidates above key support as institutional inflows hold steady.",
    source: "NewsData.io",
    timeAgo: "Live Snapshot",
    url: "/discover",
  },
  {
    id: "2",
    tag: "Network Gas",
    title: "Ethereum L2 throughput surges; average Layer 1 base fee remains below 15 Gwei.",
    source: "On-Chain Analytics",
    timeAgo: "1h ago",
    url: "/discover",
  },
  {
    id: "3",
    tag: "Macro Web3",
    title: "Crypto regulatory frameworks gain bipartisan attention across global markets.",
    source: "CryptoPotato",
    timeAgo: "3h ago",
    url: "/discover",
  },
];

export default function FlashAlertsModal() {
  const [hasUnread, setHasUnread] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setHasUnread(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-300 hover:text-purple-400 hover:bg-gray-800/60 rounded-full transition-colors"
          title="Market Flash & Breaking Alerts"
          aria-label="Market Flash & Breaking Alerts"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              3
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-[#0E0D17] border border-purple-500/20 text-gray-100 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-1 pb-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Zap className="h-4 w-4" />
              </div>
              <DialogTitle className="text-lg font-semibold text-white">
                Market Flash & News Alerts
              </DialogTitle>
            </div>
            <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
              24h Snapshot
            </Badge>
          </div>
        </DialogHeader>

        {/* Live Market Bar */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs bg-gray-900/60 rounded-xl p-2 border border-gray-800/80">
          <div>
            <div className="text-gray-400">Market Mode</div>
            <div className="font-semibold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Snapshot Live
            </div>
          </div>
          <div>
            <div className="text-gray-400">Gas Tracker</div>
            <div className="font-semibold text-purple-300 mt-0.5">~14 Gwei</div>
          </div>
          <div>
            <div className="text-gray-400">Updates</div>
            <div className="font-semibold text-gray-200 mt-0.5">24h Cycle</div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mt-1">
          {DEFAULT_ALERTS.map((alert) => (
            <a
              key={alert.id}
              href={alert.url}
              className="group block p-3 rounded-xl bg-gray-900/40 hover:bg-purple-950/20 border border-gray-800/80 hover:border-purple-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-purple-300">
                    {alert.tag}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">{alert.timeAgo}</span>
              </div>
              <p className="text-xs text-gray-200 font-medium leading-snug group-hover:text-purple-200 transition-colors">
                {alert.title}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                <span>Source: {alert.source}</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Read <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> All systems nominal
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-xs text-gray-400 hover:text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
