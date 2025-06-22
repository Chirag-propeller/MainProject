import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true, // ✅ Let the build succeed even with eslint issues
  },
  /* config options here */
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // ✅ Let the build succeed even with eslint issues
//   },
  
//   // Remove console logs in production
//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },
  
//   // Reduce build memory usage
//   experimental: {
//     craCompat: true,
//   },
  
//   // Webpack optimizations for smaller bundles
//   webpack: (config, { dev, isServer }) => {
//     // Reduce memory usage during build
//     if (!dev && !isServer) {
//       config.optimization.splitChunks = {
//         chunks: 'all',
//         minSize: 20000,
//         maxSize: 200000, // Smaller max size for chunks
//         cacheGroups: {
//           default: false,
//           vendors: false,
//           // Create smaller framework chunk
//           framework: {
//             chunks: 'all',
//             name: 'framework',
//             test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
//             priority: 40,
//             enforce: true,
//           },
//           // Split large libraries
//           lib: {
//             test: /[\\/]node_modules[\\/]/,
//             name: 'vendors',
//             priority: 30,
//             chunks: 'all',
//           },
//         },
//       };
//     }
    
//     return config;
//   },
  
//   // Image optimization settings
//   images: {
//     formats: ['image/webp', 'image/avif'],
//     minimumCacheTTL: 60,
//   },
// };

// export default nextConfig;