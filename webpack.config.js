/**
 * @author https://github.com/daviscai
 * @date 2017/08/13
 * @description weex 打包配置
 * webpack 1 upgrade to webpack 2  https://doc.webpack-china.org/guides/migrating/
 */

const path = require('path')
const webpack = require('webpack')
const copy = require('copy-webpack-plugin')
const utils = require('./build/utils')

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const bannerPlugin = new webpack.BannerPlugin({
  banner: '// { "framework": "Vue" }\n',
  raw: true,
  exclude: /.css/
})

//  文件拷贝插件,将图片和字体拷贝到dist目录
var copyPlugin = new copy([
    {from: './web/fonts', to: "./fonts"}
])

function getBaseConfig () {
  return {
    entry: {
      'index': path.resolve('src', 'entry.js')
    },
    output: {
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }, {
          test: /\.vue(\?[^?]+)?$/,
          loaders: []
        },
        {
          test: /\.vue$/,
          loader: 'eslint-loader',
          enforce: "pre",
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          enforce: "pre",
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          loader: ['sass-loader','css-loader']
        },
        {
          test: /\.less$/,
          // loader: 'less-loader',
          use: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: ['less-loader','css-loader']
          })
        }
      ] // .concat(utils.styleLoaders({extract: true})) 
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }}),
      new ExtractTextPlugin({
        filename: 'theme.css'
        // filename: (getPath) => {
        //   return getPath('src/components/style/[name].css').replace('src/components/style', 'css');
        // }
      }),
      bannerPlugin,
      copyPlugin,
    ]
  }
}

var webConfig = getBaseConfig()
webConfig.output.filename = '[name].web.js'
webConfig.module.rules[1].loaders.push('vue-loader')

var nativeConfig = getBaseConfig()
nativeConfig.output.filename = '[name].weex.js'
nativeConfig.module.rules[1].loaders.push('weex-loader')

module.exports = [webConfig, nativeConfig] 