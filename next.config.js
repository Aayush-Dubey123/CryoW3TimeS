/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'bitcoinmagazine.com',
      'cdn-icons-png.flaticon.com',
      'www.newsbtc.com',
      'cryptopotato.com',
      'pbs.twimg.com',
      'i.ytimg.com',
      'gnews.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ]
  }
};

module.exports = nextConfig;