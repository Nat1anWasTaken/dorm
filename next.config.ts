import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    domains: [
      "i.imgur.com", // 如果還有用到 imgur
      "meee.com.tw", // 主網域
      "i.meee.com.tw", // 子網域 (從錯誤訊息看到的)
    ],
    // 如果未來可能還會有其他子網域，可以用這個替代：
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**.meee.com.tw",
    //   },
    // ],
  },
};

export default nextConfig;
