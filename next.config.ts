import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ['www.zimssa.com'], // ✅ 여기에 허용할 외부 이미지 호스트 추가
  },
};

export default nextConfig;
