const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        publicPath: '/workshops/latest/',
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'workshops',
            filename: 'remoteEntry.js',
            remotes: {
                shared: `shared@${domain}/shared/latest/remoteEntry.js`,
            },
            exposes: {
                './WorkshopsApp': './src/bootstrap',
                './WorkshopsAppComponent': './src/App',
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