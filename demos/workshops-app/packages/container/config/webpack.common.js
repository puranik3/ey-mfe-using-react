module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    plugins: [
        // injects generated JS files (bundles) into the index.html file
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
};