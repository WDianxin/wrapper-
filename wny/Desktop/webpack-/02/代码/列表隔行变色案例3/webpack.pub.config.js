var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin'); // 导入在内存中生成HTML文件的插件
var cleanWebpackPlugin = require('clean-webpack-plugin'); // 导入删除目录的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 导入抽取CSS样式的插件
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 导入压缩优化CSS文件的插件

// 使用 Node中的 module.exports 导出一个 webpack 的配置对象
// 将来，当我们 直接运行 webpack 这个命令的时候，webpack会检查有没有指定要打包文件的路径，以及输出文件的路径；如果没有指定相关路径，则会默认去项目根目录中，查找一个叫做 `webpack.config.js` 的配置文件；然后得到 这个 配置文件中 导出的配置对象，拿着这个配置对象去进行打包操作；
module.exports = {
  entry: {
    app: path.join(__dirname, './src/js/main.js'), // 入口文件
    vendors: ['jquery'] // 要分离出来的第三方包
  }, // 打包的入口文件
  output: { // 配置和输出相关的一系列参数
    path: path.join(__dirname, './dist'), // 指定输出文件的路径
    filename: 'js/bundle.js' // 通过 filename 来指定输出文件的名称
  },
  plugins: [ // 配置插件的数组
    new htmlWebpackPlugin({ // 在内存中，根据指定的模板页面，生成一个内存中的页面，同时，能够把打包好的 bundle.js 自动注入到 生成的页面中
      template: path.join(__dirname, './src/index.html'), // 指定模板文件的路径
      filename: 'index.html', // 这是在内存中生成的页面文件的名称
      minify: { // 压缩选项
        collapseWhitespace: true, // 合并空白字符
        removeComments: true, // 移除注释
        removeAttributeQuotes: true, // 移除 属性中的引号
        // removeEmptyElements: true // 移除 空白的元素  【这是过度优化，不推荐】
      }
    }),
    new cleanWebpackPlugin(['dist']), // 每次发布之前，先删除 dist 目录
    new webpack.optimize.CommonsChunkPlugin({// 抽离第三方包的插件
      name: 'vendors', // 指定抽离的入口
      filename: 'js/vendors.js' // 抽离出来的第三方包的名称
    }),
    new webpack.optimize.UglifyJsPlugin({ // 压缩优化JS
      compress: {
        warnings: false, // 移除警告
        drop_console: true // 移除所有的 console
      }
    }),
    new webpack.DefinePlugin({ // 定义 当前的 发布环境为 上线发布
      'process.env.NODE_ENV': '"production"',
    }),
    new ExtractTextPlugin("css/styles.css"), // 将CSS样式单独抽取出来
    new OptimizeCssAssetsPlugin() // 压缩优化CSS文件
  ],
  module: { // 所有的第三方loader，都需要配置到这个 module 节点下
    rules: [ // 所有的第三方模块的匹配规则，都写到 rules 节点下
      {
        test: /\.css$/, use: ExtractTextPlugin.extract({ // 抽取CSS样式
          fallback: "style-loader",
          use: "css-loader",
          publicPath:'../'
        })
      }, // 匹配处理 .css 类型文件的loader
      {
        test: /\.scss$/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
          publicPath:'../'
        })
      }, // 设置 处理 .scss 类型文件的loader
      // { test: /\.(jpg|gif|png|bmp)$/, use: 'url-loader?limit=7631&name=images/[hash:7]-[name].[ext]&publicPath=../' }, // 处理图片资源的loader模块【注意：可以通过 limit 设置多大的文件才进行编码，只有小于指定大小的文件，才会被编码】
      { test: /\.(jpg|gif|png|bmp)$/, use: 'url-loader?limit=7631&name=images/[hash:7]-[name].[ext]' }, // 处理图片资源的loader模块【注意：可以通过 limit 设置多大的文件才进行编码，只有小于指定大小的文件，才会被编码】
      
      { test: /\.(eot|woff2|woff|ttf|svg)$/, use: 'url-loader' }, // 处理字体文件
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ } // 配置处理高级ES语法的loader
    ]
  }
}