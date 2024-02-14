/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "guia.itfip.edu.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      }
    ],
  },
}

module.exports = nextConfig
