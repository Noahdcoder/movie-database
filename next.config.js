/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ["image.tmdb.org"],
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
  nextConfig,
};
