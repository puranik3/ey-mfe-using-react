const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageJson = require('../package.json');

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:3003/",
    },
    devServer: {
        port: 3003,
        historyApiFallback: {
            index: "/index.html",
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'shared', // unique name for the MFE
            filename: 'remoteEntry.js',
            exposes: {
                './components': './src/components/index.js',
                './contexts': './src/contexts/index.js',
            },
            // NOTE: Share third-party modules between MFEs when possible
            shared: {
                ...packageJson.dependencies,
                react: {
                    singleton: true,
                    requiredVersion: '^19.1.0',
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '^19.1.0',
                },
                'react-router-dom': {
                    singleton: true,
                    requiredVersion: '^7.6.0',
                },
            }
        }),

        // NOTE: we do not need index.html in production, as the home app is not independently deployed in production
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ]
};

module.exports = merge(commonConfig, devConfig);