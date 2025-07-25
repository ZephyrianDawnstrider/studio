import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
       {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p2-ofp.static.pub',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.bnn.in.th',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.msi.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'in-media.apjonlinecdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p3-ofp.static.pub',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.dell.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets3.razerzone.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kreo-tech.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

    