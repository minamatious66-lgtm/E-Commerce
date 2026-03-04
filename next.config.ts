import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns:[
     {
       protocol: "https",
       hostname: "ecommerce.routemisr.com",
       pathname: "/Route-Academy-*/**",
     },
     {
       protocol: "https",
       hostname: "res.cloudinary.com",
       pathname: "/**",
     },
    ]
   },
};

export default nextConfig;
