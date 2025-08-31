"use client";
import React, { useState, useEffect } from "react";
import VikingsSvgIcon from "../svgs/VikingsSvgIcon";
import { ToggleTheme } from "../global/ToggleTheme";

export default function Footer() {
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 relative">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <VikingsSvgIcon className="w-12 sm:w-16 h-auto transition-transform hover:scale-105" />
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Vikings
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/254729016371"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-500 transition-colors"
            >
              {/* WhatsApp */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </a>

            <a
              href="mailto:hello@delirium.com"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              {/* Email */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v7.273L12 15.004l6.545-4.91V3.82h3.819c.904 0 1.636.733 1.636 1.637z" />
              </svg>
            </a>

            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-500 transition-colors"
            >
              {/* Instagram */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 ..." />
              </svg>
            </a>

            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              {/* Facebook */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12 ..." />
              </svg>
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              {/* GitHub */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.901 1.153h3.68l-8.04 9.19 ..." />
              </svg>
            </a>
          </div>

          {/* Theme toggle */}
          <ToggleTheme />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          {/* Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Vikings. All rights reserved.
            </span>
            <div className="relative">
              <button
                onClick={() => setIsLegalOpen(!isLegalOpen)}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <span>Legal</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isLegalOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLegalOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10">
                  <a
                    href="/terms"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="/privacy"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Crafted By */}
          <a
            href="https://crowstudios.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <span>Crafted by</span>
            <span>🐦‍⬛</span>
            <span>Crow Studios</span>
          </a>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
