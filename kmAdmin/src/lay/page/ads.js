layui.define(['global', 'form', 'laydate', 'upload'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;
    $('#side').load('../include/side.html', function(a,b){
    	$('#1_4').addClass('layui-this')
    		.parents('li').addClass('layui-nav-itemed')
    			.siblings().removeClass('layui-nav-itemed');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('广告管理');
    });
    /* 新增和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'新增广告位',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '600px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	edit: function() {
    		$('#addBtn').remove();
			layer.open({
				title:'修改广告位',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '600px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	shelves: function() {
    		console.log('上架下架')
    	},
    	toTop: function() {
    		console.log('置顶')
    	},
    	viewData: function() {
    		console.log('查看统计数据')
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */
	
	/* 开始和结束时间 */
	var start = {
		min: laydate.now(),
		max: '2099-06-16 23:59:59',
		istoday: false,
		istime: true,
		format: 'YYYY-MM-DD hh:mm:ss',
		choose: function(datas){
			end.min = datas; //开始日选好后，重置结束日的最小日期
			end.start = datas //将结束日的初始值设定为开始日
		}
	};
  	var end = {
    	min: laydate.now(),
    	max: '2099-06-16 23:59:59',
    	istoday: false,
		istime: true,
		format: 'YYYY-MM-DD hh:mm:ss',
    	choose: function(datas){
      		start.max = datas; //结束日选好后，重置开始日的最大日期
    	}
  	};
	document.getElementById('startTime').onclick = function(){
	    start.elem = this;
	    laydate(start);
	}
	document.getElementById('endTime').onclick = function(){
	    end.elem = this
	    laydate(end);
	}
	/* 上传图片方法 s */
	function getAuth(isCross,callback,type){
    	if(!type) type = 'image_req';
    	var url = "http://test.kuaima.cn/km_task/upload_preparing?"+type+"=1";
    	if(isCross) { url = url + "&cross=1"; }
    	$.ajax({
    		url:url,
    		type: "get",
    		dataType: "json",
    		success: function(d){
    			!!callback&&$.isFunction(callback)&&callback(d);
    		}
    	});
    }
    getAuth(true,function(d){
    	console.log(d)
		layui.upload({
			url: 'http://v0.api.upyun.com/'+ d.data.IMAGE.path +'/',
			data:{
				"expire_at": d.data.IMAGE.policy,
				"policy": d.data.IMAGE.policy,
				"signature": d.data.IMAGE.signature
			},
    		ext: 'jpg|png|gif',
			before: function(input){
    			//返回的参数item，即为当前的input DOM对象
    			console.log('文件上传中');
  			},
			success: function(data, input){
				// try {
		  //         res = JSON.parse(res);
		  //       } catch(e){
		  //         res = {};
		  //       }
        		function flightHandler(data){
        			console.log(data)
            	}
		  		console.log(input);
		  		typeof data;

			}
		});  
    })
    /* 上传图片方法 end */

	//监听提交
	form.on('submit(check)', function(data){
	    console.log(data)
	    return false;
	});
	form.on('submit(add)', function(data){
	    console.log(data)
	    return false;
	});
	form.on('submit(update)', function(data){
	    console.log(data)
	    return false;
	});
		
	exports('ads', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    