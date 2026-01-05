/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 禁用 trailing slashes，避免 GitHub Pages 路由问题
  trailingSlash: true,
}

module.exports = nextConfig
