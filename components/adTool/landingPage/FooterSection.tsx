"use client";

import Link from "next/link";
import { FOOTER_CONFIG } from "@/configuration/site-config";

export function FooterSection() {
  return (
    <footer className="relative w-full bg-gray-900">
      {/* Gradient Top Border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-blue-500/50"></div>

      <div className="container mx-auto px-4 pb-8 pt-16">
        {/* Main Footer Flex */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Brand Section */}
          <div className="flex-1 lg:max-w-md">
            <div className="mb-6 flex items-center">
              <div className="mr-4 h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"></div>
              <span className="text-2xl font-bold text-white">
                {FOOTER_CONFIG.brand.name}
              </span>
            </div>
            <p className="mb-8 text-base leading-relaxed text-gray-400">
              {FOOTER_CONFIG.brand.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {FOOTER_CONFIG.social.links.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-700/30 bg-gray-800/50 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white"
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
          <div className="flex-shrink-0 lg:min-w-[200px]">
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {FOOTER_CONFIG.navigation.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-base text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-gray-600 transition-colors duration-200 group-hover:bg-pink-500"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Support */}
          <div className="flex-shrink-0 lg:min-w-[280px]">
            <h3 className="mb-6 text-lg font-semibold text-white">
              {FOOTER_CONFIG.contact.title}
            </h3>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-gray-400">
                {FOOTER_CONFIG.contact.description}
              </p>

              <Link
                href={FOOTER_CONFIG.contact.button.href}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 active:scale-95 sm:w-auto sm:justify-start"
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
        <div className="border-t border-gray-800/50 pt-8">
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
    </footer>
  );
}
