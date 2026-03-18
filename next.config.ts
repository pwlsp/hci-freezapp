import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    productionBrowserSourceMaps: true,
    output: "standalone",
    // turbopack: {rules: {}},
    //    webpack: (config, { dev }) => {
    //        config.optimization.minimize = false;
    //        if (!dev) {
    //        }
    //        return config;
    //    },
    reactCompiler: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
