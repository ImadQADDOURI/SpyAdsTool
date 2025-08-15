"use client";

import Link from "next/link";

import { FOOTER_CONFIG } from "../configuration/site";

export function FooterSection() {
  return (
    <footer
      className="relative w-full"
      style={{ backgroundColor: FOOTER_CONFIG.styling.backgroundColor }}
    >
      {/* Gradient Top Border */}
      <div
        className="h-0.5 w-full"
        style={{
          background: FOOTER_CONFIG.styling.gradientBorder,
        }}
      ></div>

      <div
        className={`container mx-auto px-4 ${FOOTER_CONFIG.styling.padding.top} ${FOOTER_CONFIG.styling.padding.bottom}`}
      >
        {/* Main Footer Grid */}
        <div
          className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 ${FOOTER_CONFIG.styling.padding.section}`}
        >
          {/* Brand Section */}
          <div
            className={`${FOOTER_CONFIG.styling.grid.brand} animate-fade-in-up`}
          >
            <div className="mb-6 flex items-center">
              <div
                className={`${FOOTER_CONFIG.brand.logo.size} bg-gradient-to-r ${FOOTER_CONFIG.brand.logo.colors} ${FOOTER_CONFIG.brand.logo.borderRadius} mr-4 flex-shrink-0`}
              ></div>
              <span className="text-2xl font-bold text-white">
                {FOOTER_CONFIG.brand.name}
              </span>
            </div>
            <p className="mb-8 max-w-md text-base leading-relaxed text-gray-400">
              {FOOTER_CONFIG.brand.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {FOOTER_CONFIG.social.links.map((social, index) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-fade-in-scale flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700/30 bg-gray-800/50 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white"
                  style={{
                    animationDelay: `calc(${FOOTER_CONFIG.animation.delays.social} + ${index} * ${FOOTER_CONFIG.animation.delays.socialStagger})`,
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={social.icon}
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`${FOOTER_CONFIG.styling.grid.links} animate-fade-in-up-delayed`}
          >
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {FOOTER_CONFIG.navigation.quickLinks.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="animate-fade-in-left group flex items-center text-base text-gray-400 transition-colors duration-200 hover:text-white"
                    style={{
                      animationDelay: `calc(${FOOTER_CONFIG.animation.delays.links} + ${index} * ${FOOTER_CONFIG.animation.delays.linkStagger})`,
                    }}
                  >
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-gray-600 transition-colors duration-200 group-hover:bg-pink-500"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div
            className={`${FOOTER_CONFIG.styling.grid.contact} animate-fade-in-up-more-delayed`}
          >
            <h3 className="mb-6 text-lg font-semibold text-white">
              {FOOTER_CONFIG.contact.title}
            </h3>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-gray-400">
                {FOOTER_CONFIG.contact.description}
              </p>

              <Link
                href={FOOTER_CONFIG.contact.button.href}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 sm:w-auto sm:justify-start"
              >
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {FOOTER_CONFIG.contact.button.text}
              </Link>

              <div className="text-sm text-gray-500">
                <p>{FOOTER_CONFIG.contact.button.availability}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="animate-fade-in border-t border-gray-800/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              © 2024 {FOOTER_CONFIG.brand.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {FOOTER_CONFIG.navigation.legalLinks.map((link, index) => (
                <div key={link.name} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-gray-300"
                  >
                    {link.name}
                  </Link>
                  {index < FOOTER_CONFIG.navigation.legalLinks.length - 1 && (
                    <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.6s ease-out;
          animation-delay: ${FOOTER_CONFIG.animation.delays.links};
          animation-fill-mode: both;
        }

        .animate-fade-in-up-more-delayed {
          animation: fade-in-up 0.6s ease-out;
          animation-delay: ${FOOTER_CONFIG.animation.delays.contact};
          animation-fill-mode: both;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.4s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.4s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
      `}</style>
    </footer>
  );
}
