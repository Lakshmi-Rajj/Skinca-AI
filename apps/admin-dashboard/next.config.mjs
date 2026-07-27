/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@platform/ui-components', '@platform/api-contracts'],
};

export default nextConfig;
