/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/grok-task',
  assetPrefix: '/grok-task',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
