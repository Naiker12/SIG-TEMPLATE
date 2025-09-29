
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        '*.cluster-zhw3w37rxzgkutusbbhib6qhra.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
