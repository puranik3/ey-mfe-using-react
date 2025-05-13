const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');

const devConfig = {
    mode: "development",
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 3000,
        historyApiFallback: {
            index: "/index.html",
        },
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container', // this is not necessary for the container MFE (As no one else is going to consume anything from this)
            // In 'home@http://localhost:3001/remoteEntry.js',, 'home' (RHS) is the name of the remote MFE
            // home: blahblah -> home (LHS) here is the name we assign within container in order to refer to the remote MFE -> this will be used when we import anything from home MFE (eg. import { mount from 'home/HomeApp')
            remotes: {
                home: 'home@http://localhost:3001/remoteEntry.js',
                workshops: 'workshops@http://localhost:3002/remoteEntry.js'
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