/** @type {import('next').NextConfig} */
const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000"

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // /backend/... in the browser goes to the FastAPI server (graphs + metrics)
  async rewrites() {
    return [{ source: "/backend/:path*", destination: `${backend}/:path*` }]
  },
}

export default nextConfig
