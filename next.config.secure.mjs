/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Security: Only allow images from trusted sources
    domains: ['localhost', 'yourdomain.com'],
  },
  
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            // Set the strict default here; middleware may relax this for specific pages like /ai-interview.
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; 
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; 
                    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
                    img-src 'self' data: https:; 
                    font-src 'self' https://fonts.gstatic.com; 
                    connect-src 'self' https: wss:; 
                    frame-ancestors 'none'; 
                    base-uri 'self'; 
                    form-action 'self'; 
                    upgrade-insecure-requests`,
          },
        ],
      },
    ]
  },

  // Security redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },

  // Rewrites for API security
  async rewrites() {
    return {
      beforeFiles: [
        // Add security rewrites here
      ],
    }
  },

  // Environment variables - only expose safe ones to client
  env: {
    // Only public variables should be here
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },

  // Disable dev indicators in production
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },

  // Optimize performance and security
  swcMinify: true,
  compress: true,

  // Prevent MIME sniffing
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Experimental features for better security
  experimental: {
    // Enable secure headers validation
  },
}

export default nextConfig
