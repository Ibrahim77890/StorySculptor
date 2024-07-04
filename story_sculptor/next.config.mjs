/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "oaidalleapiprodscus.blob.core.windows.net",
            "9xlud5ryka.execute-api.ap-south-1.amazonaws.com",
            "res.cloudinary.com"
        ],
    },
};

export default nextConfig;
