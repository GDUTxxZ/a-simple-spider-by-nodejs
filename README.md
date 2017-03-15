# a-simple-spider-by-nodejs
a-simple-spider-by-nodejs
根据 手把手教你做爬虫 这一教程，我完成了第一个Nodejs爬虫，并且自己修改了一下。

做了一个爬取豆瓣电影首页正在热映的电影的爬虫。

爬虫在使用Nodejs自带的 fs（把信息保存到本地文件中，当然也可以链接数据库存入mongodb中，暂时我还不会，以后再补上），https（发送https请求到豆瓣后台获取信息） 外，还使用了string_decoder(nodejs自带的字符串解码器)，cheerio（后端用于处理发回的数据，语法近似jQuery）处理获取的数据。

[cheerio中文api](http://cnodejs.org/topic/5203a71844e76d216a727d2e)  
[node.js中文api](http://nodejs.cn/api/)

--------

该爬虫分为以下几步：

一、获取要爬取网页的url

二、使用https向网页url发送请求，获取该网页的数据

三、使用string_decoder解码数据，使用cheerio再处理

四、从上一步信息中提取出当前网页电影的详情，以及将接下来要爬取的网页url保存下来

--------

进行第一步和第四步之前要先分析即将获取网页的dom结构，使用浏览器开发者工具。

首先我们随便点开豆瓣一部电影的详情页，以下举例：

![豆瓣电影《你的名字》详情页](http://upload-images.jianshu.io/upload_images/5127831-2ddd72afcc7dd870.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

分析整个页面结构太繁琐了，这里就不列举了，我们得到的信息有：

当前影片的信息：电影的名字、简介、url。

![](http://upload-images.jianshu.io/upload_images/5127831-eb6da7d1aa95e5a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

从此处的各个<a>标签处获取的影片的信息：其他电影的url

以下是该爬虫的初步代码，完成了通过url获取当前网页数据的功能：

```js
var https = require('https');//nodejs自带模块,发送https请求
var StringDecoder = require('string_decoder').StringDecoder;//将获取的数据解码
var decoder = new StringDecoder('utf8');//一个实例
var cheerio = require('cheerio');//处理解码后的数据，语法近似jQuery
var url = 'https://movie.douban.com/subject/26683290/';
var req = https.request(url, (res) => {
        console.log('get data:\n')
        res.on('data', function(data) {
                data = decoder.write(data);//解码后的数据
                var $ = cheerio.load(data);//cheerio载入数据
                //$('body')是一个dom对象，对其调用.text()获取文本内容
                //console.log($.text().trim());
                console.log($('#content>h1').text().trim());//片名及上映时间
                $('#mainpic>a>img').each(function(i, elem) {//电影图片url
                        console.log($(this).attr('src'));
                });
                console.log($('#link-report>span[property="v:summary"]').text());//电影简介
        });
})
req.on('error', (err) => {
        console.log(err);
})
req.end();
console.log('wait....');
```

上面的代码有一处问题，在获取图片url是，原本我想直接$('#mainpic>a>img').attr('src');，但是使用这种方式会多出许多undefinded，查了很多地方都找不到原因，改用each就不会有这个问题，这个坑以后再填。
