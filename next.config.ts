const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "" : "",
  assetPrefix: isProd ? "" : "",
};
