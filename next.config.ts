import type { NextConfig } from "next";

const firebaseProject = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "uacs-website";

const nextConfig: NextConfig = {
  // Transpile packages to avoid ERR_REQUIRE_ESM issue with jwks-rsa requiring jose
  transpilePackages: ['firebase-admin', 'jwks-rsa', 'jose'],
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      // Keep support for local/relative paths if any
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
