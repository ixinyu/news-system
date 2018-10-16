var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/bb';
var async=require('async');
var ObjectId=require('mongodb').ObjectId;
var querystring=require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册页面的渲染
router.get('/register', function(req, res, next) {
  res.render('register', {});
});

//登录视图
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

//首页视图----从数据库中查找数据加到页面上
router.get('/home', function(req, res, next) {
	
	mongodb.connect(db_str,(err,db)=>{
		db.collection("xinxi",(err,coll)=>{
			//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
			//页数
			var page=0;
			//数据总条数
			var count=0;
			//每页展示的条数
			var size=4;
			
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size);
						
						//上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
					})
					
					callback(null,'');
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
					
				}
			],function(err,data){
				if(req.session.name=="admin"){
					res.render('home', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size});
				}else{
					res.render('ordinary', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size,code:0});
				
				}	
				db.close();
				
			})
			
			/*coll.find({}).sort({_id:1}).toArray((err,data)=>{
				  res.render('home', {name:req.session.name,data:data});
					db.close();
			})*/
		})
	})
});

//普通用户
router.get('/ordinary', function(req, res, next) {
	
	mongodb.connect(db_str,(err,db)=>{
		db.collection("xinxi",(err,coll)=>{
			//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
			//页数
			var page=0;
			//数据总条数
			var count=0;
			//每页展示的条数
			var size=4;
			
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size);
						
						//上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
					})
					
					callback(null,'');
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
					
				}
			],function(err,data){
//				var code=0;
				res.render('ordinary', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size,code:0});
				db.close();
				
			})
			
		})
	})
});


//账号搜索
router.get('/sousuo1', function(req, res, next) {
	mongodb.connect(db_str,(err,db)=>{
			db.collection('xinxi',(err,coll)=>{
				var tit=new RegExp("^"+req.query.tit);
				console.log(tit)
				//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
			//页数
			var page=0;
			//数据总条数
			var count=0;
			//每页展示的条数
			var size=4;
			
			async.series([
				function(callback){
					coll.find({title:tit}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size);
						
						//上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
					})
					
					callback(null,'');
				},
				function(callback){
					coll.find({title:tit}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
					
				}
			],function(err,data){
				
				res.render('home', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size});
				
				db.close();
				
			})
			
			})
		})
});

//内容搜索
router.get('/sousuo2', function(req, res, next) {
	mongodb.connect(db_str,(err,db)=>{
			db.collection('xinxi',(err,coll)=>{
				var txt=new RegExp("^"+req.query.txt);
				console.log(txt)
				//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
			//页数
			var page=0;
			//数据总条数
			var count=0;
			//每页展示的条数
			var size=4;
			
			async.series([
				function(callback){
					coll.find({txt:txt}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size);
						
						//上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
					})
					
					callback(null,'');
				},
				function(callback){
					coll.find({txt:txt}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
					
				}
			],function(err,data){
				if(req.session.name=="admin"){
					res.render('home', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size});
				}else{
					res.render('ordinary', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size,code:0});
				
				}
				console.log(data[1]);
					db.close();
				
			})
			})
		})
});
	
	
//个人文章
router.get('/alone', function(req, res, next){
	mongodb.connect(db_str,(err,db)=>{
			db.collection('xinxi',(err,coll)=>{
		
				//页码
			var pageNo=req.query.pageNo;
			pageNo=pageNo?pageNo:1;
			//页数
			var page=0;
			//数据总条数
			var count=0;
			//每页展示的条数
			var size=4;
			
			async.series([
				function(callback){
					coll.find({names:req.query.name}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size);
						
						//上一页下一页
						pageNo=pageNo<=1?1:pageNo;
						pageNo=pageNo>=page?page:pageNo;
						
					})
					
					callback(null,'');
				},
				function(callback){
					coll.find({names:req.query.name}).sort({_id:-1}).limit(size).skip((pageNo-1)*size).toArray((err,data)=>{
						callback(null,data);
					})
					
				}
			],function(err,data){
			/*	res.render('home', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size});
				console.log(data[1]);*/
				
				if(req.session.name=="admin"){
					res.render('home', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size});
				}else{
					var code=1;
					res.render('ordinary', {name:req.session.name,data:data[1],pageNo:pageNo,page:page,count:count,size:size,code:1});
				}
				db.close();
				
			})
			
			})
			
		})
});






module.exports = router;
