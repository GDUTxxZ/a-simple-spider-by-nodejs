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