var https = require('https');//nodejs自带模块,发送https请求
var fs = require('fs');//nodejs自带模块,本地文件操作
var request = require('request');//发送request请求图片
var cheerio = require('cheerio');//处理解码后的数据，语法近似jQuery
var fetch_number = 0;
var fetch_max = 10;//用于控制爬取网页的数量
var url_list = {};
url_list['https://movie.douban.com/subject/26683290/'] = true;//初始爬取点

//创建好存放数据的文件夹,data存放文本数据,img存放图片
fs.mkdir('./img/', function(error) {
    console.log(error);
});
fs.mkdir('./data/', function(error) {
   console.log(error);
})
function fetchData(url) {
    fetch_number++;
    if (fetch_number < fetch_max) {
        https.get(url, function(res) {
            var html = '';//存储整个页面的Html
            res.on('data', function(chunk) {
                html += chunk;
            });
            res.on('end', function() {
                var $ = cheerio.load(html);//cheerio载入数据
                var movie_info = {//建立一个对象存储影片信息
                    name: $('#content>h1').text().replace(/\s/g,""),//片名
                    imgUrl: $('#mainpic>a>img').attr('src'),//电影图片url
                    summary: $('#link-report span[property="v:summary"]').text().replace(/\s/g,""),//电影简介
                };
                save(movie_info);
                $('div.recommendations-bd>dl>dt>a').each(function(i, elem) {
                    var other_url = $(this).attr('href');//其他影片url
                    //通过对象去重
                    if(!url_list[other_url]) {
                        fetchData(other_url);
                        url_list[other_url] = true;
                    }
                });
            });
            res.on('error', (err) => {
                console.log(err);
            })  
        });
    }
}

//在本地存储影片信息
function save(movie_info) {
    var text = JSON.stringify(movie_info)
    fs.appendFile('./data/' + movie_info.name + '.txt', text, 'utf-8', function(error) {
        if (error) {
            console.log(error);
        }
    });
    saveImg(movie_info.name, movie_info.imgUrl);
}
function saveImg(img_title, img_url) {
    var img_filename = img_title + '.jpg';
    //用HEAD方法请求的话，则服务器返回的只是响应标题，而不会返回被请求的文挡，HEAD方法通用于一些搜索引擎中
    request.head(img_url, function(error, res, body) {
        if (error) {
            console.log(error);
        }
    })
    request(img_url).pipe(fs.createWriteStream('./img/' + img_title + '.jpg'));//通过流的方式，把图片写到本地/image目录下。
}
fetchData('https://movie.douban.com/subject/26683290/');
console.log('wait....');