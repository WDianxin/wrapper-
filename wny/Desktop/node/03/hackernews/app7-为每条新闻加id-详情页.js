// 1、实现根据用户不同请求响应不同的html文件
// 2、封装 render 函数
// 3、将 render 函数挂在到 res 对象上
// 4、将请求静态资源，就是以 /resources 开头的，也封装到 render 中
// 5、处理 /submit 页面中的 get 提交
// 6、把 get 提交过来的数据追加到 data.json中
// 7、获取 post 提交的数据
// 8、渲染 index 页面
// 9、添加新闻的时候为每条新闻添加id，同时实现详情页


// 加载模块
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var _ = require('underscore');
// 加载 url 模块，该模块的作用就是把用户请求字符串（查询字符串），转换成更容易使用的json对象
var url = require('url');
// 加载 querystring 模块, 该模块的作用就是把请求的查询字符串转换为 json 对象
var querystring = require('querystring');




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

    // 1. 读取 data.json 中的数据
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      // 把 data 转换为数组
      var list = JSON.parse(data);

      // 2. 通过模板引擎渲染 index.html 文件
      // 返回 `views/index.html` 文件内容
      res.render(path.join(__dirname, 'views', 'index.html'), {title: "Hacker News List", items: list});
    });

  } else if (reqUrl === '/details' && method === 'get') {

    // 1. 获取用户传递过来的 id 
    // urlObj.query.id 

    // 2. 读取 data.json 文件, 并转换为数组，从该数组中，判断 id === urlObj.query.id 的
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      if (err) {
        throw err;
      }

      // 把 data.json 中读取到的数据转换为 json 对象
      var list = JSON.parse(data);

      // 声明一个变量，用来基础查找到的对象
      var model;
      // 循环判断 list 中的每个对象，找到对象 id 等于 urlObj.query.id的
      for (var i = 0; i < list.length; i++) {
        if (parseInt(list[i].id) === parseInt(urlObj.query.id)) {
          model = list[i];
          break;
        }
      }

      if (model) {
        // 通过模板引擎,渲染 details 页面
        res.render(path.join(__dirname, 'views', 'details.html'), {NewsTitle: model.title, NewsContent: model.text});
      } else {
        res.end('No such item.');
      }
    });

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

      // 为每条新闻添加 id 属性
      urlObj.query.id = list.length; 

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


    // 1. 读取 data.json，将读取到的数据转换为 list 数组
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {

      var list;
      if (err) {
        if (err.code === 'ENOENT') {
          list = [];
        } else {
          throw err;
        }
      }

      // 2. 获取去用户 post 提交的数据，并且把本次用户提交的数据 保存到 list 中
      list = JSON.parse(data) || [];


      // 3. 获取 用户 post 提交的数据
      var buffers = [];

      // 获取 post 数据，需要监听 request 对象的 data 事件 和 end 事件
      req.on('data', function (chunk) {
        // 参数 chunk 是一个 Buffer类型
        // 每次浏览器有部分数据传输到服务器都会触发一次 data 事件
        buffers.push(chunk);

      });


      // 监听 end 事件，表示数据上传完毕
      req.on('end', function () {
        // 当 end 事件被触发，表示浏览器数据上传完毕
        // 此时，所有上传上来的数据都在 buffers 数组中

        // 把 buffers 数组中的每个小 Buffer 对象，转换为一个大的 Buffer 对象
        // 当执行完毕下面这句代码后， buffers 就不是数组了，而是一个大的 Buffer 对象
        // 这个 buffers 中保存的是 'title=aaaaa&url=http%3A%2F%2Flocalhost%3A9090%2Fsubmit&text=xxxxx' 字符串的二进制形式
        buffers = Buffer.concat(buffers);


        // 1. 先把 buffers 转换为字符串【把二进制Buffer对象，转成字符串】
        buffers = buffers.toString('utf8');

        // 2. 把 查询字符串，转为 json 字符串
        // 3. 把 json 字符串 转为 json 对象


        // 使用 querystring 内置模块，可以直接把 查询字符串 转换为 json 对象
        var reqBody = querystring.parse(buffers);

        // 为每条新闻添加 id 属性
        reqBody.id = list.length;


        // 把获取到的请求报文体（post 提交的数据）写入到 list 数组中
        list.push(reqBody);


        // 再把 list 数组写回到 data.json 文件中
        fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err) {
          if (err) {
            throw err;
          }

          res.writeHead(301, 'Moved Permanently', {
            'Location': '/index'
          });

          res.end();
        })

      });


    });

    


    // 3. 把新的 list 数组再写回到 data.json 


  } else if (reqUrl.startsWith('/resources')) {

    // 如果请求的是以 /resources 开头, 那么就把这个请求当做静态资源来处理
    res.render(path.join(__dirname, reqUrl));
  } else {
    // 都认为是请求不存在的页面
    res.statusCode = 404;
    res.statusMessage = 'Not Found';
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.end('<h1>page not found</h1>');
  }



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


  res.render = function (filename, tplData) {


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


      // 在向浏览器响应数据之前，进行模板替换操作
      if (tplData) {
        // 则进行模板替换
        // 通过 underscore 进行模板替换
        // _.template() 的返回值，就是一个编译好的函数，这个函数可以接受一个{}对象，
        // 作为将来模板中数据替换的对象

        // var compiled = _.template(data);
        // data= compiled(tplData);
        data = _.template(data.toString())(tplData);
      }

      // 向浏览器响应内容，并结束响应
      res.end(data);
    });
  };
}