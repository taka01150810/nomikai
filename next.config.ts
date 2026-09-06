import type { NextConfig } from "next";

// GitHub Pages のプロジェクトページ（https://<user>.github.io/nomikai/）に
// 載せるための設定。カスタムドメインを当てる場合は basePath を外す。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // サーバーを持たない静的書き出し。out/ に HTML が生成される。
  output: "export",
  basePath,
  // static export では Next の画像最適化サーバーが使えない。
  images: { unoptimized: true },
  // /about → /about/index.html にして Pages のパス解決に合わせる。
  trailingSlash: true,
};

export default nextConfig;
