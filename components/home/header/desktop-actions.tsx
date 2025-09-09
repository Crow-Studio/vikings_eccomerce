"use client";
import { memo } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IconButton } from "@/components/home/header/icon-button";
import SolarMagniferOutline from "@/components/svgs/SolarMagniferOutline";
import type { User } from "@/lib/server/user";

interface DesktopActionsProps {
  user: User | null;
  onSearchOpen: () => void;
}

export const DesktopActions = memo(
  ({ user, onSearchOpen }: DesktopActionsProps) => {
    return (
      <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
        <TooltipProvider>
          <div className="flex items-center space-x-1 md:space-x-2">
            <IconButton
              icon={SolarMagniferOutline}
              tooltip="Search (⌘K)"
              onClick={onSearchOpen}
            />
            <Link href="/products">
              <IconButton
                icon={() => (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                )}
                tooltip="Shop"
              />
            </Link>
            <Link href="/about-us" className="flex items-center">
              <IconButton
                icon={() => (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                tooltip="About Us"
              />
              <span className="text-xs md:text-sm">About Us</span>
            </Link>
          </div>
        </TooltipProvider>
        <Separator orientation="vertical" className="h-4 mx-1 md:mx-2" />
        {user && (
          <Link
            href="/account/dashboard"
            className="text-xs md:text-sm hover:text-primary transition-colors whitespace-nowrap hover:scale-105 transform duration-200"
          >
            Account
          </Link>
        )}
      </div>
    );
  }
);

DesktopActions.displayName = "DesktopActions";
