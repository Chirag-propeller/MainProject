// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {

//   eslint: {
//     ignoreDuringBuilds: true, // ✅ Let the build succeed even with eslint issues
//   },
//   /* config options here */
// };

// export default nextConfig;




import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Let the build succeed even with eslint issues
  },
  
  // Optimize for smaller bundle size
  output: 'standalone',
  
  // Reduce build memory usage
  experimental: {
    craCompat: true,
    outputFileTracingRoot: path.join(process.cwd(), '../../'),
  },
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Reduce memory usage during build
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Create smaller, more specific chunks
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module: any) {
                return (
                  module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier())
                );
              },
              name: (module: any) => {
                const hash = require('crypto')
                  .createHash('sha1')
                  .update(module.identifier())
                  .digest('hex')
                  .substring(0, 8);
                return `lib-${hash}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        },
      };
    }
    
    // Exclude large dependencies from server bundle if not needed
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'sharp': 'sharp',
        'aws-sdk': 'aws-sdk',
      });
    }
    
    return config;
  },
  
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;