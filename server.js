let express = require("express"),
	server = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	fs = require("fs");


// 托管静态资源
server.use(express.static("statics"));
server.use(express.static("uploadcache"));

// 配置数据编码处理
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
	extended : true
}));

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/lgw",function(){
	console.log("数据库连接成功！");
});


let mPosition = require("./models/position");
// 查找全部职位信息
server.post("/api/findAll",function(req,res){
	let {index,type} = req.body;
	index = Number(index);
	index = index || 1;

	if(type == "init"){
		let _index = (index - 1) * 5;
		mPosition.find({},function(err,doc){
			res.json({
				code : 0,
				list : doc.slice(_index,_index + 5),
				total : doc.length,
				index : index
			});
		});
	}
	if(type == "del"){
		mPosition.find({},function(err,doc){
			if(doc.length % 5 === 0){
				let _index = (index - 2) * 5;
				if(_index < 0) _index = 0;
				res.json({
					code : 0,
					list : doc.slice(_index,_index + 5),
					total : doc.length,
					index : (index - 1)
				});
			} else {
				let _index = (index - 1) * 5;
				res.json({
					code : 0,
					list : doc.slice(_index,_index + 5),
					total : doc.length,
					index
				});
			}
		});
	}
	if(type == "add"){
		mPosition.find({},function(err,doc){
			index = Math.ceil(doc.length / 5);
			if((doc.length - 1) % 5 === 0){
				let _index = (index - 1) * 5;
				res.json({
					code : 0,
					list : doc.slice(_index,_index + 5),
					total : doc.length,
					index
				});
			} else {
				let _index = (index - 1) * 5;
				res.json({
					code : 0,
					list : doc.slice(_index,_index + 5),
					total : doc.length,
					current : Math.ceil(doc.length / 5),
					index
				});
			}
		});
	}
});

// 处理翻页
server.post("/api/page",function(req,res){
	let {current} = req.body;
	mPosition.find({}).skip((current - 1) * 5).limit(5).exec(function(err,doc){
			if(err) return;
			res.json({
				code : 0,
				list : doc,
				index : current
			});	
		});
});

// 处理图片上传
let upload = require("./statics/lib/upload");
server.post("/api/upload",function(req,res){
	upload.upload(req,res);
});


// 处理添加职位
server.post("/api/addPosition",function(req,res){
	let position = new mPosition(req.body);
	position.save(function(err,doc){
		if(err) return;
		res.json({
			code : 0,
			msg : "保存成功"
		});
	});
});

// 处理删除一条职位信息
server.post("/api/delete",function(req,res){
	let {_id,imgPath} = req.body;
	mPosition.findOneAndRemove({_id},function(err,doc){
		if(err) return;
		res.json({
			code : 0,
			msg : "删除成功"
		});
	});
	// 删除服务器上的图片资源
	imgPath = "./uploadcache" + imgPath;
	fs.unlink(imgPath,function(){
		console.log("删除成功")
	});
});

// 处理修改一条职位信息
server.post("/api/update",function(req,res){
	let {_id,position,company,exp,type,pay,address,img,oldImg} = req.body;
	mPosition.findOneAndUpdate({_id},{position,company,exp,type,pay,address,img},{new : true},function(err,doc){
		if(err) return;
		res.json({
			code : 0,
			msg : "修改成功",
			list : [doc]
		});
	});
	oldImg = "./uploadcache" + oldImg;
	fs.unlink(oldImg,function(){
		console.log("修改删除成功")
	});
});


let mUser = require("./models/users");
// 处理用户注册
server.post("/api/registUser",function(req,res){
	let {name,pwd,email} = req.body;
	let saveUser = new mUser({name,pwd,email}); 
	saveUser.save(function(err,doc){
		if(err) return;
		res.json({
			code : 0,
			msg : "注册成功"
		});
	});
});

// 处理用户登录
server.post("/api/login",function(req,res){
	let {name,pwd} = req.body;
	mUser.find({name},function(err,doc){
		if(err) return;
		if(!doc.length){
			res.json({
				code : 1,
				msg : "用户名错误！"
			});
		} else if(doc[0].pwd != pwd){
			res.json({
				code : 2,
				msg : "密码错误！"
			});
		} else {
			res.json({
				code : 0,
				msg : "登录成功",
				body : doc
			});
		}
	});
});


// 监听端口8888
server.listen(8888,function(){
	console.log("服务器启动成功！");
});
