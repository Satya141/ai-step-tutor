import type { NextConfig } from "next";

// Inject server-only env so App Router API routes can read the key even if
// workspace root detection is off during local dev.
const nextConfig: NextConfig = {
  env: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  },
};

export default nextConfig;
