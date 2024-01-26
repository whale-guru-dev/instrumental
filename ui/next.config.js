const path = require('path');
const withImages = require("next-images");

module.exports = 
// withImages(
{
  reactStrictMode: true,
  inlineImageLimit: false,
  images: {
    // loader can be 'default', 'imgix', 'cloudinary', 'akamai', or 'custom'
    loader: 'default',
    // disable static imports for image files
    disableStaticImages: false,
    domains: [
      // This is to whitelist the images domain within the next.config.js
      "s3.eu-central-1.amazonaws.com", // This is used internally for loading token assets. It's not used for anything else.
      "cdn.moralis.io", // This is used for loading images through Moralis API.
    ],
  },
  env: {
    RELAYER_API_URL: process.env.RELAYER_API_URL,
    NFT_API_URL: process.env.NFT_API_URL,
    ANALYTICS_API_URL: process.env.ANALYTICS_API_URL,
    RELAYER_WS_URL: process.env.RELAYER_WS_URL,
    NFT_WS_URL: process.env.NFT_WS_URL,
    RPC_URL_1: process.env.RPC_URL_1,
    RPC_URL_42161: process.env.RPC_URL_42161,
    RPC_URL_137: process.env.RPC_URL_137,
    RPC_URL_3: process.env.RPC_URL_3,
    RPC_URL_80001: process.env.RPC_URL_80001,
    RPC_URL_421611: process.env.RPC_URL_421611,
    RPC_URL_43114: process.env.RPC_URL_43114,
    RPC_URL_1285: process.env.RPC_URL_1285,
    RPC_URL_250: process.env.RPC_URL_250,
    RPC_URL_4: process.env.RPC_URL_4,
    RPC_URL_42: process.env.RPC_URL_42,
    TRANSFERS_API_URL: process.env.TRANSFERS_API_URL,
    PRICE_FEED_API_URL: process.env.PRICE_FEED_API_URL,
    MORALIS_API_KEY: process.env.MORALIS_API_KEY,
  },
  // exclude: path.resolve(__dirname, 'assets'),
  // webpack(config) {
  //   return config
  // }
  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: ['@svgr/webpack'],
  //   })

  //   return config
  // }
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        // test: /\.(js|ts)x?$/,
       // for webpack 5 use
       and: [/\.(js|ts)x?$/]
      },
      // use: ["@svgr/webpack"],
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: { plugins: [{ removeViewBox: false }] },
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
}
// );
