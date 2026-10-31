/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const devOrigins = (process.env.NEXT_DEV_ORIGINS ?? '192.168.1.4,*.local')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  allowedDevOrigins: devOrigins,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
