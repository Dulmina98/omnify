import type {NextConfig} from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
    images: {
        domains: ['images.unsplash.com', 'avatar.iran.liara.run'],
    },
    webpack: (config, {isServer}) => {
        // Apply this only to client-side bundles
        if (!isServer) {
            config.plugins.push(
                new webpack.IgnorePlugin({resourceRegExp: /^pino-pretty$/})
            );
        }
        return config;
    },
};

export default nextConfig;