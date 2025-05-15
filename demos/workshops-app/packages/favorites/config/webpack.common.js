const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|woff|svg|eot|ttf)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss$/,
        oneOf: [
          // this matches <style module lang="scss">
          {
            resourceQuery: /module/,
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  esModule: false
                }
              },
              'sass-loader'
            ]
          },
          // this matches plain <style lang="scss"> or SCSS imported in JS
          {
            use: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false
                }
              },
              'sass-loader'
            ]
          }
        ]
      }
    ],
  },
  plugins: [new VueLoaderPlugin()],
};