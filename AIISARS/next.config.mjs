/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // fixes Render warnings
  },
  output: "standalone", // allows clean production build
};

export default nextConfig;
