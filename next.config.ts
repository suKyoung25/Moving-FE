import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
   images: {
      domains: ["www.zimssa.com", "i.imgur.com"], // 외부 이미지 호스트 허용
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
