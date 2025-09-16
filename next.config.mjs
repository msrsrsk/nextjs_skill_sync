/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.microcms-assets.io',
            },
            {
                protocol: 'https',
                hostname: process.env.SUPABASE_URL?.replace('https://', '').replace('http://', '') || '',
            },
            {
                protocol: 'https',
                hostname: '*.r2.cloudflarestorage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
