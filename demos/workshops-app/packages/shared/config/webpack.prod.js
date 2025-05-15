const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/shared/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'shared',
            filename: 'remoteEntry.js',
            exposes: {
                './components': './src/components/index.js',
                './contexts': './src/contexts/index.js',
                './features/themeSlice': './src/store/features/themeSlice.js',
                './store': './src/store/index.js',
                './events': './src/events/index.js',
            },
            // shared: packageJson.dependencies,
            shared: {
                ...packageJson.dependencies,
                'css-loader': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['css-loader'],
                },
                react: {
                    singleton: true,
                    requiredVersion: packageJson.dependencies.react,
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-dom'],
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: packageJson.dependencies['react-router-dom'], // or whatever version you're using
                },
            }
        }),
    ],
};

module.exports = merge(commonConfig, prodConfig);