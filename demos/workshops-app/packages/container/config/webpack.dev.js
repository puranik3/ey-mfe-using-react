const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

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
};

module.exports = merge(commonConfig, devConfig);