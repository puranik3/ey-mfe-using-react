const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:3002/",
    },
    devServer: {
        port: 3002,
        historyApiFallback: {
            index: "/index.html",
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'workshops',
            filename: 'remoteEntry.js',
            remotes: {
                shared: 'shared@http://localhost:3003/remoteEntry.js',
            },
            exposes: {
                './WorkshopsApp': './src/bootstrap.js'
            },
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
    ],
};

module.exports = merge(commonConfig, devConfig);