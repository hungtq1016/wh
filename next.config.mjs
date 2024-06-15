/** @type {import('next').NextConfig} */
const nextConfig = {
    //supported image formats
    images: {
        domains: ['tailwindui.com','ooy4b0bespx7vwie.public.blob.vercel-storage.com'],
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
