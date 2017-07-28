layui.define(['global', 'form', 'laydate', 'upload'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;
    $('#side').load('../include/side.html', function(a,b){
    	$('#1_7').addClass('layui-this');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('搜索补量');
    });
    /* 增加和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'新增搜索',
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
				title:'修改搜索',
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
	/* 开始和结束时间 e */


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
		
	exports('searchKeywords', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    