import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
           {
            protocol: 'https',
            hostname: '*.googleusercontent.com/'
           },
           {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com'
           },
           {
            protocol: 'http',
            hostname: "res.cloudinary.com"
           }
        ]
    }
};

export default nextConfig;
