// 1、实现根据用户不同请求响应不同的html文件
// 2、封装 render 函数
// 3、将 render 函数挂在到 res 对象上
// 4、将请求静态资源，就是以 /resources 开头的，也封装到 render 中
// 5、处理 /submit 页面中的 get 提交
// 6、把 get 提交过来的数据追加到 data.json中


// 加载模块
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

// 加载 url 模块，该模块的作用就是把用户请求字符串（查询字符串），转换成更容易使用的json对象
var url = require('url');


// 创建服务
var server = http.createServer(function (req, res) {
  

  // 通过 url 模块进行 req.url 解析
  // 第二个参数，如果是 true， 那么解析完毕的 url 对象中 query 属性也会是一个json对象
  var urlObj = url.parse(req.url.toLowerCase(), true);
  // console.log(urlObj);

  // 1. 获取用户请求的路径
  // var reqUrl = req.url.toLowerCase();
  // url对象的 pathname 属性，表示不包含所有查询字符串的路径
  var reqUrl = urlObj.pathname;

  // 获取请求方法
  var method = req.method.toLowerCase();



  // 处理用户请求 /favicon.ico 的问题
  reqUrl = (reqUrl === '/favicon.ico') ? '/resources/images/y18.gif' : reqUrl;

  // 为 res 对象挂载一个 render 函数
  mountRenderForResponse(res);

  // 2. 根据不同请求做出不同处理
  if ((reqUrl === '/' || reqUrl === '/index') && method === 'get') {
    // 返回 `views/index.html` 文件内容
    // render(path.join(__dirname, 'views', 'index.html'), res);

    res.render(path.join(__dirname, 'views', 'index.html'));
    

  } else if (reqUrl === '/details' && method === 'get') {
    // 返回 `views/details.html` 文件内容
    // render(path.join(__dirname, 'views', 'details.html'), res);

    res.render(path.join(__dirname, 'views', 'details.html'));

  } else if (reqUrl === '/submit' && method === 'get') {
    // 返回 `views/submit.html` 文件内容
    // render(path.join(__dirname, 'views', 'submit.html'), res);

    res.render(path.join(__dirname, 'views', 'submit.html'));

  } else if (reqUrl === '/r' && method === 'get') {
    // 表示通过 get 请求来提交数据
    // 获取用户通过 get 方式提交过来的数据, 并且把这些数据保存到一个 json文件中

    // 1. 读取 data.json 文件，并将其转换为 list 数组
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      
      // 先创建一个 list
      var list;

      if (err) {
        // 当出错以后，判断是否是文件不存在的错误，如果是文件不存在的错误，那么 list = [];
        if (err.code === 'ENOENT') {
          list = [];
        } else {
          throw err;
        }
      }

      // 需要把读取到的 data 转换为 list 数组
      list = JSON.parse(data) || [];


      // 将提交的数据保存到数组中
      list.push(urlObj.query);

      // 把 json 数组转换为一个字符串
      // JSON.stringify(list)

      // 把 list 中的数据写到文件中
      fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err) {
        if (err) {
          // 如果写入出错，抛出异常
          throw err;
        }

        // 如果新闻提交成功了，那么将页面重定向到 /index
        // 直接让服务器向浏览器发送一个重定向的 http 响应报文即可
        res.writeHead(301, 'Moved Permanently', {
          'Location': '/index'
        });

        // 每次请求服务器必须调用 end() 来结束请求
        res.end();

      });

    });



    





  } else if (reqUrl === '/r' && method === 'post') {
    // 表示通过 post 请求来提交数据
    // 获取用户通过 post 方式提交过来的数据, 并且把这些数据保存到一个 json文件中


  } else if (reqUrl.startsWith('/resources')) {

    // 如果请求的是以 /resources 开头, 那么就把这个请求当做静态资源来处理
    res.render(path.join(__dirname, reqUrl));
  }

  // else {
  //   // 都认为是请求不存在的页面
  //   res.statusCode = 404;
  //   res.
  // }



});


// 开启服务
server.listen(9090, function () {
  console.log('http://localhost:9090');
});





// // 封装一个 render 函数

// function render(filename, res) {

//   fs.readFile(filename, function (err, data) {
//     if (err) {
//       throw err;
//     }

//     // 设置响应报文信息
//     res.statusCode = 200;
//     res.statusMessage = 'OK';
//     res.setHeader('Content-Type', 'text/html;charset=utf-8');

//     // 向浏览器响应内容，并结束响应
//     res.end(data);
//   });
// }




function mountRenderForResponse(res) {


  res.render = function (filename) {


    fs.readFile(filename, function (err, data) {
      if (err) {

        if (err.code === 'ENOENT') {
          // 表示请求的文件不存在
          res.statusCode = 404;
          res.statusMessage = 'Not Found';
          res.setHeader('Content-Type', 'text/html;charset=utf-8');
          res.end('<h1>404</h1>');
          return;
        }

        throw err;
      }

      // 设置响应报文信息
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.setHeader('Content-Type', mime.lookup(filename));

      // 向浏览器响应内容，并结束响应
      res.end(data);
    });
  };
}