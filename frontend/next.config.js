/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BACKEND_SERVICE_URL: process.env.BACKEND_SERVICE_URL,
  },
};
