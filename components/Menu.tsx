"use client"

import { X, ChevronLeft, Search, ThermometerSun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MobileMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  handleNavbarSearch: (query: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  handleSearch: () => void
}

export function MobileMenu({
  isOpen,
  setIsOpen,
  handleNavbarSearch,
  searchTerm,
  setSearchTerm,
  handleSearch
}: MobileMenuProps) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="absolute left-0 top-0 bottom-0 w-full bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <ThermometerSun className="h-5 w-5" />
            <span className="text-sm">27°C</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div>
              <p className="text-sm">Welcome! to timesofindia.com</p>
            </div>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            SIGN IN / REGISTER
          </Button>
        </div>

        {/* Edition Selector */}
        <div className="px-6 py-2 border-y flex items-center justify-between">
          <span className="text-sm font-medium">EDITION</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">IN</span>
            <ChevronLeft className="h-4 w-4 rotate-270" />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-6 space-y-4">
          {["Crypto News", "NFTs", "Market Updates", "Web3", "DeFi"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  handleNavbarSearch(item)
                  setIsOpen(false)
                }}
                className="block w-full text-left text-muted-foreground hover:text-primary font-medium transition-colors py-2"
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
                setIsOpen(false)
              }
            }}
            placeholder="Search..."
            className="w-full rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

