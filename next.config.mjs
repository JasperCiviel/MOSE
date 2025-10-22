import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp']
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname);
    return config;
  }
};

export default nextConfig;
