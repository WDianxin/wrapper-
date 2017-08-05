var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin'); // 导入在内存中生成HTML文件的插件

// 使用 Node中的 module.exports 导出一个 webpack 的配置对象
// 将来，当我们 直接运行 webpack 这个命令的时候，webpack会检查有没有指定要打包文件的路径，以及输出文件的路径；如果没有指定相关路径，则会默认去项目根目录中，查找一个叫做 `webpack.config.js` 的配置文件；然后得到 这个 配置文件中 导出的配置对象，拿着这个配置对象去进行打包操作；
module.exports = {
  entry: path.join(__dirname, './src/js/main.js'), // 打包的入口文件
  output: { // 配置和输出相关的一系列参数
    path: path.join(__dirname, './dist'), // 指定输出文件的路径
    filename: 'bundle.js' // 通过 filename 来指定输出文件的名称
  },
  plugins: [ // 配置插件的数组
    new htmlWebpackPlugin({ // 在内存中，根据指定的模板页面，生成一个内存中的页面，同时，能够把打包好的 bundle.js 自动注入到 生成的页面中
      template: path.join(__dirname, './src/index.html'), // 指定模板文件的路径
      filename: 'index.html' // 这是在内存中生成的页面文件的名称
    }),
    new webpack.HotModuleReplacementPlugin() // 在 插件中 启用 webpack 的热更新
  ],
  devServer: { // 设置 webpack-dev-server 命令的第二种形式
    //  --contentBase src --open --port 80 --hot
    contentBase: 'src', // 设置托管目录
    open: true, // 自动打开浏览器
    port: 80, // 指定打开的端口号
    hot: true, // 启用热更新
    openPage: 'index.html' // 设置默认打开浏览器之后，默认显示那个页面,注意： webpack-dev-server 在 v2.5.0 之后，需要设置这一项，否则打开的是 undefined 页面
  },
  module: { // 所有的第三方loader，都需要配置到这个 module 节点下
    rules: [ // 所有的第三方模块的匹配规则，都写到 rules 节点下
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 匹配处理 .css 类型文件的loader
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // 设置 处理 .scss 类型文件的loader
      { test: /\.(jpg|gif|png|bmp)$/, use: 'url-loader?limit=7631&name=[hash:7]-[name].[ext]' }, // 处理图片资源的loader模块【注意：可以通过 limit 设置多大的文件才进行编码，只有小于指定大小的文件，才会被编码】
      { test: /\.(eot|woff2|woff|ttf|svg)$/, use: 'url-loader' }, // 处理字体文件
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ } // 配置处理高级ES语法的loader
    ]
  }
}