/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "oaidalleapiprodscus.blob.core.windows.net",
            "9xlud5ryka.execute-api.ap-south-1.amazonaws.com",
        ],
    },
    remotePatterns: [
        {
            protocol: "data",
            hostname: "",
        },
    ],
    i18n: {
        locales: ["en", "it"],
        defaultLocale: "en",
      },
};

export default nextConfig;
