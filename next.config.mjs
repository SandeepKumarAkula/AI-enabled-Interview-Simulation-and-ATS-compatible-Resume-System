/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Next.js dev overlay (the black N button and related UI)
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Explicitly set workspace root to prevent Turbopack errors from conflicting lockfiles
  // turbopack: {
  //   root: '.',
  // },
}

export default nextConfig
