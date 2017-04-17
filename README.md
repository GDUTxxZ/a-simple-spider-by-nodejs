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

首先我们随便点开豆瓣一部电影的详情页

分析整个页面结构太繁琐了，这里就不列举了，我们得到的信息有：

当前影片的信息：电影的名字、简介、url。

从各个<a>标签处获取的影片的信息：其他电影的url


#使用方法：
  
将该项目下载到本地后，运行
```
npm install  
node spider.js
```
  
即可
