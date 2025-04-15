const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "**.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // 🚀 Add headers configuration for CORS
  async headers() {
    // 🔒 Define the specific origin of your Chrome extension
    //    Load this from environment variables for security and flexibility!
    const chromeExtensionOrigin = process.env.CHROME_EXTENSION_ORIGIN; // e.g., "chrome-extension://your_extension_id_here"

    // 🤔 Determine the allowed origin based on the environment
    const allowedOrigin =
      process.env.NODE_ENV === "development" ? "*" : chromeExtensionOrigin;

    // ⚠️ Ensure chromeExtensionOrigin is set in production!
    if (process.env.NODE_ENV === "production" && !chromeExtensionOrigin) {
      console.warn(
        "🚨 WARNING: CHROME_EXTENSION_ORIGIN environment variable is not set for production!",
      );
      // Consider throwing an error or using a default restrictive value if this is critical
    }

    // Define common CORS headers for reuse
    const commonCorsHeaders = [
      {
        key: "Access-Control-Allow-Origin",
        value: allowedOrigin || "*", // Fallback to '*' if undefined (less secure)
      },
      {
        key: "Access-Control-Allow-Headers",
        value: "Content-Type, Authorization", // Add other headers if needed by your requests
      },
      {
        key: "Access-Control-Allow-Credentials",
        value: "true", // Crucial for sending/receiving cookies
      },
      // --- Security Headers (Optional but Recommended) ---
      // { key: "X-Content-Type-Options", value: "nosniff" },
      // { key: "X-Frame-Options", value: "DENY" },
      // { key: "Referrer-Policy", value: "origin-when-cross-origin" },
      // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];

    return [
      // --- Configuration for /api/extension/auth ---
      {
        source: "/api/extension/auth", // Match the auth API route path
        headers: [
          ...commonCorsHeaders, // Spread the common headers
          {
            key: "Access-Control-Allow-Methods",
            // 👇 Only GET is needed for the auth check endpoint
            value: "GET, OPTIONS", // OPTIONS is needed for preflight requests
          },
        ],
      },
      // --- Configuration for /api/extension/ads ---
      {
        source: "/api/extension/ads", // Match the ads API route path
        headers: [
          ...commonCorsHeaders, // Spread the common headers
          {
            key: "Access-Control-Allow-Methods",
            // 👇 Allow POST (to save) and DELETE (to unsave) for this endpoint
            value: "POST, DELETE, OPTIONS", // OPTIONS is needed for preflight requests
          },
        ],
      },
      // 💡 Add more source paths here if other API routes need CORS for the extension
      // {
      //   source: "/api/extension/other-data",
      //   headers: [ ... ],
      // },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
