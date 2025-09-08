"use client";
import React, { useState, useEffect } from "react";
import VikingsSvgIcon from "../svgs/VikingsSvgIcon";


export default function Footer() {
  // const [isLegalOpen, setIsLegalOpen] = useState(false);
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
    <div className="border-t border-gray-200 dark:border-gray-800 relative bg-[#1d62fb] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <VikingsSvgIcon className="w-12 sm:w-16 h-auto transition-transform hover:scale-105" />
            <span className="text-lg font-medium text-white ">
              Vikings
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href="https://wa.me/254721780466"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black transition-colors"
              aria-label="WhatsApp"
            >
              {/* WhatsApp */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.379.28 2.693.784 3.888c.279.66.418.99.436 1.24c.017.25-.057.524-.204 1.073L2 22l3.799-1.016c.549-.147.823-.22 1.073-.204c.25.018.58.157 1.24.436A10 10 0 0 0 12 22Z"></path>
                <path d="m8.588 12.377l.871-1.081c.367-.456.82-.88.857-1.488c.008-.153-.1-.841-.315-2.218C9.916 7.049 9.41 7 8.973 7c-.57 0-.855 0-1.138.13c-.358.163-.725.622-.806 1.007c-.064.305-.016.515.079.935c.402 1.783 1.347 3.544 2.811 5.009c1.465 1.464 3.226 2.409 5.01 2.811c.42.095.629.143.934.079c.385-.08.844-.448 1.008-.806c.129-.283.129-.568.129-1.138c0-.438-.049-.943-.59-1.028c-1.377-.216-2.065-.323-2.218-.315c-.607.036-1.032.49-1.488.857l-1.081.87"></path>
              </svg>
            </a>

            <a
              href="mailto:Vikingskepower@gmail.com"
              className="text-white hover:text-black transition-colors"
              aria-label="Email"
            >
              {/* Gmail */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="m2 6l6.913 3.917c2.549 1.444 3.625 1.444 6.174 0L22 6"></path>
                <path d="M2.016 13.476c.065 3.065.098 4.598 1.229 5.733c1.131 1.136 2.705 1.175 5.854 1.254c1.94.05 3.862.05 5.802 0c3.149-.079 4.723-.118 5.854-1.254c1.131-1.135 1.164-2.668 1.23-5.733c.02-.986.02-1.966 0-2.952c-.066-3.065-.099-4.598-1.23-5.733c-1.131-1.136-2.705-1.175-5.854-1.254a115 115 0 0 0-5.802 0c-3.149.079-4.723.118-5.854 1.254c-1.131 1.135-1.164 2.668-1.23 5.733a69 69 0 0 0 0 2.952Z"></path>
              </svg>
            </a>

            <a
              href="https://instagram.com/vikings_traders_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black transition-colors"
              aria-label="Instagram"
            >
              {/* Instagram */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinejoin="round" strokeWidth={1.5} d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"></path>
                <path strokeWidth={1.5} d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0Z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.508 6.5h-.01"></path>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/VikingsTraders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black transition-colors"
              aria-label="Facebook"
            >
              {/* Facebook */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M6.182 10.333c-.978 0-1.182.192-1.182 1.111v1.667c0 .92.204 1.111 1.182 1.111h2.363v6.667c0 .92.205 1.111 1.182 1.111h2.364c.978 0 1.182-.192 1.182-1.111v-6.667h2.654c.741 0 .932-.135 1.136-.806l.507-1.666c.349-1.149.133-1.417-1.137-1.417h-3.16V7.556c0-.614.529-1.112 1.181-1.112h3.364c.978 0 1.182-.191 1.182-1.11V3.11C19 2.191 18.796 2 17.818 2h-3.364c-3.263 0-5.909 2.487-5.909 5.556v2.777z" clipRule="evenodd"></path>
              </svg>
            </a>

            <a
              href="https://x.com/Vikings2308"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black dark:hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              {/* X (Twitter) */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="m3 21l7.548-7.548M21 3l-7.548 7.548m0 0L8 3H3l7.548 10.452m2.904-2.904L21 21h-5l-5.452-7.548"></path>
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@vikingstraders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black dark:hover:text-white transition-colors"
              aria-label="TikTok"
            >
              {/* TikTok */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"></path>
                <path strokeLinecap="round" d="M10.536 11.008c-.82-.116-2.69.075-3.606 1.77s.007 3.459.584 4.129c.569.627 2.378 1.814 4.297.655c.476-.287 1.069-.502 1.741-2.747l-.078-8.834c-.13.973.945 3.255 4.004 3.525"></path>
              </svg>
            </a>

            <a
              href="https://www.youtube.com/@vikingstraders4737"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black transition-colors"
              aria-label="YouTube"
            >
              {/* YouTube */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"></path>
                <path d="M9.5 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.584a.5.5 0 0 1 0 .84l-5.576 3.584a.5.5 0 0 1-.77-.42Z"></path>
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/vikings-kepower"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-black transition-colors"
              aria-label="LinkedIn"
            >
              {/* LinkedIn */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={1.5} d="M7 10v7m4-4v4m0-4a3 3 0 1 1 6 0v4m-6-4v-3"></path>
                <path strokeLinecap="round" strokeWidth={2} d="M7.008 7h-.009"></path>
                <path strokeWidth={1.5} d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          {/* Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <span className="text-gray-300 ">
              © {new Date().getFullYear()} Vikings. All rights reserved.
            </span>
          </div>

          {/* Crafted By */}
          <a
            href="https://crowstudios.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-50 hover:text-gray-300 transition-colors"
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
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 z-50"
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