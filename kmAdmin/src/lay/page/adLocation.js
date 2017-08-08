layui.define(['global', 'form', 'laydate', 'upload'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;

	var modName = '广告位';

    $('#side').load('../include/side.html', function(a,b){
    	$('#1_2').addClass('layui-this')
    		.parents('li').addClass('layui-nav-itemed')
    			.siblings().removeClass('layui-nav-itemed');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('广告位');
    });
    /* 增加和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'新增',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '670px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	edit: function() {
    		$('#addBtn').remove();
			layer.open({
				title:'修改',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['480px', '670px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	del: function(){
    		console.log('删除');
    	},
    	onOff: function(){
    		console.log('广告开关');
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */

    /* 显示图片 */
	$('.ad_position').on('click', function(){
		var _self = $(this), img = '<img src="'+ _self.data('img')+ '" class="ad_position_show" />';
		layer.open({
			type:4,
			shadeClose: true,
			content:[img, _self]
		})
	})
	/* 上传图片前方法 */
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
    /* 上次图片方法 */
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
    /* 复选框方法 */
	function checkbox_val(plat, cruVal, isCheck){
		var value = $('input[name="'+ plat +'"]').val();
	    if(isCheck){
	    	if(value==''){
				$('input[name="'+ plat +'"]').val(cruVal)
	    	}else{ 
	    		$('input[name="'+ plat +'"]').val(value+','+cruVal)
	    	}
	    }else{
	    	var _v = value.split(','),v=[];
	    	if(_v.length==1) $('input[name="'+ plat +'"]').val('');
	    	else{
	    		for (var i = 0; i < _v.length; i++) {
	    			if(_v[i] != cruVal){
	    				v.push(_v[i]);
	    			}
	    		};
	    		$('input[name="'+ plat +'"]').val(v.join(','));
	    	}
	    }
	    console.log($('input[name="'+ plat +'"]').val());
	}

	form.on('checkbox(platform)', function(data){
	    checkbox_val('platform',data.value,data.elem.checked)
	});

	form.on('checkbox(version)', function(data){
	    checkbox_val('version',data.value,data.elem.checked)
	});

	form.on('checkbox(layout)', function(data){
	    checkbox_val('layout',data.value,data.elem.checked)
	});

	form.on('checkbox(adsType)', function(data){
	    checkbox_val('adsType',data.value,data.elem.checked)
	});
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
		
	exports('adLocation', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    