/** @type {import('next').NextConfig} */
const nextConfig = {
    //supported image formats
    images: {
        domains: ['tailwindui.com'],
    },
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/home/hero',
                permanent: true,
            },

        ]
    },
};

export default nextConfig;
