import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
   images: {
      domains: ["www.zimssa.com", "i.imgur.com"], // 외부 이미지 호스트 허용
      remotePatterns: [
         // next/image가 외부 s3 이미지 url을 허용하도록
         {
            protocol: "https",
            hostname: "moving-s3-bucket.s3.ap-northeast-2.amazonaws.com",
            pathname: "/**", // 모든 경로 허용
         },
      ],
   },
   webpack(config) {
      config.module.rules.push({
         test: /\.json$/,
         type: "json",
      });
      return config;
   },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
