/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Images are pre-optimized to WebP by scripts/optimize-images.js, so the
  // runtime optimizer would only add cost.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        // Hashed/derived asset names never change contents, so cache hard.
        source: '/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
    ];
  },
};

export default nextConfig;
