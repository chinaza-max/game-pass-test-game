/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://game-pass-ljbn.onrender.com/api/v1/:path*',
        },
      ];
    },
  };  
  
  export default nextConfig;