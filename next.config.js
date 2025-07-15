/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  turbopack: {
    // You can keep your Turbopack settings here
  },
  images: {
    domains: ['vnwtkjaxzidkpnglheqp.supabase.co'], // ✅ Supabase storage domain
  },
};

module.exports = nextConfig;
