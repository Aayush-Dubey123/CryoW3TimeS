"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  RiFacebookFill,
  RiTwitterFill,
  RiInstagramFill,
  RiLinkedinFill,
} from "react-icons/ri";

interface FooterLink {
  name: string;
  url: string;
}

interface FooterLinks {
  [category: string]: FooterLink[] | string[];
}

const footerLinks: FooterLinks = {
  Company: ["About Us", "Careers", "Media", "Contact"],
  Resources: ["Blog", "Newsletter", "Events", "Help Center"],
  "Social Media": [
    { name: "Facebook", url: "https://www.facebook.com/share/1KDJA6QcN5/" },
    { name: "Twitter", url: "https://x.com/Cryow3Times?s=09" },
    {
      name: "Instagram",
      url: "https://www.instagram.com/cryow3times/profilecard/?igsh=cTg3b3ZnZnI2Yzh4",
    },
    { name: "LinkedIn", url: "https://linkedin.com" },
  ],
};

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "facebook":
      return <RiFacebookFill />;
    case "twitter":
      return <RiTwitterFill />;
    case "instagram":
      return <RiInstagramFill />;
    case "linkedin":
      return <RiLinkedinFill />;
    default:
      return null;
  }
};

export default function Footer() {
  return (
    <footer className="border-t rounded-xl border-gray-800 bg-[#0D0B12]">
      <div className="mx-auto pl-24 px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid gap-12 items-center lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:grid-cols-2 sm:grid-cols-1">
          {/* Brand Section */}
          <div className="space-y-6 ">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Cryow3Times</h2>
              <p className="text-gray-400 text-xs max-w-md">
                Craft narratives that ignite inspiration, knowledge, and
                entertainment.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-4">
              <div className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className="pl-10 bg-gray-800/50 border-gray-700 rounded-xl focus:border-purple-500 text-white w-full text-xs"
                  />
                </div>
                <Button className="bg-purple-500 rounded-xl hover:bg-purple-600 text-white text-xs">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3 pl-20">
              <h3 className="text-white font-semibold text-sm">{category}</h3>
              <ul className="space-y-3">
                {Array.isArray(links)
                  ? links.map((link) => {
                      if (typeof link === "string") {
                        return (
                          <li key={link}>
                            <Link
                              href="#"
                              className="hover:text-purple-500 transition-colors text-xs"
                            >
                              {link}
                            </Link>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            key={link.name}
                            className="flex items-center space-x-2"
                          >
                            <Link
                              href={link.url}
                              className="hover:text-purple-500 transition-colors text-xs flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="text-lg">
                                {getIcon(link.name)}
                              </span>
                              <span className="ml-2">{link.name}</span>
                            </Link>
                          </li>
                        );
                      }
                    })
                  : null}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs text-center md:text-left">
              © 2024 Cryow3Times. All rights reserved
            </div>
            {/* <div className="flex flex-wrap gap-6 text-xs justify-center md:justify-start">
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors"
              >
                Policy Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-purple-500 transition-colors"
              >
                Cookie Policy
              </Link>
             
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
