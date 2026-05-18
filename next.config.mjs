/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "mnldlktwersyibflbnlj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "qxigdkunffvdbrsyyzej.supabase.co",
      },
    ],
  },
};

export default nextConfig;
