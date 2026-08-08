/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The source artwork is heavyweight PNG line art; serve modern formats.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
