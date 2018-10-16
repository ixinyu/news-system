var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
var db_str='mongodb://localhost:27017/bb';
var upload=require('./upload');
var ObjectId=require('mongodb').ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册页面的数据处理
router.post('/register', function(req, res) {
		console.log(req.body);  //测试是否能收到请求数据
		
		mongodb.connect(db_str,(err,db)=>{
			db.collection('user',(err,coll)=>{
				coll.find({usename:req.body.usename}).toArray((err,data)=>{
					if(data.length){
						res.send("0");
					}else{
						coll.insertOne(req.body,()=>{
							res.send("1");
						});
					}
					db.close();
				})
			})
		})
});


//登录页面
router.post('/login', function(req, res) {
//	console.log(req.body);
	mongodb.connect(db_str,(err,db)=>{
			db.collection('user',(err,coll)=>{
				coll.find({usename:req.body.usename}).toArray((err,data)=>{
				console.log(data);
				if(data.length){
						req.session.name=data[0].usename;
						
						coll.find(req.body).toArray((err,data)=>{	
							res.send(data);
						})

					}else{
							res.send("0");
					}
					db.close();
				})
			})
		})
});

//添加,修改，删除员工信息
router.post('/home', function(req, res) {
//	console.log(req.body);
	mongodb.connect(db_str,(err,db)=>{
		db.collection('xinxi',(err,coll)=>{
			if(req.body.name=="add"){
				req.body.names=req.session.name;
				coll.save(req.body,()=>{
					res.send("1");
					db.close();
				})
			}else if(req.body.name=="del"){
				var id=ObjectId(req.body.id);
				coll.remove({_id:id},(err,data)=>{
					res.send("1");
					db.close();
				})
			}else if(req.body.name=="xiugai"){			
				var id=ObjectId(req.body.id);
				coll.update({_id:id},{$set:{title:req.body.title,txt:req.body.txt}},(err,data)=>{
					res.send("1");
					db.close();
				})
			}
		})
	})
});

//账号搜索
router.post('/sousuo1', function(req, res, next) {
	mongodb.connect(db_str,(err,db)=>{
			db.collection('xinxi',(err,coll)=>{
				var tit=new RegExp("^"+req.body.tit);
				console.log(tit);
				coll.find({title:tit}).toArray((err,data)=>{
					console.log(data);
					if(data.length){
						res.send("1");
					}else{
							res.send("0");
					}
					db.close();
				})
			})
		})
});
//内容查询
router.post('/sousuo2', function(req, res, next) {
	mongodb.connect(db_str,(err,db)=>{
			db.collection('xinxi',(err,coll)=>{
				console.log(req.body);
				console.log(req.body.txt);
				var txt=new RegExp("^"+req.body.txt);
				console.log(txt);
				coll.find({txt:txt}).toArray((err,data)=>{
					console.log(data);
					if(data.length){
						res.send("1");
					}else{
							res.send("0");
					}
					db.close();
				})
			})
		})
});



//注销
router.post('/logout', function(req, res, next) {
	
	mongodb.connect(db_str,(err,db)=>{
			db.collection('user',(err,coll)=>{		
				coll.remove({usename:req.body.usename},()=>{
					res.send("1");
					db.close();
				})
			})
		})
});


//富文本
router.post('/uploadImg',(req,res)=>{
	upload(req,res);
})

module.exports = router;
