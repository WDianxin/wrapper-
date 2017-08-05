## 移动App第2天
使用前先      npm   i
## 在网页中会引用哪些常见的静态资源？
1. 图片
 + .png, .jpg, .gif, .bmp
2. 字体
 + .svg, .ttf, .woff, .woff2, .eot
3. CSS
 + .css, .less, .scss
4. JS
 + .js, .json, .coffee
5. 模板文件
 + .vue, .jade


## 网页中这些常见的资源多了以后会出现什么问题
1. 在一个页面中，会引用各种各样的静态资源文件，会导致发起很多的二次请求，导致网页显示效率变慢；
2. 需要人为去解决文件之间复杂的依赖关系；


## 如何解决上述两个问题
1. 图片：使用精灵图；base64
2. CSS：合并；压缩混淆
3. JS：合并；压缩混淆


## 如何完美实现上述的三种解决方案
+ 使用 Gulp 去实现上述三种解决方案；
+ 根据官网的图片介绍webpack打包的过程
+ [webpack官网](http://webpack.github.io/)

>注意:Gulp是站在任务的角度去思考问题的；
>WebPack适合站在项目的角度，去统筹整个项目的构建；

## webpack安装的两种方式
了解：Webpack只是一个工具；是基于Node.js构建出来的；所以，webpack是托管到了NPM；
1. 全局安装：`npm i -g webpack`
2. 在项目中安装：`npm i webpack -D`


## 初步使用webpack打包构建列表隔行变色案例
使用`webpack 需要打包的文件路径 输入的文件路径`方式，进行最基本的打包；
注意：这种方式，调用的是全局安装的 webpack


## 使用webpack的配置文件简化打包时候的命令
```
var path = require('path');

// 使用 Node中的 module.exports 导出一个 webpack 的配置对象
// 将来，当我们 直接运行 webpack 这个命令的时候，webpack会检查有没有指定要打包文件的路径，以及输出文件的路径；如果没有指定相关路径，则会默认去项目根目录中，查找一个叫做 `webpack.config.js` 的配置文件；然后得到 这个 配置文件中 导出的配置对象，拿着这个配置对象去进行打包操作；
module.exports = {
  entry: path.join(__dirname, './src/js/main.js'), // 打包的入口文件
  output: { // 配置和输出相关的一系列参数
    path: path.join(__dirname, './dist'), // 指定输出文件的路径
    filename: 'bundle.js' // 通过 filename 来指定输出文件的名称
  }
}
```


## 实现webpack的实时打包构建
需求：由于在实际开发中，会经常修改代码，需要时时查看最新的代码效果，所以，我们最好能够实现`只要代码以修改，自动进行打包`!为了实现这个需求，我们需要借助一个叫做`webpack-dev-server`的插件；
注意：由于 `webpack-dev-server` 内部封装了 `webpack`， 所以，它的使用方式，和webpack几乎一样！
1. 运行`npm i webpack-dev-server -D`安装插件

> 注意：webpack-dev-server 帮我们生成出来的 bundle.js 并没有存放到实际的磁盘目录中；而是帮我们托管到了内存中；
> 为什么不放到磁盘中,而是托管到了内存呢? 快!!!


## 使用`html-webpack-plugin`插件配置启动页面


## 实现自动打开浏览器、热更新和配置浏览器的默认端口号
**注意：热更新在JS中表现的不明显，可以从一会儿要讲到的CSS身上进行介绍说明！**
### 方式1：
直接在`package.json`的`scripts`节点下设置:
```
"dev1": "webpack-dev-server --contentBase src --open --port 80 --hot"
```

### 方式2：
在 `webpack.config.js`中添加一个新节点:
```
devServer: { // 设置 webpack-dev-server 命令的第二种形式
    //  --contentBase src --open --port 80 --hot
    contentBase: 'src', // 设置托管目录
    open: true, // 自动打开浏览器
    port: 80, // 指定打开的端口号
    hot: true, // 启用热更新
    openPage: 'index.html' // 设置默认打开浏览器之后，默认显示那个页面,注意： webpack-dev-server 在 v2.5.0 之后，需要设置这一项，否则打开的是 undefined 页面
  }
```
还需要添加一个新的插件,启用热更新:
```
new webpack.HotModuleReplacementPlugin() // 在 插件中 启用 webpack 的热更新
```

## webpack中loader的加载原理

## 使用webpack打包css文件
1. 运行`npm i style-loader css-loader -D`
2. 在`webpack.config.js`的`module`节点下的`rules`节点中,添加一个新的loader配置项:
```
module: { // 所有的第三方loader，都需要配置到这个 module 节点下
    rules: [ // 所有的第三方模块的匹配规则，都写到 rules 节点下
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 匹配处理 .css 类型文件的loader
    ]
  }
```


## 使用webpack打包sass文件
1. 运行`cnpm i sass-loader node-sass -D`
2. 添加相关loader:
```
{ test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] } // 设置 处理 .scss 类型文件的loader
```


## 使用webpack处理css中的路径
1. 运行`npm i url-loader file-loader -D`
2. 添加相关loader:
```
{ test: /\.(jpg|gif|png|bmp)$/, use: 'url-loader?limit=7631&name=[hash:7]-[name].[ext]' }, // 处理图片资源的loader模块【注意：可以通过 limit 设置多大的文件才进行编码，只有小于指定大小的文件，才会被编码】
      { test: /\.(eot|woff2|woff|ttf|svg)$/, use: 'url-loader' } // 处理字体文件
```


## 使用babel处理高级JS语法
1. 由于`webpack`默认会转换一部分的高级的ES6语法,但是并不能转换全部的;
2. 因此需要借助于Babel这个转换器,把高级的语法转换为低级别的,浏览器能识别的语法!
3. 运行第一套命令:`npm i babel-core babel-loader babel-plugin-transform-runtime -D`
4. 运行第二套命令:`npm i babel-preset-es2015 babel-preset-stage-0 -D`
5. 配置loader,在rules中添加一个新的loader配置项:
```
{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ } // 配置处理高级ES语法的loader
```
3. 在项目根目录中创建一个`.babelrc`的一个Babel配置文件:
```
{
  "presets": ["es2015", "stage-0"],
  "plugins": ["transform-runtime"]
}
```


## webpack的发布策略
1. 在实际开发中，一般会有两套项目方案：
 + 一套是开发期间的项目，包含了测试文件、测试数据、开发工具、测试工具等相关配置，有利于项目的开发和测试，但是这些文件仅用于开发，发布项目时候需要剔除；
 + 另一套是部署期间的项目，剔除了那些客户用不到的测试数据测试工具和文件，比较纯净，减少了项目发布后的体积，有利于安装和部署！
2. 为了满足我们的发布策略，需要新建一个配置文件，命名为`webpack.publish.config.js`，将`webpack.config.js`的配置拷贝过去，剔除一些开发配置项即可：
 + 将`devServer`节点删掉：
 ```
 devServer: {
        hot: true,
        open: true,
        port: 4321
    }
 ```
 + 将`plugins`节点下的热更新插件删掉：
 ```
 new webpack.HotModuleReplacementPlugin()
 ```
3. 修改`url-loader`，将图片放入统一的images文件夹之下：
```
{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43959&name=images/[name].[ext]' }
```
或者使用`img-`前缀加上`7位的hash名称`：
```
{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=43959&name=images/img-[hash:7].[ext]' }
```
4. 在`package.json`中的script节点下新增`dev`命令，通过`--config`指定webpack启动时要读取的配置文件：
```
"pub": "webpack --config webpack.publish.config.js"
```

## 每次重新构建时候删除dist目录
1. 运行`cnpm i clean-webpack-plugin --save-dev`
2. 在头部引入这个插件：
```
var cleanWebpackPlugin = require('clean-webpack-plugin');
```
3. 在`plugins`节点下使用这个插件：
```
new cleanWebpackPlugin(['dist'])
```

## 分离第三方包改造`webpack.publish.config.js`
1. 改造entry节点如下：
```
entry: {
        app: path.resolve(__dirname, 'src/js/main.js'), // 自己代码的入口
        vendors: ['jquery'] // 要分离的第三方包的入口
    }
```
2. 在plugins节点下新增插件：
```
new webpack.optimize.CommonsChunkPlugin({ // 抽离第三方包的插件
        name:'vendors', // 指定抽离第三方包的入口名称
        filename:'vendors.js' // 抽离出的公共模块的名称
})
```
3. `html-webpack-plugin`在生成`index.html`文件的时候，会自动将抽离的第三方包引入进去！

## [优化压缩JS](https://webpack.js.org/configuration/plugins/#plugins)
在plugins数组中添加：
```
new webpack.optimize.UglifyJsPlugin({ // 优化压缩JS
    compress:{
        warnings:false // 移除警告
    }
}),
new webpack.DefinePlugin({ // 设置为产品上线环境，进一步压缩JS代码
    'process.env.NODE_ENV': '"production"'
})
```

## 优化压缩HTML文件
在`plugins`节点下的`htmlWebpackPlugin`插件中，添加`minify`子节点：
```
minify:{// 压缩HTML代码
    collapseWhitespace:true, // 合并空白字符
    removeComments:true, // 移除注释
    removeAttributeQuotes:true // 移除属性上的引号
}
```
其他优化项请参考：[html-minifier - github](https://github.com/kangax/html-minifier#options-quick-reference)

## [抽取CSS文件](https://github.com/webpack-contrib/extract-text-webpack-plugin)
1. 运行`npm install --save-dev extract-text-webpack-plugin`安装抽取CSS文件的插件。
2. 在配置文件中导入插件：
```
const ExtractTextPlugin = require("extract-text-webpack-plugin");
```
3. 修改CSS和Sass的loader如下：
```
{
    test: /\.css$/, use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ["css-loader"],
        publicPath: '../' // 设置图片路径
    })
},
{
    test: /\.scss$/, use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader', 'sass-loader'],
        publicPath: '../' // 设置图片路径
    })
}
```
4. 在plugins节点下新增插件：
```
new ExtractTextPlugin("css/styles.css"), // 抽取CSS文件的插件
```

## [压缩抽取出来的CSS文件](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
1. 运行`cnpm i optimize-css-assets-webpack-plugin --save-dev`安装插件到开发依赖。
2. 在配置文件头部导入插件：
```
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```
3. 在plugins节点下新增插件：
```
 new OptimizeCssAssetsPlugin() // 压缩CSS文件的插件
```

## 相关文章
1. [Sass 基础教程](http://www.sasschina.com/guide/)
2. [webpack-dev-server](https://github.com/webpack/webpack-dev-server/releases)
3. [You have not accepted the license agreements of the following ](http://majing.io/questions/804)