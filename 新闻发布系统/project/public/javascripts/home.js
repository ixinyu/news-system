;(function(){
	$(function(){
		var $usename=$(".top-t").children("span").html();
			//jqueryui日期
			$( "#date" ).datepicker();
			
			//jqueryui 弹出框
			    $( "#dialog" ).dialog({
			      autoOpen: false,
			      width:800,
			      height: 500,
//			      modal: true,
			      show: {
			        effect: "blind",
			        duration: 1000
			      },
			      hide: {
			        effect: "explode",
			        duration: 1000
			      }
			      
			    });
			 
			    $( "#opener" ).click(function() {
			      $( "#dialog" ).dialog( "open" );
			    });
			
				//完善个人信息页面
			$(".save").click(function(){
 				$( "#dialog" ).dialog( "close" );
				$riqi=$(".seldat").val();
				$city=$(".city").val();
				$num=$(".num").val();
				console.log($riqi);
				$(".curdata").html($riqi);
				$(".curcity").html($city);
				$(".curnum").html($num);
				$(".cursel1").html($(".sel1").val());
				$(".cursel2").html($(".sel2").val());
				$(".cursel3").html($(".sel3").val());
			})
			
			
//			头部
			$(".ge").mouseenter(function(){
				$(".personal").show();
			})
			$(".personal").mouseleave(function(){
				$(this).hide();
			})
			//头部注销
			$(".logout").click(function(){
				if($(".logname").val()==""){
					alert("输入用户名后才可以注销");
				}else{
				$.ajax({
					type:"post",
					url:"/users/logout",
					data:{usename:$(".logname").val()},
					success:function(data){
						console.log(data);
						if(data==1){
							alert("注销成功");
							location.href="/home";	
						}
					}
				});
				}
			})
			
			
			//添加数据提交
			$("#tijiao").click(function(){
				$.ajax({
					type:"post",
					url:"users/home",
					data:{title:$("#exampleInputEmail1").val(),txt:$("#txt").val(),name:"add"},
					success:function(data){
						console.log(data);
						
						if(data==1){
							if($usename=="admin"){
								location.href="/home";
							}else{
								location.href="/ordinary";
							}
							
						}else{
							alert("插入失败，请重试");
						}
					}
				});
			})
			
			//删除
			$(".shanchu").click(function(){
				$.ajax({
					type:"post",
					url:"users/home",
					data:{id:$(this).data().id,name:"del"},
					success:function(data){
						console.log(data);
						if(data==1){
							$(this).parent().parent().remove();
							if($usename=="admin"){
								location.href="/home";
							}else{
								location.href="/ordinary";
							}
						}else{
							alert("插入失败，请重试");
						}
					}
				})
			})
			
			//修改
			$(".modify").click(function(){
				var $id=$(this).data().id;
				var $that=$(this);
				$("#xiugai").click(function(){
					var title=$("#exampleInputEmail1").val();
					var txt=$("#txt").val();
					console.log("aaa");
					$.ajax({
					type:"post",
					url:"users/home",
					data:{id:$id,title:title,txt:txt,name:"xiugai"},
					success:function(data){
						console.log(data);
						if(data==1){
							$that.parent().siblings(".title").html("222")
							.siblings(".text").val(txt);
							if($usename=="admin"){
								location.href="/home";
							}else{
								location.href="/ordinary";
							}
								
						}else{
							alert("插入失败，请重试");
						}
					}
				});
				return false;
				});
				
			})
			
			//账号查询
			$(".cha1").click(function(){
				var tit=$(".sou-first").val();
				$.ajax({
					type:"post",
					url:"/users/sousuo1",
					data:{tit:tit},
					success:function(a){
						console.log(a);
						if(a==1){				    
							location.href="/sousuo1?tit="+tit;
						}else{
							alert("该数据不存在,请重新确认后查询");
							location.href="/home";
						}
					}
				});
			})
			
			//内容查询
			$(".cha2").click(function(){
				var txt=$(".sou-two").val();
				$.ajax({
					type:"post",
					url:"/users/sousuo2",
					data:{txt:txt},
					success:function(a){
						console.log(a);
						if(a==1){				    
							location.href="/sousuo2?txt="+txt;
						}else{
							alert("该数据不存在,请重新确认后查询");
							if($usename=="admin"){
								location.href="/home";
							}else{
								location.href="/ordinary";
							}
							
						}
					}
				});
			})
			
			//侧边栏
			$(".tips>li").click(function(){
				$(this).children("div").slideToggle();
			})
			
		 	//右侧tap栏
		 	$(".mr>p>span").click(function(){
		 		var index=$(this).index();
//		 		console.log(index);
		 		$(".tapwrap").children().eq(index).stop().slideDown().siblings().hide();
		 		$(".mr").children("em:first").html($(this).children("em").html())
		 	})
		 	
		 	//图表
		 // 路径配置
	        var myChart = echarts.init(document.getElementById('main')); 
            var option = {
		    title : {
		        text: '近一周数据展示',
		        subtext: '纯属虚构'
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['最大值','最小值']
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : ['周一','周二','周三','周四','周五','周六','周日']
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            axisLabel : {
		                formatter: '{value} °C'
		            }
		        }
		    ],
		    series : [
		        {
		            name:'最高气温',
		            type:'line',
		            data:[11, 11, 15, 13, 12, 13, 10],
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            }
		        },
		        {
		            name:'最低气温',
		            type:'line',
		            data:[1, -2, 2, 5, 3, 2, 0],
		            markPoint : {
		                data : [
		                    {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name : '平均值'}
		                ]
		            }
		        }
		    ]
		};
		 myChart.setOption(option); 
		 
		//个人文章
		$(".alone").click(function(){
			var $uname=$(".top-t>span").html();
			if($uname==""){
				alert("登录后才可以查看个人文章哦");
			}else{
				
				location.href="/alone?name="+$uname;
			}
		})
	   
		 
			
		})
})();
