import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore the copilotkit_reference folder during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/copilotkit_reference/**', '**/node_modules/**'],
    };
    
    return config;
  },
};

export default nextConfig;
