const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageJson = require('../package.json');

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:3001/",
    },
    devServer: {
        port: 3001,
        historyApiFallback: {
            index: "/index.html",
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'home', // unique name for the MFE
            filename: 'remoteEntry.js',
            exposes: {
                './HomeApp': './src/bootstrap.js'
            },
            // NOTE: Share third-party modules between MFEs when possible
            shared: packageJson.dependencies
        }),

        // NOTE: we do not need index.html in production, as the home app is not independently deployed in production
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ]
};

module.exports = merge(commonConfig, devConfig);