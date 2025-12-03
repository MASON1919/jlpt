import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 구글 프로필 이미지 도메인
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
