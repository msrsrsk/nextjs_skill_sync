/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        clientSegmentCache: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.microcms-assets.io',
            },
            {
                protocol: 'https',
                hostname: '*.r2.cloudflarestorage.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.skill-sync.site',
                port: '',
                pathname: '/**',
            },
        ].filter(pattern => pattern.hostname && pattern.hostname.trim() !== ''),
    },
};

export default nextConfig;