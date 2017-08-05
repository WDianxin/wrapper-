var path = require('path');
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
      filename:'index.html' // 这是在内存中生成的页面文件的名称
    })
  ]
}