"use strict";
exports.__esModule = true;
var express = require("express");
var fs = require("fs");
var multer = require("multer");
var host = "http://172.30.144.32:8088/image/";
var app = express();
// app.use(express.static('dist'));

//跨域设置
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
});

var storage_main = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `./image/${decodeURI(req.body.subjectName)}`);        
    },
    filename: function(req, file, cb) {
        cb(null, `mainPic_${file.originalname}`)
    }
})
var storage_typical = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,  `./image/${decodeURI(req.body.subjectName)}`);
    },
    filename: function(req, file, cb) {
        cb(null, `typicalPic_${file.originalname}`)
    }
})
var upload_main = multer({ storage: storage_main });
var upload_typical = multer({ storage: storage_typical });

//创建主体名称目录
app.get('/mkSubjectDir',function(req, res, next){
    let dir = `./image/${decodeURI(req.query.subjectName)}`;
    fs.access(dir, function(err){
        if(err){
            fs.mkdir(dir);           
        }
        res.send({
            code : 0,
            data: null,
            msg:"主体名称目录已创建"
        });
    });
});
//上传主图
app.post('/mainPic', upload_main.array('imgfile', 40), function(req, res, next) {
    var files = req.files;
    if (!files[0]) {
        res.send({
            code : -1,
            data: null,
            msg:"图片上传失败"
        });
    } else {
        res.send({
            code : 0,
            data: {
                "image_url": host + `${req.body.subjectName}/mainPic_${encodeURIComponent(req.files[0].originalname)}`
            },
            msg:"图片上传成功"
        });
    }
})

//上传典型图片
app.post('/typicalPic', upload_typical.array('imgfile', 40), function(req, res, next) {
    var files = req.files;
    if (!files[0]) {
        res.send({
            code : -1,
            data: null,
            msg:"图片上传失败"
        });
    } else {
        res.send({
            code : 0,
            data: {
                "image_url": host + `${req.body.subjectName}/typicalPic_${encodeURIComponent(req.files[0].originalname)}`
            },
            msg:"图片上传成功"
        });
    }
})

var server = app.listen(8089, '172.30.144.32', function() {
    console.log('server is running at port 8089...');
});